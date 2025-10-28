// Alternative: Environment Variable Protection
// Add this to your .env.local file:
// PLATFORM_ACCESS_CODE=your-secret-code-here
// NEXT_PUBLIC_PLATFORM_ENABLED=false

// Then you can use this in your platform page:
/*
import { headers } from 'next/headers';

export default async function PlatformDashboard() {
  // Check if platform is enabled
  if (process.env.NEXT_PUBLIC_PLATFORM_ENABLED !== 'true') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Platform Disabled</CardTitle>
            <p className="text-muted-foreground">
              Platform access is currently disabled
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Rest of your platform code...
}
*/
