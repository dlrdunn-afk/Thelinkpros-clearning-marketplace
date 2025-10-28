'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, Clock, MapPin, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JobBiddingPage() {
  const [user, setUser] = useState<any>(null);
  const [bidData, setBidData] = useState({
    amount: '',
    message: '',
    estimatedHours: '',
    availableDate: '',
  });
  const router = useRouter();

  // Mock job data - in real app, fetch from URL params or API
  const job = {
    id: '1',
    title: 'Office Deep Clean',
    company: 'TechCorp Inc.',
    location: 'Downtown, City',
    serviceType: 'Deep Clean',
    budgetMin: 300,
    budgetMax: 500,
    estimatedHours: 4,
    postedDate: '2024-01-25',
    biddingEnds: '2024-01-27',
    urgency: 'normal',
    description: 'Complete deep clean of 2000 sq ft office space including carpets, windows, and all surfaces. Need to be completed by end of week.',
    requirements: [
      'Professional cleaning equipment',
      'Eco-friendly products preferred',
      'Background check required',
      'Insurance coverage needed'
    ]
  };

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');
    
    if (userEmail && userName) {
      setUser({ email: userEmail, name: userName });
    }
  }, []);

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In real app, submit bid to database
    console.log('Bid submitted:', {
      jobId: job.id,
      cleanerId: user?.email,
      bidData
    });
    
    // Show success message and redirect
    alert('Bid submitted successfully!');
    router.push('/janitor/marketplace');
  };

  const getStatusBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High Priority</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/janitor/marketplace">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{job.company}</span>
                      {getStatusBadge(job.urgency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      ${job.budgetMin} - ${job.budgetMax}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Budget Range
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{job.estimatedHours} hours estimated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Posted {job.postedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>Bidding ends {job.biddingEnds}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-muted-foreground">{job.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <ul className="space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Bid Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Submit Your Bid</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Make a competitive offer for this job
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitBid} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Your Bid Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter your bid"
                      value={bidData.amount}
                      onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                      min={job.budgetMin}
                      max={job.budgetMax}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Budget range: ${job.budgetMin} - ${job.budgetMax}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      placeholder="How many hours?"
                      value={bidData.estimatedHours}
                      onChange={(e) => setBidData({ ...bidData, estimatedHours: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableDate">Available Date</Label>
                    <Input
                      id="availableDate"
                      type="date"
                      value={bidData.availableDate}
                      onChange={(e) => setBidData({ ...bidData, availableDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message to Company</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell the company why you're the best fit for this job..."
                      value={bidData.message}
                      onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Bid
                  </Button>
                </form>

                {/* Bid Tips */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Bidding Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Research market rates in your area</li>
                    <li>• Consider your experience and equipment</li>
                    <li>• Factor in travel time and costs</li>
                    <li>• Be competitive but don't undervalue your work</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
