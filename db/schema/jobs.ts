import { pgTable, uuid, text, integer, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const jobStatusEnum = pgEnum('job_status', [
  'draft', 'open', 'rfq', 'assigned', 'in_progress', 'completed', 'canceled'
]);

export const quoteStatusEnum = pgEnum('quote_status', [
  'pending', 'withdrawn', 'accepted', 'rejected', 'expired'
]);

export const assignmentStatusEnum = pgEnum('assignment_status', [
  'pending_acceptance', 'accepted', 'started', 'paused', 'completed', 'canceled'
]);

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: text('org_id').notNull(), // Clerk organization ID
  createdBy: text('created_by').notNull(), // Clerk user ID
  title: text('title').notNull(),
  description: text('description'),
  location: text('location'),
  latitude: text('latitude'), // store as text to avoid numeric precision issues; optional
  longitude: text('longitude'),
  startTime: timestamp('start_time', { withTimezone: true }),
  endTime: timestamp('end_time', { withTimezone: true }),
  budgetCents: integer('budget_cents').default(0).notNull(),
  currency: text('currency').default('USD').notNull(),
  isBroadcast: boolean('is_broadcast').default(false).notNull(),
  status: jobStatusEnum('status').default('draft').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const jobRelations = relations(jobs, ({ many }) => ({
  quotes: many(jobQuotes),
  rfqTargets: many(rfqTargets),
  assignments: many(jobAssignments),
}));
