import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getJobDetails } from '@/actions/quotes';
import { QuotesPanel } from '@/components/company-dashboard/quotes-panel';
import { StatusBadge } from '@/components/company-dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface JobDetailPageProps {
  params: {
    jobId: string;
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { orgId } = auth();
  
  if (!orgId) {
    redirect('/dashboard');
  }

  let job;
  try {
    job = await getJobDetails(params.jobId);
  } catch (error) {
    notFound();
  }

  const currentAssignment = job.assignments?.[0];
  const pendingQuotes = job.quotes?.filter(q => q.status === 'pending') || [];
  const acceptedQuote = job.quotes?.find(q => q.status === 'accepted');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/company/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={job.status} />
            {job.isBroadcast && (
              <Badge variant="secondary">Broadcast</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/company/jobs/${job.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{job.description}</p>
                </div>
              )}
              
              {job.location && (
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-muted-foreground">{job.location}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {job.startTime && (
                  <div>
                    <h4 className="font-medium mb-2">Start Time</h4>
                    <p className="text-muted-foreground">
                      {new Date(job.startTime).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {job.endTime && (
                  <div>
                    <h4 className="font-medium mb-2">End Time</h4>
                    <p className="text-muted-foreground">
                      {new Date(job.endTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Budget</h4>
                <p className="text-2xl font-bold">
                  {formatCurrency(job.budgetCents, job.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          {currentAssignment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <StatusBadge status={currentAssignment.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Janitor</span>
                    <span className="text-sm text-muted-foreground">
                      {currentAssignment.janitorId}
                    </span>
                  </div>
                  {acceptedQuote && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quote Amount</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(acceptedQuote.amountCents, job.currency)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Suspense fallback={<div>Loading quotes...</div>}>
            <QuotesPanel 
              jobId={job.id}
              quotes={job.quotes || []}
              jobStatus={job.status}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
