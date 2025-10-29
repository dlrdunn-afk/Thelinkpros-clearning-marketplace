'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Building2, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Dummy accounts for testing
  const testAccounts = {
    companies: [
      { email: 'company@test.com', password: 'company123', name: 'TechCorp Inc.', type: 'company' },
      { email: 'office@test.com', password: 'office123', name: 'Office Solutions LLC', type: 'company' },
      { email: 'business@test.com', password: 'business123', name: 'Small Business Co.', type: 'company' },
    ],
    cleaners: [
      { email: 'cleaner@test.com', password: 'cleaner123', name: 'Sarah Johnson', type: 'cleaner' },
      { email: 'janitor@test.com', password: 'janitor123', name: 'Mike Wilson', type: 'cleaner' },
      { email: 'service@test.com', password: 'service123', name: 'Lisa Brown', type: 'cleaner' },
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if credentials match any test account
    const allAccounts = [...testAccounts.companies, ...testAccounts.cleaners];
    const account = allAccounts.find(acc => acc.email === email && acc.password === password);

    if (account) {
      // Store user session
      sessionStorage.setItem('userAuthenticated', 'true');
      sessionStorage.setItem('userEmail', account.email);
      sessionStorage.setItem('userName', account.name);
      sessionStorage.setItem('userType', account.type);
      
      // Set site access cookie for middleware
      document.cookie = 'site-access=granted; path=/; max-age=86400'; // 24 hours

      // Redirect based on user type
      if (account.type === 'company') {
        router.push('/company/marketplace');
      } else {
        router.push('/janitor/marketplace');
      }
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }

    setLoading(false);
  };

  const handleTestLogin = (account: any) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">The Link Pro</span>
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Accounts */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Test Accounts</CardTitle>
            <p className="text-muted-foreground">
              Use these accounts for testing the platform
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Accounts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Company Accounts</h3>
              </div>
              <div className="space-y-2">
                {testAccounts.companies.map((account, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.email}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTestLogin(account)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cleaner Accounts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Cleaner Accounts</h3>
              </div>
              <div className="space-y-2">
                {testAccounts.cleaners.map((account, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.email}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTestLogin(account)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                All test accounts use simple passwords (e.g., company123, cleaner123)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}