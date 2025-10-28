'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, DollarSign, Upload, X, Building2 } from 'lucide-react';

// Job type configurations
const jobTypes = {
  'office-cleaning': {
    name: 'Office Cleaning',
    description: 'Regular office maintenance and cleaning',
  },
  'retail-cleaning': {
    name: 'Retail Store Cleaning',
    description: 'Store cleaning and maintenance',
  },
  'restaurant-cleaning': {
    name: 'Restaurant Cleaning',
    description: 'Kitchen and dining area cleaning',
  },
  'warehouse-cleaning': {
    name: 'Warehouse Cleaning',
    description: 'Industrial warehouse cleaning',
  },
  'medical-cleaning': {
    name: 'Medical Facility Cleaning',
    description: 'Healthcare facility cleaning',
  },
  'deep-clean': {
    name: 'Deep Clean',
    description: 'One-time intensive cleaning',
  },
  'post-construction': {
    name: 'Post-Construction Cleanup',
    description: 'Construction debris and dust removal',
  },
  'event-cleanup': {
    name: 'Event Cleanup',
    description: 'Pre/post event cleaning',
  }
};

export default function PostJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullAddress: '',
    jobType: '',
    budget: '',
    cleaningFrequency: '',
    squareFootage: '',
    specialRequirements: '',
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = [...uploadedImages, ...files];
    setUploadedImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.jobType) {
      alert('Please select a cleaning type');
      return;
    }
    if (!formData.title) {
      alert('Please enter a job title');
      return;
    }
    if (!formData.fullAddress) {
      alert('Please enter the full address');
      return;
    }
    if (!formData.budget) {
      alert('Please enter your budget');
      return;
    }
    
    // Create job object - now goes to platform for approval
    const newJob = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      fullAddress: formData.fullAddress,
      jobType: formData.jobType,
      jobTypeName: jobTypes[formData.jobType as keyof typeof jobTypes]?.name || formData.jobType,
      budget: parseInt(formData.budget),
      cleaningFrequency: formData.cleaningFrequency,
      squareFootage: formData.squareFootage,
      specialRequirements: formData.specialRequirements,
      status: 'pending_approval', // Changed from 'bidding' to 'pending_approval'
      bids: 0,
      postedDate: new Date().toISOString(),
      biddingEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      companyName: 'Your Company', // In real app, get from user profile
      platformMargin: 0.40, // 40% platform margin
      cleanerAmount: Math.round(parseInt(formData.budget) * 0.60), // 60% goes to cleaner
    };

    // Save to localStorage
    const existingJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    const updatedJobs = [...existingJobs, newJob];
    localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    
    console.log('Job posted:', newJob);
    console.log('All jobs:', updatedJobs);
    
    // Show success message
    alert('Job submitted for platform approval! You will be notified once approved and sent to cleaners.');
    
    // Redirect to company marketplace page after a short delay
    setTimeout(() => {
      router.push('/company/marketplace');
    }, 1500);
  };

  const selectedJobType = formData.jobType ? jobTypes[formData.jobType as keyof typeof jobTypes] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Post Your Commercial Cleaning Job</CardTitle>
          <p className="text-muted-foreground">
            Get accurate quotes by providing detailed information about your cleaning needs.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Job Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What type of cleaning do you need?</h3>
              <Select
                value={formData.jobType}
                onValueChange={(value) => setFormData({ ...formData, jobType: value })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select the type of cleaning service you need" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(jobTypes).map(([key, jobType]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{jobType.name}</div>
                          <div className="text-xs text-muted-foreground">{jobType.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Basic Job Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Job Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Office Deep Clean, Restaurant Kitchen Cleaning"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the cleaning work needed, any specific requirements, or special instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullAddress">Full Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullAddress"
                    placeholder="123 Main St, City, State 12345"
                    className="pl-10"
                    value={formData.fullAddress}
                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (in dollars) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 500"
                    className="pl-10"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Additional Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cleaningFrequency">How often?</Label>
                  <Select
                    value={formData.cleaningFrequency}
                    onValueChange={(value) => setFormData({ ...formData, cleaningFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Any special requirements, equipment needed, or specific instructions..."
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photos (Optional)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <Label htmlFor="images" className="cursor-pointer">
                  <span className="text-primary hover:underline">Click to upload photos</span>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload photos to help cleaners understand the job better
                </p>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              Post Job & Get Quotes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}