'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { marketplaceJobs, marketplaceJanitors, jobBids, jobAssignments, platformTransactions } from '@/db/schema';
import { and, eq, inArray, sql, desc, gte, lte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { emitRealtimeEvent } from '@/lib/realtime';

const CreateJobSchema = z.object({
  companyId: z.string(),
  postedBy: z.string(),
  title: z.string().min(3),
  description: z.string().optional(),
  serviceType: z.string(),
  location: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  preferredDate: z.coerce.date().optional(),
  preferredTime: z.string().optional(),
  urgency: z.string().default('normal'),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  estimatedHours: z.number().int().min(1).optional(),
  biddingEndsAt: z.coerce.date().optional(),
  autoAssign: z.boolean().default(false),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

// Companies post jobs on the marketplace
export async function postJob(input: CreateJobInput) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  const parsed = CreateJobSchema.parse(input);

  const [job] = await db
    .insert(marketplaceJobs)
    .values({
      companyId: parsed.companyId,
      postedBy: parsed.postedBy,
      title: parsed.title,
      description: parsed.description,
      serviceType: parsed.serviceType,
      location: parsed.location,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      preferredDate: parsed.preferredDate ? new Date(parsed.preferredDate) : null,
      preferredTime: parsed.preferredTime,
      urgency: parsed.urgency,
      budgetMin: parsed.budgetMin,
      budgetMax: parsed.budgetMax,
      estimatedHours: parsed.estimatedHours,
      biddingEndsAt: parsed.biddingEndsAt ? new Date(parsed.biddingEndsAt) : null,
      autoAssign: parsed.autoAssign,
      status: 'posted',
      platformFeePercent: '15.00', // 15% platform fee
    })
    .returning();

  // Notify janitors about new job
  await emitRealtimeEvent('marketplace:new_job', { 
    type: 'job.posted', 
    jobId: job.id,
    serviceType: job.serviceType,
    location: job.location,
  });
  
  revalidatePath('/company/jobs');
  revalidatePath('/marketplace/jobs');
  return job;
}

// Janitors browse available jobs
export async function browseJobs(params: {
  serviceType?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  page?: number;
}) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  const page = Math.max(1, params.page ?? 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const conditions = [eq(marketplaceJobs.status, 'posted')];
  
  if (params.serviceType) {
    conditions.push(eq(marketplaceJobs.serviceType, params.serviceType));
  }
  if (params.budgetMin) {
    conditions.push(gte(marketplaceJobs.budgetMin, params.budgetMin));
  }
  if (params.budgetMax) {
    conditions.push(lte(marketplaceJobs.budgetMax, params.budgetMax));
  }

  const data = await db.query.marketplaceJobs.findMany({
    where: and(...conditions),
    orderBy: [desc(marketplaceJobs.createdAt)],
    limit: pageSize,
    offset,
    with: {
      bids: {
        where: eq(jobBids.janitorId, userId),
      },
    },
  });

  const [{ count }] = await db.execute<{ count: number }>(
    sql`SELECT COUNT(*)::int as count FROM ${marketplaceJobs} WHERE ${and(...conditions)}`
  );

  return { data, page, pageSize, total: count };
}

// Janitors submit bids
export async function submitBid(input: {
  jobId: string;
  bidAmount: number;
  message?: string;
  estimatedHours?: number;
  availableDate?: Date;
}) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  // Check if job is still accepting bids
  const job = await db.query.marketplaceJobs.findFirst({
    where: eq(marketplaceJobs.id, input.jobId),
  });

  if (!job || job.status !== 'posted') {
    throw new Error('Job is no longer accepting bids');
  }

  if (job.biddingEndsAt && new Date() > job.biddingEndsAt) {
    throw new Error('Bidding period has ended');
  }

  // Check if janitor already bid
  const existingBid = await db.query.jobBids.findFirst({
    where: and(
      eq(jobBids.jobId, input.jobId),
      eq(jobBids.janitorId, userId)
    ),
  });

  if (existingBid) {
    throw new Error('You have already submitted a bid for this job');
  }

  const [bid] = await db
    .insert(jobBids)
    .values({
      jobId: input.jobId,
      janitorId: userId,
      bidAmount: input.bidAmount,
      message: input.message,
      estimatedHours: input.estimatedHours,
      availableDate: input.availableDate ? new Date(input.availableDate) : null,
      status: 'pending',
    })
    .returning();

  // Notify company about new bid
  await emitRealtimeEvent(`company:${job.companyId}:bids`, { 
    type: 'bid.received', 
    bidId: bid.id,
    jobId: input.jobId,
  });

  revalidatePath('/janitor/jobs');
  revalidatePath(`/company/jobs/${input.jobId}`);
  return bid;
}

// Companies view bids for their jobs
export async function getJobBids(jobId: string) {
  const { userId, orgId } = auth();
  if (!userId || !orgId) throw new Error('Unauthorized');

  const job = await db.query.marketplaceJobs.findFirst({
    where: and(
      eq(marketplaceJobs.id, jobId),
      eq(marketplaceJobs.companyId, orgId)
    ),
    with: {
      bids: {
        with: {
          janitor: true,
        },
        orderBy: [desc(jobBids.bidAmount)], // Show lowest bids first
      },
    },
  });

  if (!job) throw new Error('Job not found or unauthorized');

  return job.bids;
}

// Companies accept a bid
export async function acceptBid(bidId: string) {
  const { userId, orgId } = auth();
  if (!userId || !orgId) throw new Error('Unauthorized');

  return await db.transaction(async (tx) => {
    // Get bid and job
    const bid = await tx.query.jobBids.findFirst({
      where: eq(jobBids.id, bidId),
      with: {
        job: true,
      },
    });

    if (!bid) throw new Error('Bid not found');
    if (bid.job.companyId !== orgId) throw new Error('Unauthorized');
    if (bid.job.status !== 'posted') throw new Error('Job is no longer accepting bids');

    // Calculate platform fee
    const platformFeePercent = parseFloat(bid.job.platformFeePercent || '15.00');
    const platformFee = Math.round(bid.bidAmount * (platformFeePercent / 100));
    const janitorEarnings = bid.bidAmount - platformFee;

    // Create assignment
    const [assignment] = await tx
      .insert(jobAssignments)
      .values({
        jobId: bid.jobId,
        janitorId: bid.janitorId,
        bidId: bid.id,
        status: 'pending',
        finalAmount: bid.bidAmount,
        janitorEarnings,
        platformFee,
      })
      .returning();

    // Create transaction record
    await tx
      .insert(platformTransactions)
      .values({
        assignmentId: assignment.id,
        companyPayment: bid.bidAmount,
        janitorPayment: janitorEarnings,
        platformFee,
        companyPaid: false,
        janitorPaid: false,
      });

    // Update bid status
    await tx
      .update(jobBids)
      .set({ 
        status: 'accepted',
        respondedAt: new Date(),
      })
      .where(eq(jobBids.id, bidId));

    // Reject other bids
    await tx
      .update(jobBids)
      .set({ 
        status: 'rejected',
        respondedAt: new Date(),
      })
      .where(and(
        eq(jobBids.jobId, bid.jobId),
        eq(jobBids.status, 'pending')
      ));

    // Update job status
    await tx
      .update(marketplaceJobs)
      .set({ 
        status: 'assigned',
        assignedJanitorId: bid.janitorId,
        acceptedBidId: bid.id,
        finalAmount: bid.bidAmount,
        platformFeeAmount: platformFee,
        updatedAt: new Date(),
      })
      .where(eq(marketplaceJobs.id, bid.jobId));

    // Notify janitor
    await emitRealtimeEvent(`janitor:${bid.janitorId}:assignments`, { 
      type: 'bid.accepted', 
      assignmentId: assignment.id,
      jobId: bid.jobId,
    });

    revalidatePath(`/company/jobs/${bid.jobId}`);
    revalidatePath('/janitor/assignments');
    return assignment;
  });
}

// Janitors accept assignment
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

  await emitRealtimeEvent(`company:${updated.jobId}:assignments`, { 
    type: 'assignment.accepted', 
    assignmentId 
  });
  
  revalidatePath('/janitor/assignments');
  return updated;
}

// Janitors start job
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

  await emitRealtimeEvent(`company:${updated.jobId}:assignments`, { 
    type: 'job.started', 
    assignmentId 
  });
  
  revalidatePath('/janitor/assignments');
  return updated;
}

// Janitors complete job
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

    // Update job status
    await tx
      .update(marketplaceJobs)
      .set({ 
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(marketplaceJobs.id, updated.jobId));

    await emitRealtimeEvent(`company:${updated.jobId}:assignments`, { 
      type: 'job.completed', 
      assignmentId 
    });
    
    revalidatePath('/janitor/assignments');
    return updated;
  });
}
