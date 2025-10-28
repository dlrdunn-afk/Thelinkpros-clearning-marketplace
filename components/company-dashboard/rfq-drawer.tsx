'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { requestQuotes } from '@/actions/jobs';
import { Send, Users, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface RFQDrawerProps {
  jobId: string;
  jobTitle: string;
  children: React.ReactNode;
}

// Mock janitor data - in a real app, this would come from an API
const mockJanitors = [
  { id: 'janitor_1', name: 'John Smith', rating: 4.8, completedJobs: 45 },
  { id: 'janitor_2', name: 'Sarah Johnson', rating: 4.9, completedJobs: 67 },
  { id: 'janitor_3', name: 'Mike Wilson', rating: 4.7, completedJobs: 32 },
  { id: 'janitor_4', name: 'Lisa Brown', rating: 4.6, completedJobs: 28 },
  { id: 'janitor_5', name: 'David Lee', rating: 4.9, completedJobs: 89 },
];

export function RFQDrawer({ jobId, jobTitle, children }: RFQDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [actionState, setActionState] = useState<{
    message: string;
    isError: boolean;
  }>({ message: '', isError: false });

  const [selectedJanitors, setSelectedJanitors] = useState<string[]>([]);
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [customJanitorIds, setCustomJanitorIds] = useState('');

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        if (isBroadcast) {
          await requestQuotes({
            jobId,
            broadcast: true,
          });
        } else {
          const janitorIds = customJanitorIds 
            ? customJanitorIds.split(',').map(id => id.trim()).filter(Boolean)
            : selectedJanitors;
          
          if (janitorIds.length === 0) {
            setActionState({ 
              message: 'Please select janitors or enter janitor IDs', 
              isError: true 
            });
            return;
          }

          await requestQuotes({
            jobId,
            janitorIds,
            broadcast: false,
          });
        }
        
        setActionState({ message: 'RFQ sent successfully', isError: false });
        setIsOpen(false);
        // Reset form
        setSelectedJanitors([]);
        setIsBroadcast(false);
        setCustomJanitorIds('');
      } catch (error) {
        setActionState({ 
          message: error instanceof Error ? error.message : 'Failed to send RFQ', 
          isError: true 
        });
      }
    });
  };

  const toggleJanitor = (janitorId: string) => {
    setSelectedJanitors(prev => 
      prev.includes(janitorId) 
        ? prev.filter(id => id !== janitorId)
        : [...prev, janitorId]
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Request Quotes</SheetTitle>
          <SheetDescription>
            Send a request for quotes for "{jobTitle}"
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {actionState.message && (
            <Alert variant={actionState.isError ? "destructive" : "default"}>
              <AlertDescription>{actionState.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="broadcast" 
                checked={isBroadcast}
                onCheckedChange={(checked) => setIsBroadcast(checked as boolean)}
              />
              <Label htmlFor="broadcast" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Broadcast to all available janitors
              </Label>
            </div>

            {!isBroadcast && (
              <>
                <div className="space-y-3">
                  <Label>Select Specific Janitors</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {mockJanitors.map((janitor) => (
                      <div key={janitor.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={janitor.id}
                          checked={selectedJanitors.includes(janitor.id)}
                          onCheckedChange={() => toggleJanitor(janitor.id)}
                        />
                        <Label htmlFor={janitor.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{janitor.name}</span>
                            <div className="text-sm text-muted-foreground">
                              ⭐ {janitor.rating} • {janitor.completedJobs} jobs
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customIds">Or enter janitor IDs manually</Label>
                  <Input
                    id="customIds"
                    placeholder="janitor_1, janitor_2, janitor_3"
                    value={customJanitorIds}
                    onChange={(e) => setCustomJanitorIds(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple IDs with commas
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSubmit} 
              disabled={isPending}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              {isPending ? 'Sending...' : 'Send RFQ'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
