import { pgTable, uuid, text, integer, timestamp, pgEnum, boolean, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const jobStatusEnum = pgEnum('job_status', [
  'posted', 'bidding', 'assigned', 'in_progress', 'completed', 'canceled'
]);

export const janitorStatusEnum = pgEnum('janitor_status', [
  'active', 'inactive', 'suspended', 'pending_verification'
]);

export const bidStatusEnum = pgEnum('bid_status', [
  'pending', 'accepted', 'rejected', 'withdrawn'
]);

export const assignmentStatusEnum = pgEnum('assignment_status', [
  'pending', 'accepted', 'started', 'completed', 'canceled'
]);

// Companies post cleaning jobs on the marketplace
export const marketplaceJobs = pgTable('marketplace_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: text('company_id').notNull(), // Clerk organization ID
  postedBy: text('posted_by').notNull(), // Clerk user ID who posted
  
  // Job details
  title: text('title').notNull(),
  description: text('description'),
  serviceType: text('service_type').notNull(), // 'office_cleaning', 'deep_clean', etc.
  location: text('location').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  
  // Scheduling
  preferredDate: timestamp('preferred_date', { withTimezone: true }),
  preferredTime: text('preferred_time'), // 'morning', 'afternoon', 'evening', 'flexible'
  urgency: text('urgency').default('normal'), // 'urgent', 'normal', 'flexible'
  
  // Budget
  budgetMin: integer('budget_min_cents'), // Minimum they're willing to pay
  budgetMax: integer('budget_max_cents'), // Maximum they're willing to pay
  estimatedHours: integer('estimated_hours'),
  
  // Marketplace settings
  status: jobStatusEnum('status').default('posted').notNull(),
  biddingEndsAt: timestamp('bidding_ends_at', { withTimezone: true }),
  autoAssign: boolean('auto_assign').default(false), // Auto-assign lowest bid
  
  // Assignment
  assignedJanitorId: text('assigned_janitor_id'),
  acceptedBidId: uuid('accepted_bid_id'),
  finalAmount: integer('final_amount_cents'), // Final agreed amount
  
  // Platform fees
  platformFeePercent: decimal('platform_fee_percent', { precision: 5, scale: 2 }).default('15.00'),
  platformFeeAmount: integer('platform_fee_amount_cents'),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

// Janitors in the marketplace
export const marketplaceJanitors = pgTable('marketplace_janitors', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull(),
  
  // Profile
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  profilePicture: text('profile_picture'),
  
  // Professional info
  status: janitorStatusEnum('status').default('pending_verification').notNull(),
  bio: text('bio'),
  serviceAreas: text('service_areas'), // JSON array of zip codes
  specialties: text('specialties'), // JSON array of service types
  hourlyRate: integer('hourly_rate_cents').notNull(),
  
  // Availability
  availability: text('availability'), // JSON schedule
  maxJobsPerWeek: integer('max_jobs_per_week').default(10),
  
  // Performance metrics
  rating: decimal('rating', { precision: 3, scale: 2 }).default('5.00'),
  totalReviews: integer('total_reviews').default(0),
  completedJobs: integer('completed_jobs').default(0),
  totalEarnings: integer('total_earnings_cents').default(0),
  
  // Verification
  backgroundCheckStatus: text('background_check_status').default('pending'),
  insuranceVerified: boolean('insurance_verified').default(false),
  identityVerified: boolean('identity_verified').default(false),
  
  // Timestamps
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
});

// Janitors bid on jobs
export const jobBids = pgTable('job_bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => marketplaceJobs.id, { onDelete: 'cascade' }),
  janitorId: text('janitor_id').notNull(),
  
  // Bid details
  bidAmount: integer('bid_amount_cents').notNull(),
  message: text('message'),
  estimatedHours: integer('estimated_hours'),
  availableDate: timestamp('available_date', { withTimezone: true }),
  
  // Status
  status: bidStatusEnum('status').default('pending').notNull(),
  
  // Timestamps
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
});

// Job assignments after bid acceptance
export const jobAssignments = pgTable('job_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => marketplaceJobs.id, { onDelete: 'cascade' }),
  janitorId: text('janitor_id').notNull(),
  bidId: uuid('bid_id')
    .notNull()
    .references(() => jobBids.id),
  
  // Assignment details
  status: assignmentStatusEnum('status').default('pending').notNull(),
  finalAmount: integer('final_amount_cents').notNull(),
  janitorEarnings: integer('janitor_earnings_cents').notNull(), // After platform fee
  platformFee: integer('platform_fee_cents').notNull(),
  
  // Tracking
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  reportedHours: integer('reported_hours'),
  
  // Quality control
  companyRating: integer('company_rating'), // Company rates janitor (1-5)
  janitorRating: integer('janitor_rating'), // Janitor rates company (1-5)
  companyReview: text('company_review'),
  janitorReview: text('janitor_review'),
  
  // Timestamps
  assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Platform transactions
export const platformTransactions = pgTable('platform_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id')
    .notNull()
    .references(() => jobAssignments.id),
  
  // Transaction details
  companyPayment: integer('company_payment_cents').notNull(),
  janitorPayment: integer('janitor_payment_cents').notNull(),
  platformFee: integer('platform_fee_cents').notNull(),
  
  // Payment status
  companyPaid: boolean('company_paid').default(false),
  janitorPaid: boolean('janitor_paid').default(false),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  companyPaidAt: timestamp('company_paid_at', { withTimezone: true }),
  janitorPaidAt: timestamp('janitor_paid_at', { withTimezone: true }),
});

// Relations
export const marketplaceJobRelations = relations(marketplaceJobs, ({ many, one }) => ({
  bids: many(jobBids),
  assignments: many(jobAssignments),
  company: one(marketplaceJanitors, {
    fields: [marketplaceJobs.companyId],
    references: [marketplaceJanitors.clerkUserId],
  }),
}));

export const marketplaceJanitorRelations = relations(marketplaceJanitors, ({ many }) => ({
  bids: many(jobBids),
  assignments: many(jobAssignments),
}));

export const jobBidRelations = relations(jobBids, ({ one, many }) => ({
  job: one(marketplaceJobs, {
    fields: [jobBids.jobId],
    references: [marketplaceJobs.id],
  }),
  janitor: one(marketplaceJanitors, {
    fields: [jobBids.janitorId],
    references: [marketplaceJanitors.clerkUserId],
  }),
  assignments: many(jobAssignments),
}));

export const assignmentRelations = relations(jobAssignments, ({ one, many }) => ({
  job: one(marketplaceJobs, {
    fields: [jobAssignments.jobId],
    references: [marketplaceJobs.id],
  }),
  janitor: one(marketplaceJanitors, {
    fields: [jobAssignments.janitorId],
    references: [marketplaceJanitors.clerkUserId],
  }),
  bid: one(jobBids, {
    fields: [jobAssignments.bidId],
    references: [jobBids.id],
  }),
  transactions: many(platformTransactions),
}));
