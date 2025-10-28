'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { createJob } from '@/actions/jobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const initialState = {
  message: '',
  isError: false,
};

export function JobForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useFormState(createJob, initialState);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    startTime: '',
    endTime: '',
    budgetCents: 0,
    currency: 'USD',
    status: 'draft',
  });

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await createJob({
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          location: formData.get('location') as string,
          latitude: formData.get('latitude') as string,
          longitude: formData.get('longitude') as string,
          startTime: formData.get('startTime') ? new Date(formData.get('startTime') as string) : undefined,
          endTime: formData.get('endTime') ? new Date(formData.get('endTime') as string) : undefined,
          budgetCents: parseInt(formData.get('budgetCents') as string) || 0,
          currency: formData.get('currency') as string,
          status: formData.get('status') as 'draft' | 'open',
        });
        
        router.push(`/dashboard/company/jobs/${result.id}`);
      } catch (error) {
        console.error('Error creating job:', error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {state.isError && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Office Cleaning - Downtown Location"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the cleaning requirements, special instructions, etc."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                placeholder="e.g., 123 Main St, City, State"
                className="pl-10"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  className="pl-10"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  className="pl-10"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetCents">Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budgetCents"
                  name="budgetCents"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-10"
                  value={formData.budgetCents}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetCents: parseFloat(e.target.value) * 100 || 0 }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                name="currency" 
                value={formData.currency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select 
              name="status" 
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'draft' | 'open' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (Save for later)</SelectItem>
                <SelectItem value="open">Open (Ready for quotes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Job'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
