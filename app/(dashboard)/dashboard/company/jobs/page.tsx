import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { listJobs } from '@/actions/jobs';
import { JobTable } from '@/components/company-dashboard/job-table';
import { JobFilters } from '@/components/company-dashboard/job-filters';
import { EmptyState } from '@/components/company-dashboard/empty-state';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface JobsPageProps {
  searchParams: {
    status?: string;
    q?: string;
    page?: string;
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { orgId } = auth();
  
  if (!orgId) {
    redirect('/dashboard');
  }

  const status = searchParams.status ? searchParams.status.split(',') : undefined;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  const { data: jobs, total, page: currentPage, pageSize } = await listJobs({
    status,
    q: searchParams.q,
    page,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Manage your cleaning jobs and track assignments
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/company/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Link>
        </Button>
      </div>

      <JobFilters />

      {jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <Suspense fallback={<div>Loading jobs...</div>}>
          <JobTable 
            jobs={jobs} 
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </Suspense>
      )}
    </div>
  );
}
