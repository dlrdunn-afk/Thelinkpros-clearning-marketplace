'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  X, 
  Building2, 
  TrendingUp,
  Crown,
  Shield,
  Zap,
  Target,
  BarChart3,
  Settings,
  Eye,
  Star,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface PostedJob {
  id: string;
  title: string;
  description: string;
  fullAddress: string;
  jobType: string;
  jobTypeName: string;
  budget: number;
  cleaningFrequency: string;
  squareFootage: string;
  specialRequirements: string;
  status: string;
  bids: number;
  postedDate: string;
  biddingEnds: string;
  companyName: string;
  platformMargin: number;
  cleanerAmount: number;
  approvedDate?: string;
  acceptedDate?: string;
  acceptedBy?: string;
}

export default function PlatformDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pendingJobs, setPendingJobs] = useState<PostedJob[]>([]);
  const [approvedJobs, setApprovedJobs] = useState<PostedJob[]>([]);
  const [acceptedJobs, setAcceptedJobs] = useState<PostedJob[]>([]);
  const [completedJobs, setCompletedJobs] = useState<PostedJob[]>([]);
  const [platformStats, setPlatformStats] = useState({
    totalRevenue: 0,
    totalJobs: 0,
    activeCleaners: 0,
    activeCompanies: 0,
    avgJobValue: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem('platformAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Strong password for platform access
    if (password === 'TheLinkPro2024!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('platformAuthenticated', 'true');
      setError('');
    } else {
      setError('Invalid password. Access denied.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('platformAuthenticated');
    setPassword('');
    setError('');
  };

  useEffect(() => {
    const loadJobs = () => {
      try {
        const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
        const pending = allJobs.filter((job: PostedJob) => job.status === 'pending_approval');
        const approved = allJobs.filter((job: PostedJob) => job.status === 'approved');
        const accepted = allJobs.filter((job: PostedJob) => job.status === 'accepted');
        const completed = allJobs.filter((job: PostedJob) => job.status === 'completed');
        
        setPendingJobs(pending);
        setApprovedJobs(approved);
        setAcceptedJobs(accepted);
        setCompletedJobs(completed);

        // Calculate platform stats
        const totalRevenue = allJobs.reduce((sum: number, job: PostedJob) => 
          sum + (job.budget * job.platformMargin), 0);
        const avgJobValue = allJobs.length > 0 ? 
          allJobs.reduce((sum: number, job: PostedJob) => sum + job.budget, 0) / allJobs.length : 0;
        const completionRate = allJobs.length > 0 ? 
          (completed.length / allJobs.length) * 100 : 0;

        setPlatformStats({
          totalRevenue,
          totalJobs: allJobs.length,
          activeCleaners: 15, // Mock data
          activeCompanies: 8, // Mock data
          avgJobValue,
          completionRate
        });
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    };
    
    loadJobs();
    setTimeout(loadJobs, 100);
  }, []);

  const handleApproveJob = (jobId: string) => {
    const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    const updatedJobs = allJobs.map((job: PostedJob) => 
      job.id === jobId 
        ? { ...job, status: 'approved', approvedDate: new Date().toISOString() }
        : job
    );
    
    localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    
    const jobToApprove = pendingJobs.find(job => job.id === jobId);
    if (jobToApprove) {
      const approvedJob = { ...jobToApprove, status: 'approved', approvedDate: new Date().toISOString() };
      setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
      setApprovedJobs([...approvedJobs, approvedJob]);
    }
    
    alert('✅ Job approved! Sent to cleaners for acceptance.');
  };

  const handleRejectJob = (jobId: string) => {
    const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    const updatedJobs = allJobs.map((job: PostedJob) => 
      job.id === jobId 
        ? { ...job, status: 'rejected', rejectedDate: new Date().toISOString() }
        : job
    );
    
    localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
    
    alert('❌ Job rejected.');
  };

  const createTestJob = () => {
    const testJob = {
      id: Date.now().toString(),
      title: 'Premium Office Deep Clean',
      description: 'Complete office cleaning including carpets, windows, and sanitization',
      fullAddress: '456 Business Plaza, Suite 200, Downtown',
      jobType: 'office-cleaning',
      jobTypeName: 'Office Cleaning',
      budget: 750,
      cleaningFrequency: 'weekly',
      squareFootage: '3500',
      specialRequirements: 'Eco-friendly products only',
      status: 'pending_approval',
      bids: 0,
      postedDate: new Date().toISOString(),
      biddingEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      companyName: 'TechCorp Solutions',
      platformMargin: 0.40,
      cleanerAmount: 450,
    };
    
    const existingJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    const updatedJobs = [...existingJobs, testJob];
    localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    
    const pending = updatedJobs.filter((job: PostedJob) => job.status === 'pending_approval');
    setPendingJobs(pending);
    
    alert('🎯 Premium test job created! Ready for your approval.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⏳ Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">✅ Approved</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">🎯 Accepted</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">🏆 Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">❌ Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Platform Access</CardTitle>
            <p className="text-gray-600">Enter password to access the platform dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter platform password"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              
              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                Access Platform
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
                <p className="text-gray-600">Manage your cleaning marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={createTestJob} className="bg-gray-900 hover:bg-gray-800 text-white">
                <Zap className="mr-2 h-4 w-4" />
                Create Test Job
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Platform Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(platformStats.totalRevenue)}</div>
                <p className="text-xs text-gray-500">40% margin on all jobs</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
                <Target className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{platformStats.totalJobs}</div>
                <p className="text-xs text-gray-500">All time processed</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Cleaners</CardTitle>
                <Users className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{platformStats.activeCleaners}</div>
                <p className="text-xs text-gray-500">Ready to work</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{platformStats.completionRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-500">Job success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                Platform Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-16 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300">
                  <div className="text-center">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">Monitor Jobs</div>
                    <div className="text-xs text-gray-500">Track all activity</div>
                  </div>
                </Button>
                <Button className="h-16 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">Analytics</div>
                    <div className="text-xs text-gray-500">Revenue insights</div>
                  </div>
                </Button>
                <Button className="h-16 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">User Management</div>
                    <div className="text-xs text-gray-500">Cleaners & Companies</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Jobs */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Jobs Awaiting Your Approval
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">{pendingJobs.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingJobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600">No jobs pending approval</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingJobs.map((job) => (
                    <Card key={job.id} className="bg-gray-50 border-gray-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-gray-900 text-lg mb-2">{job.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.fullAddress}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(job.postedDate)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p><strong>Type:</strong> {job.jobTypeName}</p>
                              <p><strong>Company:</strong> {job.companyName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                              {formatCurrency(job.budget)}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(job.status)}
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="text-green-600">Platform: {formatCurrency(job.budget * job.platformMargin)}</p>
                              <p className="text-blue-600">Cleaner: {formatCurrency(job.cleanerAmount)}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {job.description && (
                          <p className="text-gray-600 mb-4">{job.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Job ID: {job.id}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleApproveJob(job.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve Job
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleRejectJob(job.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject Job
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Recently Approved Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {approvedJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <div>
                      <p className="text-gray-900 font-medium">{job.title}</p>
                      <p className="text-gray-600 text-sm">{formatCurrency(job.budget)}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>
                  </div>
                ))}
                {approvedJobs.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No approved jobs yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Completed Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <div>
                      <p className="text-gray-900 font-medium">{job.title}</p>
                      <p className="text-gray-600 text-sm">{formatCurrency(job.budget)}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">Completed</Badge>
                  </div>
                ))}
                {completedJobs.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No completed jobs yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
