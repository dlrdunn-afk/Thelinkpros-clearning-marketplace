import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { jobs } from './jobs';

export const rfqTargets = pgTable('rfq_targets', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  janitorId: text('janitor_id').notNull(), // target recipient
  respondedAt: timestamp('responded_at', { withTimezone: true }),
  declinedAt: timestamp('declined_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
