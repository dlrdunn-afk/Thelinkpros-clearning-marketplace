'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';

interface Bid {
  id: string;
  jobTitle: string;
  bidAmount: number;
  status: string;
  submittedDate: string;
  estimatedHours: number;
}

interface MyBidsTableProps {
  bids: Bid[];
}

export function MyBidsTable({ bids }: MyBidsTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <Card key={bid.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{bid.jobTitle}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {bid.estimatedHours}h estimated
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Submitted {formatDateTime(bid.submittedDate)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(bid.bidAmount)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusIcon(bid.status)}
                  {getStatusBadge(bid.status)}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
