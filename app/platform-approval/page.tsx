'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Users, CheckCircle, X, Building2 } from 'lucide-react';

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
}

export default function PlatformApproval() {
  const [pendingJobs, setPendingJobs] = useState<PostedJob[]>([]);
  const [approvedJobs, setApprovedJobs] = useState<PostedJob[]>([]);

  useEffect(() => {
    // Load jobs from localStorage
    const loadJobs = () => {
      try {
        const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
        console.log('All jobs loaded:', allJobs); // Debug log
        const pending = allJobs.filter((job: PostedJob) => job.status === 'pending_approval');
        const approved = allJobs.filter((job: PostedJob) => job.status === 'approved');
        console.log('Pending jobs:', pending); // Debug log
        console.log('Approved jobs:', approved); // Debug log
        setPendingJobs(pending);
        setApprovedJobs(approved);
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    };
    
    // Load immediately and also after a short delay to ensure localStorage is available
    loadJobs();
    setTimeout(loadJobs, 100);
  }, []);

  const handleApproveJob = (jobId: string) => {
    // Update job status to approved
    const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    const updatedJobs = allJobs.map((job: PostedJob) => 
      job.id === jobId 
        ? { ...job, status: 'approved', approvedDate: new Date().toISOString() }
        : job
    );
    
    localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    
    // Move job from pending to approved
    const jobToApprove = pendingJobs.find(job => job.id === jobId);
    if (jobToApprove) {
      const approvedJob = { ...jobToApprove, status: 'approved', approvedDate: new Date().toISOString() };
      setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
      setApprovedJobs([...approvedJobs, approvedJob]);
    }
    
    alert('Job approved! Sent to cleaners for acceptance.');
  };

  const handleRejectJob = (jobId: string) => {
    // Update job status to rejected
    const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    const updatedJobs = allJobs.map((job: PostedJob) => 
      job.id === jobId 
        ? { ...job, status: 'rejected', rejectedDate: new Date().toISOString() }
        : job
    );
    
    localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
    
    alert('Job rejected.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-100 text-blue-800">Accepted by Cleaner</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Platform Job Approval</h1>
              <p className="text-muted-foreground">
                Review and approve jobs before sending to cleaners
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Platform Margin: 40%</div>
              <div className="text-sm text-muted-foreground">Cleaner Gets: 60%</div>
              <Button 
                onClick={() => {
                  const testJob = {
                    id: Date.now().toString(),
                    title: 'Test Office Cleaning Job',
                    description: 'This is a test job to verify the approval system works',
                    fullAddress: '123 Test St, Test City, TC 12345',
                    jobType: 'office-cleaning',
                    jobTypeName: 'Office Cleaning',
                    budget: 500,
                    cleaningFrequency: 'weekly',
                    squareFootage: '2000',
                    specialRequirements: 'None',
                    status: 'pending_approval',
                    bids: 0,
                    postedDate: new Date().toISOString(),
                    biddingEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    companyName: 'Test Company',
                    platformMargin: 0.40,
                    cleanerAmount: 300,
                  };
                  
                  const existingJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
                  const updatedJobs = [...existingJobs, testJob];
                  localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
                  
                  // Reload the page data
                  const pending = updatedJobs.filter((job: PostedJob) => job.status === 'pending_approval');
                  const approved = updatedJobs.filter((job: PostedJob) => job.status === 'approved');
                  setPendingJobs(pending);
                  setApprovedJobs(approved);
                  
                  alert('Test job created! Check the pending approval section.');
                }}
                variant="outline"
                className="mt-2"
              >
                Create Test Job
              </Button>
            </div>
          </div>

          {/* Debug Info */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="text-sm">
                <p className="font-medium text-orange-800 mb-2">Debug Info:</p>
                <p className="text-orange-700">Total jobs in localStorage: {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('postedJobs') || '[]').length : 0}</p>
                <p className="text-orange-700">Pending jobs: {pendingJobs.length}</p>
                <p className="text-orange-700">Approved jobs: {approvedJobs.length}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-orange-800 font-medium">View Raw Data</summary>
                  <pre className="text-xs mt-2 p-2 bg-white rounded border overflow-auto max-h-32">
                    {typeof window !== 'undefined' ? JSON.stringify(JSON.parse(localStorage.getItem('postedJobs') || '[]'), null, 2) : '[]'}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingJobs.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Jobs</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedJobs.length}</div>
                <p className="text-xs text-muted-foreground">Sent to cleaners</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${approvedJobs.reduce((sum, job) => sum + (job.budget * job.platformMargin), 0)}
                </div>
                <p className="text-xs text-muted-foreground">From approved jobs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cleaner Earnings</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${approvedJobs.reduce((sum, job) => sum + job.cleanerAmount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Available to cleaners</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Jobs */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Jobs Pending Approval</h2>
            
            {pendingJobs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No jobs pending approval</h3>
                  <p className="text-muted-foreground">
                    All submitted jobs have been reviewed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.fullAddress}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Posted {formatDateTime(job.postedDate)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Type:</strong> {job.jobTypeName}</p>
                            {job.cleaningFrequency && (
                              <p><strong>Frequency:</strong> {job.cleaningFrequency}</p>
                            )}
                            {job.squareFootage && (
                              <p><strong>Size:</strong> {job.squareFootage} sq ft</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary mb-2">
                            ${job.budget}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(job.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Platform: ${Math.round(job.budget * job.platformMargin)}</p>
                            <p>Cleaner: ${job.cleanerAmount}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {job.description && (
                        <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                      )}
                      {job.specialRequirements && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">Special Requirements:</p>
                          <p className="text-sm text-muted-foreground">{job.specialRequirements}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Job ID: {job.id}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleApproveJob(job.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve Job
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleRejectJob(job.id)}
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
          </div>

          {/* Approved Jobs */}
          {approvedJobs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recently Approved Jobs</h2>
              <div className="space-y-4">
                {approvedJobs.slice(0, 3).map((job) => (
                  <Card key={job.id} className="border-green-200 bg-green-50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.fullAddress}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Approved {formatDateTime(job.postedDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary mb-2">
                            ${job.budget}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(job.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Cleaner gets: ${job.cleanerAmount}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
