import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, DollarSign, Star } from 'lucide-react';
import Link from 'next/link';

export default function JanitorDashboard() {
  // Mock assignments data
  const assignments: any[] = [];

  // Calculate stats from assignments
  const stats = {
    pendingAssignments: assignments.filter(a => a.status === 'pending').length,
    activeJobs: assignments.filter(a => a.status === 'started').length,
    completedThisWeek: assignments.filter(a => 
      a.status === 'completed' && 
      a.completedAt && 
      new Date(a.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    totalEarnings: assignments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.assignedAmount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your cleaning assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Link href="/janitor/profile">
              Profile Settings
            </Link>
          </Button>
          <Button variant="outline">
            <Link href="/janitor/availability">
              Update Availability
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Jobs finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalEarnings / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From completed jobs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assignments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Assignments</h2>
          <Button variant="outline">
            <Link href="/janitor/assignments">
              View All
            </Link>
          </Button>
        </div>

        <div className="text-center py-8">
          <p className="text-muted-foreground">Your assignments will be displayed here</p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start" variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Update Job Status
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Report Completion
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Star className="mr-2 h-4 w-4" />
            View Performance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
