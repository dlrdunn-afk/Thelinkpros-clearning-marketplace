'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Building2, Users, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'company',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store user session (simulate successful signup)
    sessionStorage.setItem('userAuthenticated', 'true');
    sessionStorage.setItem('userEmail', formData.email);
    sessionStorage.setItem('userName', formData.name);
    sessionStorage.setItem('userType', formData.accountType);

    // Redirect based on account type
    if (formData.accountType === 'company') {
      router.push('/company/marketplace');
    } else {
      router.push('/janitor/marketplace');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" >
            <Link href="/sign-in">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">The Link Pro</span>
            </div>
            <CardTitle>Create Your Account</CardTitle>
            <p className="text-muted-foreground">
              Join The Link Pro marketplace today
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name / Business Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Enter your name or business name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.accountType === 'company' ? 'default' : 'outline'}
                    className="h-12 flex flex-col gap-1"
                    onClick={() => setFormData({ ...formData, accountType: 'company' })}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">Company</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.accountType === 'cleaner' ? 'default' : 'outline'}
                    className="h-12 flex flex-col gap-1"
                    onClick={() => setFormData({ ...formData, accountType: 'cleaner' })}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Cleaner</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Create a password" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Account Type Benefits */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">What you get:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-medium">As a Company:</span>
                  </div>
                  <ul className="text-muted-foreground space-y-1 ml-6">
                    <li>• Post cleaning jobs</li>
                    <li>• Receive competitive bids</li>
                    <li>• Track job progress</li>
                    <li>• Secure payments</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">As a Cleaner:</span>
                  </div>
                  <ul className="text-muted-foreground space-y-1 ml-6">
                    <li>• Browse available jobs</li>
                    <li>• Submit competitive bids</li>
                    <li>• Build your reputation</li>
                    <li>• Get paid securely</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
