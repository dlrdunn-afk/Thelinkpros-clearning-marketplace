'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Users, Star, CheckCircle, Building2, Hand } from 'lucide-react';
import Link from 'next/link';

interface ApprovedJob {
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
  approvedDate: string;
}

export default function JanitorMarketplace() {
  const [approvedJobs, setApprovedJobs] = useState<ApprovedJob[]>([]);
  const [myAcceptedJobs, setMyAcceptedJobs] = useState<ApprovedJob[]>([]);

  useEffect(() => {
    // Load approved jobs from localStorage
    try {
      const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
      const approved = allJobs.filter((job: ApprovedJob) => job.status === 'approved');
      const accepted = allJobs.filter((job: ApprovedJob) => job.status === 'accepted');
      setApprovedJobs(approved);
      setMyAcceptedJobs(accepted);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  }, []);

  const handleAcceptJob = (jobId: string) => {
    // Update job status to accepted
    const allJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    const updatedJobs = allJobs.map((job: ApprovedJob) => 
      job.id === jobId 
        ? { ...job, status: 'accepted', acceptedDate: new Date().toISOString(), acceptedBy: 'John Doe' }
        : job
    );
    
    localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    
    // Move job from approved to accepted
    const jobToAccept = approvedJobs.find(job => job.id === jobId);
    if (jobToAccept) {
      const acceptedJob = { ...jobToAccept, status: 'accepted', acceptedDate: new Date().toISOString(), acceptedBy: 'John Doe' };
      setApprovedJobs(approvedJobs.filter(job => job.id !== jobId));
      setMyAcceptedJobs([...myAcceptedJobs, acceptedJob]);
    }
    
    alert('Job accepted! You will be contacted by the company to schedule the work.');
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
              <h1 className="text-3xl font-bold tracking-tight">Available Cleaning Jobs</h1>
              <p className="text-muted-foreground">
                Accept approved jobs - first come, first served
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" >
                <Link href="/janitor/profile">
                  <Star className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </Button>
              <Button variant="outline" >
                <Link href="/janitor/availability">
                  <Clock className="mr-2 h-4 w-4" />
                  Availability
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,500</div>
                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.9</div>
                <p className="text-xs text-muted-foreground">From clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jobs Accepted</CardTitle>
                <Hand className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myAcceptedJobs.length}</div>
                <p className="text-xs text-muted-foreground">This session</p>
              </CardContent>
            </Card>
          </div>

          {/* Available Jobs */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Approved Jobs Available</h2>
            
            {approvedJobs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No approved jobs available</h3>
                  <p className="text-muted-foreground">
                    Check back later for new approved cleaning jobs.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {approvedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow border-green-200">
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
                              Approved {formatDateTime(job.approvedDate)}
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
                          <div className="text-lg font-bold text-green-600 mb-2">
                            ${job.cleanerAmount}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-100 text-green-800">Approved by Platform</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Original: ${job.budget}</p>
                            <p className="text-green-600 font-medium">You earn: ${job.cleanerAmount}</p>
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
                        <Button 
                          onClick={() => handleAcceptJob(job.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Hand className="mr-2 h-4 w-4" />
                          Accept Job
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* My Accepted Jobs */}
          {myAcceptedJobs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">My Accepted Jobs</h2>
              <div className="space-y-4">
                {myAcceptedJobs.map((job) => (
                  <Card key={job.id} className="border-blue-200 bg-blue-50">
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
                              Accepted {formatDateTime(job.postedDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 mb-2">
                            ${job.cleanerAmount}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-100 text-blue-800">Accepted by You</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Waiting for company contact</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">How It Works</span>
              </div>
              <div className="text-blue-700 text-sm space-y-1">
                <p>• Jobs are pre-approved by the platform with 40% margin deducted</p>
                <p>• You see the exact amount you'll earn (60% of original budget)</p>
                <p>• First cleaner to accept gets the job - no bidding required</p>
                <p>• Company will contact you directly to schedule the work</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}