'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from './status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Job {
  id: string;
  title: string;
  status: string;
  startTime: Date | null;
  endTime: Date | null;
  budgetCents: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  assignments: Array<{
    id: string;
    status: string;
    janitorId: string;
  }>;
  quotes: Array<{
    id: string;
    status: string;
    amountCents: number;
  }>;
}

interface JobTableProps {
  jobs: Job[];
  total: number;
  currentPage: number;
  pageSize: number;
}

export function JobTable({ jobs, total, currentPage, pageSize }: JobTableProps) {
  const [isPending, setIsPending] = useState(false);
  
  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePageChange = (page: number) => {
    if (isPending) return;
    setIsPending(true);
    // This would trigger a router.push in a real implementation
    setTimeout(() => setIsPending(false), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const currentAssignment = job.assignments?.[0];
              const acceptedQuote = job.quotes?.find(q => q.status === 'accepted');
              
              return (
                <TableRow key={job.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <Link 
                        href={`/dashboard/company/jobs/${job.id}`}
                        className="font-medium hover:underline"
                      >
                        {job.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {job.quotes?.length || 0} quotes
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={job.status as any} />
                  </TableCell>
                  <TableCell>
                    {job.startTime ? (
                      <div className="text-sm">
                        <div>{formatDateTime(job.startTime)}</div>
                        {job.endTime && (
                          <div className="text-muted-foreground">
                            to {formatDateTime(job.endTime)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(job.budgetCents, job.currency)}
                    </div>
                    {acceptedQuote && (
                      <div className="text-sm text-muted-foreground">
                        Quote: {formatCurrency(acceptedQuote.amountCents, job.currency)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {currentAssignment ? (
                      <div>
                        <div className="text-sm font-medium">
                          {currentAssignment.janitorId}
                        </div>
                        <StatusBadge status={currentAssignment.status as any} />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(job.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/company/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/company/jobs/${job.id}/edit`}>
                            Edit Job
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Cancel Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} jobs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevPage || isPending}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={isPending}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage || isPending}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
