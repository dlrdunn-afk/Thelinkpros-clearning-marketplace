'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle, Clock, DollarSign, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

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
}

export default function CompanyMarketplace() {
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load posted jobs from localStorage
    if (typeof window !== 'undefined') {
      const jobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
      setPostedJobs(jobs);
    }
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-100 text-blue-800">Accepted by Cleaner</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved - Sent to Cleaners</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Platform Approval</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected by Platform</Badge>;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Need Cleaning?</h1>
              <p className="text-muted-foreground">
                Manage your cleaning jobs and connect with professional cleaners
              </p>
            </div>
            <Button >
              <Link href="/company/post-job">
                <Plus className="mr-2 h-4 w-4" />
                Post New Job
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jobs Posted</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{postedJobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total jobs posted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {postedJobs.filter(job => job.status === 'pending_approval').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting platform review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${postedJobs.reduce((sum, job) => sum + job.budget, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all jobs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {postedJobs.reduce((sum, job) => sum + job.bids, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From cleaners
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Posted Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
              <Button variant="outline" >
                <Link href="/company/post-job">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Another Job
                </Link>
              </Button>
            </div>

            {postedJobs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Post your first cleaning job to start receiving bids from professional cleaners.
                  </p>
                  <Button >
                    <Link href="/company/post-job">
                      Post Your First Job
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {postedJobs.map((job) => (
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
                            {job.bids > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {job.bids} bids received
                              </span>
                            )}
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
                            Bidding ends {formatDate(job.biddingEnds)}
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
                          <Button variant="outline" size="sm">
                            View Bids
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Success Message */}
          {postedJobs.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">✅ Jobs Successfully Posted!</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Your jobs are now visible to professional cleaners who can submit bids. 
                  You'll receive notifications when new bids come in.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}