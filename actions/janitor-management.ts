'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { janitors, jobAssignments, serviceRequests } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreateJanitorSchema = z.object({
  clerkUserId: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  serviceAreas: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().int().min(0),
  maxJobsPerWeek: z.number().int().min(1).default(10),
});

export type CreateJanitorInput = z.infer<typeof CreateJanitorSchema>;

// You (admin) add a new janitor to your network
export async function createJanitor(input: CreateJanitorInput) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  const parsed = CreateJanitorSchema.parse(input);

  const [janitor] = await db
    .insert(janitors)
    .values({
      clerkUserId: parsed.clerkUserId,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      email: parsed.email,
      phone: parsed.phone,
      serviceAreas: JSON.stringify(parsed.serviceAreas || []),
      specialties: JSON.stringify(parsed.specialties || []),
      hourlyRate: parsed.hourlyRate,
      maxJobsPerWeek: parsed.maxJobsPerWeek,
      status: 'pending_approval',
    })
    .returning();

  revalidatePath('/admin/janitors');
  return janitor;
}

// You (admin) approve/activate a janitor
export async function approveJanitor(janitorId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [updated] = await db
    .update(janitors)
    .set({ 
      status: 'active',
      lastActiveAt: new Date(),
    })
    .where(eq(janitors.id, janitorId))
    .returning();

  revalidatePath('/admin/janitors');
  return updated;
}

// You (admin) suspend a janitor
export async function suspendJanitor(janitorId: string, reason?: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [updated] = await db
    .update(janitors)
    .set({ 
      status: 'suspended',
    })
    .where(eq(janitors.id, janitorId))
    .returning();

  revalidatePath('/admin/janitors');
  return updated;
}

// You (admin) view all janitors
export async function listJanitors(params: { 
  status?: string; 
  page?: number 
}) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  const page = Math.max(1, params.page ?? 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (params.status) {
    conditions.push(eq(janitors.status, params.status as any));
  }

  const data = await db.query.janitors.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: [desc(janitors.joinedAt)],
    limit: pageSize,
    offset,
    with: {
      assignments: {
        with: {
          request: true,
        },
      },
    },
  });

  return { data, page, pageSize };
}

// Janitor views their assignments
export async function getJanitorAssignments(janitorId: string) {
  const { userId } = auth();
  if (!userId || userId !== janitorId) throw new Error('Unauthorized');

  const assignments = await db.query.jobAssignments.findMany({
    where: eq(jobAssignments.janitorId, janitorId),
    orderBy: [desc(jobAssignments.assignedAt)],
    with: {
      request: true,
    },
  });

  return assignments;
}

// Janitor updates their profile
export async function updateJanitorProfile(
  janitorId: string,
  updates: {
    serviceAreas?: string[];
    specialties?: string[];
    hourlyRate?: number;
    maxJobsPerWeek?: number;
    availability?: any;
  }
) {
  const { userId } = auth();
  if (!userId || userId !== janitorId) throw new Error('Unauthorized');

  const updateData: any = {
    lastActiveAt: new Date(),
  };

  if (updates.serviceAreas) {
    updateData.serviceAreas = JSON.stringify(updates.serviceAreas);
  }
  if (updates.specialties) {
    updateData.specialties = JSON.stringify(updates.specialties);
  }
  if (updates.hourlyRate) {
    updateData.hourlyRate = updates.hourlyRate;
  }
  if (updates.maxJobsPerWeek) {
    updateData.maxJobsPerWeek = updates.maxJobsPerWeek;
  }
  if (updates.availability) {
    updateData.availability = JSON.stringify(updates.availability);
  }

  const [updated] = await db
    .update(janitors)
    .set(updateData)
    .where(eq(janitors.clerkUserId, janitorId))
    .returning();

  revalidatePath('/janitor/profile');
  return updated;
}

// You (admin) rate janitor's work
export async function rateJanitorWork(
  assignmentId: string,
  qualityRating: number,
  clientSatisfaction?: number
) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [updated] = await db
    .update(jobAssignments)
    .set({ 
      qualityRating,
      clientSatisfaction,
    })
    .where(eq(jobAssignments.id, assignmentId))
    .returning();

  // Update janitor's overall rating
  await db
    .update(janitors)
    .set({ 
      rating: qualityRating,
      completedJobs: sql`${janitors.completedJobs} + 1`,
      totalEarnings: sql`${janitors.totalEarnings} + ${updated.assignedAmount}`,
    })
    .where(eq(janitors.clerkUserId, updated.janitorId));

  revalidatePath('/admin/service-requests');
  revalidatePath('/admin/janitors');
  return updated;
}
