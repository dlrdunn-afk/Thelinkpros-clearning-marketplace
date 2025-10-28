import { Button } from '@/components/ui/button';
import { Plus, Bell, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface AdminDashboardProps {
  searchParams: {
    status?: string;
    urgency?: string;
    page?: string;
  };
}

export default function AdminDashboard({ searchParams }: AdminDashboardProps) {
  // Mock stats - in real app, calculate from database
  const stats = {
    pendingRequests: 12,
    activeJobs: 8,
    completedToday: 5,
    totalRevenue: 2450,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">The Link Pro Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your cleaning company operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button>
            <Link href="/admin/janitors">
              <Users className="mr-2 h-4 w-4" />
              Manage Janitors
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
              <p className="text-2xl font-bold">{stats.pendingRequests}</p>
            </div>
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
              <p className="text-2xl font-bold">{stats.activeJobs}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
              <p className="text-2xl font-bold">{stats.completedToday}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue}</p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Service Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Service Requests</h2>
          <Button>
            <Link href="/admin/service-requests/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        <div className="text-center py-8">
          <p className="text-muted-foreground">Service requests will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
