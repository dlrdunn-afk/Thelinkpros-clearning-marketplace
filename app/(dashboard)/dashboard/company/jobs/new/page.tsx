import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { JobForm } from '@/components/company-dashboard/job-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewJobPage() {
  const { orgId } = auth();
  
  if (!orgId) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/company/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Job</h1>
          <p className="text-muted-foreground">
            Create a new cleaning job and start requesting quotes
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <JobForm />
      </div>
    </div>
  );
}
