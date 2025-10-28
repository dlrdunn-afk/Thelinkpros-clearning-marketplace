'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { jobs, jobQuotes, jobAssignments } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { emitRealtimeEvent } from '@/lib/realtime';

const AcceptQuoteSchema = z.object({ quoteId: z.string().uuid() });

export async function acceptQuote(input: z.infer<typeof AcceptQuoteSchema>) {
  const { orgId } = auth();
  if (!orgId) throw new Error('Unauthorized');
  const { quoteId } = AcceptQuoteSchema.parse(input);

  return await db.transaction(async (tx) => {
    // lock quote and job
    const [quote] = await tx.select().from(jobQuotes).where(eq(jobQuotes.id, quoteId)).for('update');
    if (!quote) throw new Error('Quote not found');

    const [job] = await tx.select().from(jobs).where(and(eq(jobs.id, quote.jobId), eq(jobs.orgId, orgId))).for('update');
    if (!job) throw new Error('Job not found or unauthorized');
    if (!['rfq', 'open'].includes(job.status)) throw new Error('Job is not accepting quotes');

    // ensure no accepted quote exists
    const existingAccepted = await tx.query.jobQuotes.findFirst({
      where: and(eq(jobQuotes.jobId, job.id), eq(jobQuotes.status, 'accepted')),
    });
    if (existingAccepted) throw new Error('Another quote already accepted');

    // update quotes
    await tx.update(jobQuotes).set({ status: 'rejected' }).where(and(eq(jobQuotes.jobId, job.id), eq(jobQuotes.status, 'pending')));
    await tx.update(jobQuotes).set({ status: 'accepted' }).where(eq(jobQuotes.id, quote.id));

    // create assignment
    const [assignment] = await tx
      .insert(jobAssignments)
      .values({
        jobId: job.id,
        janitorId: quote.janitorId,
        quoteId: quote.id,
        status: 'accepted',
      })
      .returning();

    // update job
    await tx.update(jobs).set({ status: 'assigned', updatedAt: new Date() }).where(eq(jobs.id, job.id));

    await emitRealtimeEvent(`company:${orgId}:jobs`, {
      type: 'quote.accepted',
      jobId: job.id,
      quoteId: quote.id,
      assignmentId: assignment.id,
    });
    revalidatePath(`/dashboard/company/jobs/${job.id}`);
    return { success: true, assignmentId: assignment.id };
  });
}

const RejectQuoteSchema = z.object({ quoteId: z.string().uuid(), reason: z.string().optional() });

export async function rejectQuote(input: z.infer<typeof RejectQuoteSchema>) {
  const { orgId } = auth();
  if (!orgId) throw new Error('Unauthorized');
  const { quoteId } = RejectQuoteSchema.parse(input);

  const [quote] = await db.select().from(jobQuotes).where(eq(jobQuotes.id, quoteId));
  if (!quote) throw new Error('Not found');

  const [job] = await db.select().from(jobs).where(and(eq(jobs.id, quote.jobId), eq(jobs.orgId, orgId)));
  if (!job) throw new Error('Unauthorized');

  await db.update(jobQuotes).set({ status: 'rejected' }).where(eq(jobQuotes.id, quoteId));

  await emitRealtimeEvent(`company:${orgId}:jobs`, { type: 'quote.rejected', jobId: job.id, quoteId });
  revalidatePath(`/dashboard/company/jobs/${job.id}`);
  return { success: true };
}

export async function getJobDetails(jobId: string) {
  const { orgId } = auth();
  if (!orgId) throw new Error('Unauthorized');
  const job = await db.query.jobs.findFirst({
    where: and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)),
    with: { quotes: true, assignments: true },
  });
  if (!job) throw new Error('Not found');
  return job;
}
