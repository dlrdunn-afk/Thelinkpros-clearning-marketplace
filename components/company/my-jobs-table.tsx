'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Clock, CheckCircle, Star, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  status: string;
  bids: number;
  finalAmount?: number;
  budgetMin?: number;
  budgetMax?: number;
  assignedJanitor?: string;
  postedDate: string;
  completedDate?: string;
  scheduledDate?: string;
  biddingEnds?: string;
}

interface MyJobsTableProps {
  jobs: Job[];
}

export function MyJobsTable({ jobs }: MyJobsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'bidding':
        return <Badge variant="outline">Bidding Open</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Posted {formatDateTime(job.postedDate)}
                  </span>
                  {job.bids > 0 && (
                    <span>{job.bids} bids received</span>
                  )}
                  {job.assignedJanitor && (
                    <span>Assigned to {job.assignedJanitor}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {job.finalAmount 
                    ? formatCurrency(job.finalAmount)
                    : `${formatCurrency(job.budgetMin || 0)} - ${formatCurrency(job.budgetMax || 0)}`
                  }
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(job.status)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {job.status === 'completed' && job.completedDate && (
                  <span>Completed {formatDateTime(job.completedDate)}</span>
                )}
                {job.status === 'in_progress' && job.scheduledDate && (
                  <span>Scheduled for {formatDateTime(job.scheduledDate)}</span>
                )}
                {job.status === 'bidding' && job.biddingEnds && (
                  <span>Bidding ends {formatDateTime(job.biddingEnds)}</span>
                )}
              </div>
              <Link 
                href={`/company/jobs/${job.id}`}
                className="text-primary hover:underline text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
