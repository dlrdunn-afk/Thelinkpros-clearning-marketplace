import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

export default function CompanyDashboard() {

  // Mock data - in real app, fetch from database
  const recentRequests = [
    {
      id: '1',
      title: 'Office Deep Clean',
      status: 'completed',
      requestedDate: '2024-01-15',
      completedDate: '2024-01-16',
      amount: 450,
    },
    {
      id: '2',
      title: 'Regular Maintenance',
      status: 'in_progress',
      requestedDate: '2024-01-20',
      scheduledDate: '2024-01-22',
      amount: 200,
    },
  ];

  const stats = {
    totalRequests: 12,
    completedJobs: 10,
    pendingJobs: 2,
    totalSpent: 3200,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cleaning Services</h1>
          <p className="text-muted-foreground">
            Professional cleaning services for your business
          </p>
        </div>
        <Button>
          <Link href="/company/request-service">
            <Plus className="mr-2 h-4 w-4" />
            Request Service
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              All time requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingJobs}</div>
            <p className="text-xs text-muted-foreground">
              In progress or scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent}</div>
            <p className="text-xs text-muted-foreground">
              On cleaning services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Types */}
      <Card>
        <CardHeader>
          <CardTitle>Our Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Office Cleaning</h3>
              <p className="text-sm text-muted-foreground">
                Regular maintenance cleaning for offices and workspaces
              </p>
              <p className="text-sm font-medium">Starting at $150</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Deep Cleaning</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive cleaning for move-ins, move-outs, or special events
              </p>
              <p className="text-sm font-medium">Starting at $300</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Post-Construction</h3>
              <p className="text-sm text-muted-foreground">
                Specialized cleaning after construction or renovation work
              </p>
              <p className="text-sm font-medium">Starting at $500</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Requests</h2>
          <Button variant="outline">
            <Link href="/company/request-history">
              View All
            </Link>
          </Button>
        </div>

        <div className="text-center py-8">
          <p className="text-muted-foreground">Recent requests will be displayed here</p>
        </div>
      </div>

      {/* Why Choose Us */}
      <Card>
        <CardHeader>
          <CardTitle>Why Choose The Link Pro?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Professional Team</h3>
              <p className="text-sm text-muted-foreground">
                Our experienced cleaners are background-checked and trained to the highest standards.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Flexible Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                We work around your schedule, including evenings and weekends.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                100% satisfaction guarantee. If you're not happy, we'll make it right.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Insured & Bonded</h3>
              <p className="text-sm text-muted-foreground">
                Fully insured and bonded for your peace of mind.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
