# The Link Pro - Company Dashboard & Job Management

A comprehensive job management system for companies to create, manage, and track cleaning jobs with real-time updates and quote management.

## Features

- **Job Management**: Create, edit, and cancel cleaning jobs
- **Quote System**: Request quotes from janitors and manage responses
- **Real-time Updates**: Live updates for job status changes and new quotes
- **Assignment Tracking**: Track job assignments and their progress
- **Organization Scoping**: Multi-tenant system with organization-based access control

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Tailwind CSS, Radix UI primitives
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk.dev
- **Real-time**: Socket.io
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk.dev account for authentication
- Socket.io server (optional for real-time features)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/thelinkpro"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Socket.io Real-time Communication
NEXT_PUBLIC_SOCKET_IO_URL=http://localhost:3001
SOCKET_IO_SERVER_URL=http://localhost:3001
SOCKET_IO_AUTH_TOKEN=your_socket_io_auth_token
```

3. Set up the database:

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate
```

4. Start the development server:

```bash
npm run dev
```

## Database Schema

The application uses the following main entities:

- **Jobs**: Core job information (title, description, location, budget, etc.)
- **Job Quotes**: Quotes submitted by janitors for specific jobs
- **RFQ Targets**: Request for quote targets (specific janitors or broadcast)
- **Job Assignments**: Job assignments with status tracking

## API Endpoints

### Server Actions

- `listJobs()` - Get paginated list of jobs with filters
- `createJob()` - Create a new job
- `updateJob()` - Update existing job
- `deleteJob()` - Delete a job (only if draft and no quotes)
- `cancelJob()` - Cancel a job
- `requestQuotes()` - Send RFQ to janitors
- `acceptQuote()` - Accept a quote and create assignment
- `rejectQuote()` - Reject a quote
- `getJobDetails()` - Get detailed job information

## Real-time Events

The system emits the following real-time events:

- `job.created` - New job created
- `job.updated` - Job updated
- `job.deleted` - Job deleted
- `job.canceled` - Job canceled
- `job.rfq_started` - RFQ process started
- `quote.accepted` - Quote accepted
- `quote.rejected` - Quote rejected

## Project Structure

```
/app
  /(dashboard)/dashboard/company/
    /jobs/
      page.tsx              # Jobs list page
      /[jobId]/
        page.tsx            # Job detail page
      /new/
        page.tsx            # Create job page
/components/company-dashboard/
  job-table.tsx             # Data table with filters
  job-filters.tsx            # Status filter, search
  job-form.tsx               # Create/Edit job form
  status-badge.tsx           # Status badges
  rfq-drawer.tsx             # RFQ management
  quotes-panel.tsx           # Quote management
  realtime-provider.tsx      # Real-time updates
  empty-state.tsx            # Empty state UI
/db/schema/
  jobs.ts                    # Jobs schema
  quotes.ts                  # Quotes schema
  rfq.ts                     # RFQ targets schema
  assignments.ts             # Assignments schema
/actions/
  jobs.ts                    # Job management actions
  quotes.ts                  # Quote management actions
/lib/
  realtime.ts                # Socket.io utilities
  utils.ts                   # Utility functions
```

## Key Features Implementation

### Job Lifecycle

1. **Draft/Open**: Job created and ready for RFQ
2. **RFQ**: Request for quotes sent to janitors
3. **Assigned**: Quote accepted, job assigned to janitor
4. **In Progress**: Job execution started
5. **Completed**: Job finished
6. **Canceled**: Job canceled at any stage

### Quote Management

- Companies can request quotes from specific janitors or broadcast to all
- Janitors submit quotes with amount and message
- Companies can accept one quote (automatically rejects others)
- Accepted quotes create job assignments

### Real-time Updates

- Socket.io integration for live updates
- Organization-scoped channels (`company:{orgId}:jobs`)
- Automatic UI refresh on events
- Graceful fallback to manual refresh

## Testing

The application includes comprehensive error handling and validation:

- Form validation with Zod schemas
- Database transaction safety
- Authorization checks for all operations
- Real-time connection error handling

## Deployment

The application is designed for deployment on Vercel with:

- Server Actions for API endpoints
- PostgreSQL database (Supabase recommended)
- Socket.io server for real-time features
- Clerk.dev for authentication

## Contributing

1. Follow the existing code structure and patterns
2. Add proper TypeScript types
3. Include error handling and validation
4. Test real-time features thoroughly
5. Update documentation for new features

## License

This project is proprietary software for The Link Pro platform.
