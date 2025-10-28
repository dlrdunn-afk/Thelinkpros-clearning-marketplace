'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { jobs, jobQuotes, rfqTargets, jobAssignments } from '@/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { emitRealtimeEvent } from '@/lib/realtime';

const CreateJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  budgetCents: z.number().int().min(0).default(0),
  currency: z.string().default('USD'),
  status: z.enum(['draft', 'open']).default('draft'),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

function requireOrg() {
  const { userId, orgId } = auth();
  if (!userId || !orgId) throw new Error('Unauthorized: missing organization context');
  return { userId, orgId };
}

export async function listJobs(params: { status?: string[]; q?: string; page?: number }) {
  const { orgId } = requireOrg();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const conditions = [eq(jobs.orgId, orgId)];
  if (params.status?.length) {
    conditions.push(inArray(jobs.status, params.status as any));
  }
  if (params.q) {
    // naive ILIKE
    conditions.push(sql`${jobs.title} ILIKE ${'%' + params.q + '%'}`);
  }

  const data = await db.query.jobs.findMany({
    where: and(...conditions),
    orderBy: (t, { desc }) => [desc(t.updatedAt)],
    limit: pageSize,
    offset,
    with: {
      assignments: true,
      quotes: true,
    },
  });

  const [{ count }] =
    await db.execute<{ count: number }>(sql`SELECT COUNT(*)::int as count FROM ${jobs} WHERE ${and(...conditions)}`);

  return { data, page, pageSize, total: count };
}

export async function createJob(input: CreateJobInput) {
  const { orgId, userId } = requireOrg();
  const parsed = CreateJobSchema.parse(input);

  if (parsed.startTime && parsed.endTime && parsed.endTime <= parsed.startTime) {
    throw new Error('End time must be after start time');
  }

  const [job] = await db
    .insert(jobs)
    .values({
      orgId,
      createdBy: userId,
      title: parsed.title,
      description: parsed.description,
      location: parsed.location,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      startTime: parsed.startTime ? new Date(parsed.startTime) : null,
      endTime: parsed.endTime ? new Date(parsed.endTime) : null,
      budgetCents: parsed.budgetCents ?? 0,
      currency: parsed.currency ?? 'USD',
      status: parsed.status,
    })
    .returning();

  await emitRealtimeEvent(`company:${orgId}:jobs`, { type: 'job.created', jobId: job.id });
  revalidatePath('/dashboard/company/jobs');
  return job;
}

const UpdateJobSchema = CreateJobSchema.partial();

export async function updateJob(jobId: string, input: z.infer<typeof UpdateJobSchema>) {
  const { orgId } = requireOrg();
  const parsed = UpdateJobSchema.parse(input);

  const [current] = await db.select().from(jobs).where(and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)));
  if (!current) throw new Error('Not found');
  if (current.status === 'assigned' || current.status === 'in_progress') {
    // restrict critical fields
    if (parsed.startTime || parsed.endTime || parsed.budgetCents) {
      throw new Error('Cannot change schedule/budget after assignment');
    }
  }
  if (parsed.startTime && parsed.endTime && parsed.endTime <= parsed.startTime) {
    throw new Error('End time must be after start time');
  }

  const [updated] = await db
    .update(jobs)
    .set({
      ...parsed,
      updatedAt: new Date(),
    })
    .where(and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)))
    .returning();

  await emitRealtimeEvent(`company:${orgId}:jobs`, { type: 'job.updated', jobId });
  revalidatePath('/dashboard/company/jobs');
  return updated;
}

export async function deleteJob(jobId: string) {
  const { orgId } = requireOrg();
  // ensure no quotes or not beyond draft
  const [current] = await db.query.jobs.findFirst({
    where: and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)),
    with: { quotes: true },
  });
  if (!current) throw new Error('Not found');
  if (current.status !== 'draft' || (current.quotes?.length ?? 0) > 0) {
    throw new Error('Cannot delete non-draft or job with quotes; consider canceling');
  }

  await db.delete(jobs).where(and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)));
  await emitRealtimeEvent(`company:${orgId}:jobs`, { type: 'job.deleted', jobId });
  revalidatePath('/dashboard/company/jobs');
  return { success: true };
}

export async function cancelJob(jobId: string, reason?: string) {
  const { orgId } = requireOrg();
  const [current] = await db.select().from(jobs).where(and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)));
  if (!current) throw new Error('Not found');
  if (current.status === 'completed' || current.status === 'canceled') return current;

  const [updated] = await db
    .update(jobs)
    .set({ status: 'canceled', updatedAt: new Date() })
    .where(and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)))
    .returning();

  await emitRealtimeEvent(`company:${orgId}:jobs`, { type: 'job.canceled', jobId, reason });
  revalidatePath('/dashboard/company/jobs');
  return updated;
}

const RequestQuotesSchema = z.object({
  jobId: z.string().uuid(),
  janitorIds: z.array(z.string()).min(1).optional(),
  broadcast: z.boolean().default(false),
});

export async function requestQuotes(input: z.infer<typeof RequestQuotesSchema>) {
  const { orgId } = requireOrg();
  const { jobId, janitorIds, broadcast } = RequestQuotesSchema.parse(input);

  return await db.transaction(async (tx) => {
    const [job] = await tx.select().from(jobs).where(and(eq(jobs.id, jobId), eq(jobs.orgId, orgId))).for('update');
    if (!job) throw new Error('Not found');
    if (!['draft', 'open', 'rfq'].includes(job.status)) {
      throw new Error('Job is not available for RFQ');
    }

    if (broadcast) {
      await tx.update(jobs).set({ status: 'rfq', isBroadcast: true, updatedAt: new Date() }).where(eq(jobs.id, jobId));
    } else if (janitorIds?.length) {
      const values = janitorIds.map((jid) => ({ jobId, janitorId: jid }));
      await tx.insert(rfqTargets).values(values).onConflictDoNothing();
      await tx.update(jobs).set({ status: 'rfq', isBroadcast: false, updatedAt: new Date() }).where(eq(jobs.id, jobId));
    } else {
      throw new Error('Provide janitorIds or set broadcast=true');
    }

    await emitRealtimeEvent(`company:${orgId}:jobs`, { type: 'job.rfq_started', jobId });
    revalidatePath(`/dashboard/company/jobs/${jobId}`);
    return { success: true };
  });
}
