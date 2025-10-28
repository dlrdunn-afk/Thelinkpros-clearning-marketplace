'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';

export function RevenueChart() {
  // Mock chart data - in real app, use a charting library
  const chartData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 19000 },
    { month: 'Jun', revenue: 25000 },
  ];

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Monthly Revenue</h3>
          <p className="text-sm text-muted-foreground">Platform fees collected</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+12% from last month</span>
        </div>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div 
              className="bg-primary rounded-t w-full transition-all duration-500 hover:bg-primary/80"
              style={{ 
                height: `${(data.revenue / maxRevenue) * 200}px`,
                minHeight: '20px'
              }}
            />
            <div className="text-xs text-muted-foreground">{data.month}</div>
            <div className="text-xs font-medium">${(data.revenue / 1000).toFixed(0)}k</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span>Total: ${chartData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</span>
        </div>
        <div className="text-muted-foreground">
          Avg: ${Math.round(chartData.reduce((sum, d) => sum + d.revenue, 0) / chartData.length).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
