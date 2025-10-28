'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { serviceRequests, janitors, jobAssignments, messages } from '@/db/schema';
import { and, eq, inArray, sql, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { emitRealtimeEvent } from '@/lib/realtime';

const CreateServiceRequestSchema = z.object({
  companyId: z.string(),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  serviceType: z.string(),
  location: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  preferredDate: z.coerce.date().optional(),
  preferredTime: z.string().optional(),
  urgency: z.string().default('normal'),
  budgetRange: z.string().optional(),
  estimatedHours: z.number().int().min(1).optional(),
});

export type CreateServiceRequestInput = z.infer<typeof CreateServiceRequestSchema>;

// Companies request services from your cleaning company
export async function createServiceRequest(input: CreateServiceRequestInput) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  const parsed = CreateServiceRequestSchema.parse(input);

  const [request] = await db
    .insert(serviceRequests)
    .values({
      companyId: parsed.companyId,
      contactName: parsed.contactName,
      contactEmail: parsed.contactEmail,
      contactPhone: parsed.contactPhone,
      title: parsed.title,
      description: parsed.description,
      serviceType: parsed.serviceType,
      location: parsed.location,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      preferredDate: parsed.preferredDate ? new Date(parsed.preferredDate) : null,
      preferredTime: parsed.preferredTime,
      urgency: parsed.urgency,
      budgetRange: parsed.budgetRange,
      estimatedHours: parsed.estimatedHours,
      status: 'requested',
    })
    .returning();

  await emitRealtimeEvent('admin:service_requests', { 
    type: 'request.created', 
    requestId: request.id 
  });
  
  revalidatePath('/admin/service-requests');
  return request;
}

// You (admin) view all service requests
export async function listServiceRequests(params: { 
  status?: string[]; 
  urgency?: string; 
  page?: number 
}) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  const page = Math.max(1, params.page ?? 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (params.status?.length) {
    conditions.push(inArray(serviceRequests.status, params.status as any));
  }
  if (params.urgency) {
    conditions.push(eq(serviceRequests.urgency, params.urgency));
  }

  const data = await db.query.serviceRequests.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: [desc(serviceRequests.createdAt)],
    limit: pageSize,
    offset,
    with: {
      assignments: {
        with: {
          janitor: true,
        },
      },
    },
  });

  const [{ count }] = await db.execute<{ count: number }>(
    sql`SELECT COUNT(*)::int as count FROM ${serviceRequests} ${
      conditions.length ? sql`WHERE ${and(...conditions)}` : sql``
    }`
  );

  return { data, page, pageSize, total: count };
}

// You quote the company
export async function quoteServiceRequest(requestId: string, quotedAmount: number) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [updated] = await db
    .update(serviceRequests)
    .set({ 
      quotedAmount, 
      status: 'quoted',
      updatedAt: new Date(),
    })
    .where(eq(serviceRequests.id, requestId))
    .returning();

  await emitRealtimeEvent('admin:service_requests', { 
    type: 'request.quoted', 
    requestId 
  });
  
  revalidatePath('/admin/service-requests');
  return updated;
}

// Company accepts your quote
export async function acceptQuote(requestId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [updated] = await db
    .update(serviceRequests)
    .set({ 
      status: 'accepted',
      updatedAt: new Date(),
    })
    .where(eq(serviceRequests.id, requestId))
    .returning();

  await emitRealtimeEvent('admin:service_requests', { 
    type: 'quote.accepted', 
    requestId 
  });
  
  revalidatePath('/admin/service-requests');
  return updated;
}

// You assign job to a janitor
export async function assignJobToJanitor(
  requestId: string, 
  janitorId: string, 
  assignedAmount: number,
  notes?: string
) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  return await db.transaction(async (tx) => {
    // Create assignment
    const [assignment] = await tx
      .insert(jobAssignments)
      .values({
        requestId,
        janitorId,
        assignedAmount,
        notes,
        status: 'pending',
      })
      .returning();

    // Update request status
    await tx
      .update(serviceRequests)
      .set({ 
        assignedJanitorId: janitorId,
        status: 'assigned',
        updatedAt: new Date(),
      })
      .where(eq(serviceRequests.id, requestId));

    await emitRealtimeEvent(`janitor:${janitorId}:assignments`, { 
      type: 'job.assigned', 
      assignmentId: assignment.id,
      requestId,
    });
    
    await emitRealtimeEvent('admin:service_requests', { 
      type: 'job.assigned', 
      requestId,
      assignmentId: assignment.id,
    });

    revalidatePath('/admin/service-requests');
    revalidatePath('/admin/janitors');
    return assignment;
  });
}

// Janitor accepts assignment
export async function janitorAcceptAssignment(assignmentId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [updated] = await db
    .update(jobAssignments)
    .set({ 
      status: 'accepted',
      updatedAt: new Date(),
    })
    .where(and(
      eq(jobAssignments.id, assignmentId),
      eq(jobAssignments.janitorId, userId)
    ))
    .returning();

  await emitRealtimeEvent('admin:service_requests', { 
    type: 'assignment.accepted', 
    assignmentId 
  });
  
  revalidatePath('/admin/service-requests');
  revalidatePath('/janitor/assignments');
  return updated;
}

// Janitor starts job
export async function janitorStartJob(assignmentId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [updated] = await db
    .update(jobAssignments)
    .set({ 
      status: 'started',
      startedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(
      eq(jobAssignments.id, assignmentId),
      eq(jobAssignments.janitorId, userId)
    ))
    .returning();

  await emitRealtimeEvent('admin:service_requests', { 
    type: 'job.started', 
    assignmentId 
  });
  
  revalidatePath('/admin/service-requests');
  revalidatePath('/janitor/assignments');
  return updated;
}

// Janitor completes job
export async function janitorCompleteJob(
  assignmentId: string, 
  reportedHours: number,
  completionNotes?: string
) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  return await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(jobAssignments)
      .set({ 
        status: 'completed',
        completedAt: new Date(),
        reportedHours,
        updatedAt: new Date(),
      })
      .where(and(
        eq(jobAssignments.id, assignmentId),
        eq(jobAssignments.janitorId, userId)
      ))
      .returning();

    // Update request status
    await tx
      .update(serviceRequests)
      .set({ 
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(serviceRequests.id, updated.requestId));

    await emitRealtimeEvent('admin:service_requests', { 
      type: 'job.completed', 
      assignmentId 
    });
    
    revalidatePath('/admin/service-requests');
    revalidatePath('/janitor/assignments');
    return updated;
  });
}
