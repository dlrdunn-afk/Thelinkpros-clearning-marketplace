'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Clock, MapPin, User } from 'lucide-react';

export function RecentJobs() {
  // Mock data - in real app, fetch from database
  const recentJobs = [
    {
      id: '1',
      title: 'Office Deep Clean',
      company: 'TechCorp Inc.',
      location: 'Downtown',
      status: 'completed',
      amount: 450,
      janitor: 'Sarah Johnson',
      completedAt: '2024-01-25T14:30:00Z',
    },
    {
      id: '2',
      title: 'Regular Maintenance',
      company: 'Small Business LLC',
      location: 'Midtown',
      status: 'in_progress',
      amount: 200,
      janitor: 'Mike Wilson',
      startedAt: '2024-01-25T09:00:00Z',
    },
    {
      id: '3',
      title: 'Post-Construction Cleanup',
      company: 'Construction Co.',
      location: 'Industrial District',
      status: 'bidding',
      budgetMin: 800,
      budgetMax: 1200,
      bids: 5,
      postedAt: '2024-01-24T16:00:00Z',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'bidding':
        return <Badge variant="outline">Bidding</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {recentJobs.map((job) => (
        <div key={job.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{job.title}</h4>
              {getStatusBadge(job.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span>{job.company}</span>
              {job.janitor && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {job.janitor}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {job.amount 
                ? formatCurrency(job.amount)
                : `${formatCurrency(job.budgetMin || 0)} - ${formatCurrency(job.budgetMax || 0)}`
              }
            </div>
            <div className="text-xs text-muted-foreground">
              {job.completedAt && `Completed ${formatDateTime(job.completedAt)}`}
              {job.startedAt && `Started ${formatDateTime(job.startedAt)}`}
              {job.postedAt && `Posted ${formatDateTime(job.postedAt)}`}
              {job.bids && ` • ${job.bids} bids`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
