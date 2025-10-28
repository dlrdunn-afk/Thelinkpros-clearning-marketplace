import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Users, Settings } from 'lucide-react';

export default async function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { orgId } = auth();
  
  if (!orgId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold">Company Dashboard</h2>
        </div>
        <nav className="px-4 space-y-2">
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link href="/dashboard/company/jobs">
              <Home className="mr-2 h-4 w-4" />
              Jobs
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link href="/dashboard/company/janitors">
              <Users className="mr-2 h-4 w-4" />
              Janitors
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link href="/dashboard/company/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
