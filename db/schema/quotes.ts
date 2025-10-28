import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { jobs, quoteStatusEnum } from './jobs';

export const jobQuotes = pgTable('job_quotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  janitorId: text('janitor_id').notNull(), // Clerk user ID of janitor
  amountCents: integer('amount_cents').notNull(),
  message: text('message'),
  status: quoteStatusEnum('status').default('pending').notNull(),
  validUntil: timestamp('valid_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const quoteRelations = relations(jobQuotes, ({ one }) => ({
  job: one(jobs, {
    fields: [jobQuotes.jobId],
    references: [jobs.id],
  }),
}));
