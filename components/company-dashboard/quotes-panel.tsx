'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { acceptQuote, rejectQuote } from '@/actions/quotes';
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

interface Quote {
  id: string;
  janitorId: string;
  amountCents: number;
  message: string | null;
  status: string;
  validUntil: Date | null;
  createdAt: Date;
}

interface QuotesPanelProps {
  jobId: string;
  quotes: Quote[];
  jobStatus: string;
}

export function QuotesPanel({ jobId, quotes, jobStatus }: QuotesPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [actionState, setActionState] = useState<{
    message: string;
    isError: boolean;
  }>({ message: '', isError: false });

  const pendingQuotes = quotes.filter(q => q.status === 'pending');
  const acceptedQuote = quotes.find(q => q.status === 'accepted');
  const rejectedQuotes = quotes.filter(q => q.status === 'rejected');

  const handleAcceptQuote = async (quoteId: string) => {
    startTransition(async () => {
      try {
        await acceptQuote({ quoteId });
        setActionState({ message: 'Quote accepted successfully', isError: false });
      } catch (error) {
        setActionState({ 
          message: error instanceof Error ? error.message : 'Failed to accept quote', 
          isError: true 
        });
      }
    });
  };

  const handleRejectQuote = async (quoteId: string) => {
    startTransition(async () => {
      try {
        await rejectQuote({ quoteId });
        setActionState({ message: 'Quote rejected', isError: false });
      } catch (error) {
        setActionState({ 
          message: error instanceof Error ? error.message : 'Failed to reject quote', 
          isError: true 
        });
      }
    });
  };

  const canAcceptQuotes = jobStatus === 'rfq' || jobStatus === 'open';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quotes ({quotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionState.message && (
            <Alert variant={actionState.isError ? "destructive" : "default"}>
              <AlertDescription>{actionState.message}</AlertDescription>
            </Alert>
          )}

          {quotes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No quotes received yet</p>
              <p className="text-sm">Request quotes to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {acceptedQuote && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Accepted Quote</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Accepted
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Janitor:</span>
                      <span className="font-medium">{acceptedQuote.janitorId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-bold text-green-700">
                        {formatCurrency(acceptedQuote.amountCents, 'USD')}
                      </span>
                    </div>
                    {acceptedQuote.message && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <p className="text-sm">{acceptedQuote.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {pendingQuotes.map((quote) => (
                <div key={quote.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Pending Quote</span>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Janitor:</span>
                      <span className="font-medium">{quote.janitorId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(quote.amountCents, 'USD')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span>{formatDateTime(quote.createdAt)}</span>
                    </div>
                    {quote.validUntil && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valid until:</span>
                        <span>{formatDateTime(quote.validUntil)}</span>
                      </div>
                    )}
                  </div>

                  {quote.message && (
                    <div className="mb-4 p-3 bg-muted rounded">
                      <p className="text-sm">{quote.message}</p>
                    </div>
                  )}

                  {canAcceptQuotes && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptQuote(quote.id)}
                        disabled={isPending}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectQuote(quote.id)}
                        disabled={isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {rejectedQuotes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Rejected Quotes</h4>
                  {rejectedQuotes.map((quote) => (
                    <div key={quote.id} className="border border-red-200 bg-red-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            {quote.janitorId}
                          </span>
                        </div>
                        <div className="text-sm text-red-700">
                          {formatCurrency(quote.amountCents, 'USD')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
