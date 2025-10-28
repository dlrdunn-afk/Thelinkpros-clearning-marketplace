'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText } from 'lucide-react';
import Link from 'next/link';

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-6 mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          Get started by creating your first cleaning job. You can then request quotes from janitors and manage assignments.
        </p>
        <Button asChild>
          <Link href="/dashboard/company/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Job
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
