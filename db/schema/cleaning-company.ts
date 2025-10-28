import { pgTable, uuid, text, integer, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const jobStatusEnum = pgEnum('job_status', [
  'requested', 'quoted', 'accepted', 'assigned', 'in_progress', 'completed', 'canceled'
]);

export const janitorStatusEnum = pgEnum('janitor_status', [
  'active', 'inactive', 'suspended', 'pending_approval'
]);

export const assignmentStatusEnum = pgEnum('assignment_status', [
  'pending', 'accepted', 'started', 'completed', 'canceled'
]);

// Companies request services from "The Link Pro Cleaning Company"
export const serviceRequests = pgTable('service_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: text('company_id').notNull(), // Clerk organization ID of requesting company
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone'),
  
  // Service details
  title: text('title').notNull(),
  description: text('description'),
  serviceType: text('service_type').notNull(), // 'office_cleaning', 'deep_clean', 'regular_maintenance', etc.
  location: text('location').notNull(),
  latitude: text('latitude'),
  longitude: text('longitude'),
  
  // Scheduling
  preferredDate: timestamp('preferred_date', { withTimezone: true }),
  preferredTime: text('preferred_time'), // 'morning', 'afternoon', 'evening', 'flexible'
  urgency: text('urgency').default('normal'), // 'urgent', 'normal', 'flexible'
  
  // Budget and pricing
  budgetRange: text('budget_range'), // 'under_100', '100_300', '300_500', '500_plus'
  estimatedHours: integer('estimated_hours'),
  
  // Status and tracking
  status: jobStatusEnum('status').default('requested').notNull(),
  quotedAmount: integer('quoted_amount_cents'), // Your quote to the company
  assignedJanitorId: text('assigned_janitor_id'), // Which janitor you assigned
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

// Your janitor network (subcontractors)
export const janitors = pgTable('janitors', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull(), // Their Clerk user ID
  
  // Personal info
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  
  // Professional info
  status: janitorStatusEnum('status').default('pending_approval').notNull(),
  serviceAreas: text('service_areas'), // JSON array of zip codes/areas
  specialties: text('specialties'), // JSON array of service types
  hourlyRate: integer('hourly_rate_cents').notNull(), // What you pay them
  
  // Availability
  availability: text('availability'), // JSON schedule
  maxJobsPerWeek: integer('max_jobs_per_week').default(10),
  
  // Performance tracking
  rating: integer('rating').default(5), // Your internal rating
  completedJobs: integer('completed_jobs').default(0),
  totalEarnings: integer('total_earnings_cents').default(0),
  
  // Timestamps
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
});

// Job assignments to janitors
export const jobAssignments = pgTable('job_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id')
    .notNull()
    .references(() => serviceRequests.id, { onDelete: 'cascade' }),
  janitorId: text('janitor_id').notNull(), // Clerk user ID
  
  // Assignment details
  status: assignmentStatusEnum('status').default('pending').notNull(),
  assignedAmount: integer('assigned_amount_cents').notNull(), // What you pay the janitor
  notes: text('notes'), // Special instructions
  
  // Tracking
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  reportedHours: integer('reported_hours'),
  
  // Quality control
  qualityRating: integer('quality_rating'), // Your rating of their work
  clientSatisfaction: integer('client_satisfaction'), // Company's rating
  
  // Timestamps
  assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Communication between you and janitors
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id')
    .notNull()
    .references(() => jobAssignments.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull(), // Your ID or janitor's Clerk user ID
  senderType: text('sender_type').notNull(), // 'admin' or 'janitor'
  message: text('message').notNull(),
  attachments: text('attachments'), // JSON array of file URLs
  
  // Timestamps
  sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
});

// Relations
export const serviceRequestRelations = relations(serviceRequests, ({ many }) => ({
  assignments: many(jobAssignments),
}));

export const janitorRelations = relations(janitors, ({ many }) => ({
  assignments: many(jobAssignments),
}));

export const assignmentRelations = relations(jobAssignments, ({ one, many }) => ({
  request: one(serviceRequests, {
    fields: [jobAssignments.requestId],
    references: [serviceRequests.id],
  }),
  janitor: one(janitors, {
    fields: [jobAssignments.janitorId],
    references: [janitors.clerkUserId],
  }),
  messages: many(messages),
}));
