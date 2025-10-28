'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, DollarSign, CheckCircle } from 'lucide-react';

export function TopJanitors() {
  // Mock data - in real app, fetch from database
  const topJanitors = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 4.9,
      completedJobs: 45,
      totalEarnings: 8500,
      specialties: ['Office Cleaning', 'Deep Clean'],
    },
    {
      id: '2',
      name: 'Mike Wilson',
      rating: 4.8,
      completedJobs: 38,
      totalEarnings: 7200,
      specialties: ['Regular Maintenance', 'Post-Construction'],
    },
    {
      id: '3',
      name: 'Lisa Brown',
      rating: 4.7,
      completedJobs: 32,
      totalEarnings: 6100,
      specialties: ['Office Cleaning', 'Event Cleanup'],
    },
  ];

  return (
    <div className="space-y-4">
      {topJanitors.map((janitor, index) => (
        <div key={janitor.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{janitor.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{janitor.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{janitor.completedJobs} jobs completed</span>
                <div className="flex gap-1">
                  {janitor.specialties.slice(0, 2).map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-green-600">
              ${janitor.totalEarnings.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Total earnings
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
