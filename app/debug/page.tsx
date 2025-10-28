'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const loadJobs = () => {
      try {
        const storedJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
        setJobs(storedJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    };
    
    loadJobs();
    setTimeout(loadJobs, 100);
  }, []);

  const createTestJob = () => {
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
    setJobs(updatedJobs);
    
    alert('Test job created!');
  };

  const clearAllJobs = () => {
    localStorage.removeItem('postedJobs');
    setJobs([]);
    alert('All jobs cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Debug: Job Storage</CardTitle>
            <p className="text-muted-foreground">
              This page shows all jobs stored in localStorage
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={createTestJob}>
                Create Test Job
              </Button>
              <Button onClick={clearAllJobs} variant="destructive">
                Clear All Jobs
              </Button>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Total Jobs: {jobs.length}</h3>
              
              {jobs.length === 0 ? (
                <p className="text-muted-foreground">No jobs found in localStorage</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <Card key={job.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">Status: {job.status}</p>
                            <p className="text-sm text-muted-foreground">Budget: ${job.budget}</p>
                            <p className="text-sm text-muted-foreground">Cleaner Amount: ${job.cleanerAmount}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {job.id}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <details className="mt-4">
              <summary className="cursor-pointer font-medium">View Raw localStorage Data</summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(jobs, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
