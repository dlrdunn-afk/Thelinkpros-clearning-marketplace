'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Clock, MapPin, DollarSign, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  serviceType: string;
  budgetMin: number;
  budgetMax: number;
  estimatedHours: number;
  postedDate: string;
  biddingEnds: string;
  urgency: string;
  description: string;
}

interface AvailableJobsTableProps {
  jobs: Job[];
}

export function AvailableJobsTable({ jobs }: AvailableJobsTableProps) {
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
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.estimatedHours}h estimated
                  </span>
                  <Badge variant={job.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                    {job.urgency}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Bidding ends {formatDateTime(job.biddingEnds)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{job.serviceType}</Badge>
                <span className="text-sm text-muted-foreground">
                  Posted by {job.company}
                </span>
              </div>
              <Button asChild>
                <Link href={`/janitor/jobs/${job.id}`}>
                  Submit Bid
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
