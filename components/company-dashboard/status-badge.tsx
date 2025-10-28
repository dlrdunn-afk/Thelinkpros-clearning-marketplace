'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type JobStatus = 'draft' | 'open' | 'rfq' | 'assigned' | 'in_progress' | 'completed' | 'canceled';
type AssignmentStatus = 'pending_acceptance' | 'accepted' | 'started' | 'paused' | 'completed' | 'canceled';

interface StatusBadgeProps {
  status: JobStatus | AssignmentStatus;
  className?: string;
}

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' as const },
  open: { label: 'Open', variant: 'default' as const },
  rfq: { label: 'RFQ', variant: 'outline' as const },
  assigned: { label: 'Assigned', variant: 'default' as const },
  in_progress: { label: 'In Progress', variant: 'default' as const },
  completed: { label: 'Completed', variant: 'secondary' as const },
  canceled: { label: 'Canceled', variant: 'destructive' as const },
  pending_acceptance: { label: 'Pending', variant: 'outline' as const },
  accepted: { label: 'Accepted', variant: 'default' as const },
  started: { label: 'Started', variant: 'default' as const },
  paused: { label: 'Paused', variant: 'secondary' as const },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  if (!config) {
    return <Badge variant="secondary">{status}</Badge>;
  }

  return (
    <Badge 
      variant={config.variant} 
      className={cn(className)}
    >
      {config.label}
    </Badge>
  );
}
