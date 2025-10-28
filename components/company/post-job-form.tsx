'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, DollarSign, Upload, X, Building2, Users, Calendar } from 'lucide-react';

// Job type configurations
const jobTypes = {
  'office-cleaning': {
    name: 'Office Cleaning',
    description: 'Regular office maintenance and cleaning',
    fields: ['squareFootage', 'numberOfEmployees', 'cleaningFrequency', 'specialRequirements'],
    icon: Building2
  },
  'retail-cleaning': {
    name: 'Retail Store Cleaning',
    description: 'Store cleaning and maintenance',
    fields: ['squareFootage', 'storeType', 'cleaningFrequency', 'specialRequirements'],
    icon: Building2
  },
  'restaurant-cleaning': {
    name: 'Restaurant Cleaning',
    description: 'Kitchen and dining area cleaning',
    fields: ['squareFootage', 'seatingCapacity', 'cleaningFrequency', 'kitchenEquipment'],
    icon: Building2
  },
  'warehouse-cleaning': {
    name: 'Warehouse Cleaning',
    description: 'Industrial warehouse cleaning',
    fields: ['squareFootage', 'warehouseType', 'cleaningFrequency', 'specialRequirements'],
    icon: Building2
  },
  'medical-cleaning': {
    name: 'Medical Facility Cleaning',
    description: 'Healthcare facility cleaning',
    fields: ['squareFootage', 'facilityType', 'cleaningFrequency', 'complianceRequirements'],
    icon: Building2
  },
  'deep-clean': {
    name: 'Deep Clean',
    description: 'One-time intensive cleaning',
    fields: ['squareFootage', 'lastCleaned', 'specialRequirements'],
    icon: Building2
  },
  'post-construction': {
    name: 'Post-Construction Cleanup',
    description: 'Construction debris and dust removal',
    fields: ['squareFootage', 'constructionType', 'debrisLevel', 'specialRequirements'],
    icon: Building2
  },
  'event-cleanup': {
    name: 'Event Cleanup',
    description: 'Pre/post event cleaning',
    fields: ['eventType', 'attendeeCount', 'eventDuration', 'specialRequirements'],
    icon: Building2
  }
};

export function PostJobForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullAddress: '',
    city: '',
    state: '',
    zipCode: '',
    jobType: '',
    budget: '',
    hasBeenCleaned: '',
    previousCleanerCount: '',
    previousCleaningDuration: '',
    cleaningFrequency: '',
    squareFootage: '',
    numberOfEmployees: '',
    seatingCapacity: '',
    storeType: '',
    warehouseType: '',
    facilityType: '',
    lastCleaned: '',
    constructionType: '',
    debrisLevel: '',
    eventType: '',
    attendeeCount: '',
    eventDuration: '',
    specialRequirements: '',
    kitchenEquipment: '',
    complianceRequirements: '',
    preferredDate: '',
    urgency: 'normal',
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
    
    console.log('Job posted:', formData);
    console.log('Uploaded images:', uploadedImages);
    
    // Show success message
    alert('Job posted successfully! Redirecting to your job listings...');
    
    // Redirect to company marketplace page after a short delay
    setTimeout(() => {
      router.push('/company/marketplace');
    }, 1500);
    
    // In real app, this would call a server action with FormData
  };

  const selectedJobType = formData.jobType ? jobTypes[formData.jobType as keyof typeof jobTypes] : null;

  return (
    <Card className="w-full max-w-5xl mx-auto">
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
                <SelectItem value="office-cleaning">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Office Cleaning</div>
                      <div className="text-xs text-muted-foreground">Regular office maintenance and cleaning</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="retail-cleaning">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Retail Store Cleaning</div>
                      <div className="text-xs text-muted-foreground">Store cleaning and maintenance</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="restaurant-cleaning">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Restaurant Cleaning</div>
                      <div className="text-xs text-muted-foreground">Kitchen and dining area cleaning</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="warehouse-cleaning">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Warehouse Cleaning</div>
                      <div className="text-xs text-muted-foreground">Industrial warehouse cleaning</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="medical-cleaning">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Medical Facility Cleaning</div>
                      <div className="text-xs text-muted-foreground">Healthcare facility cleaning</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="deep-clean">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Deep Clean</div>
                      <div className="text-xs text-muted-foreground">One-time intensive cleaning</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="post-construction">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Post-Construction Cleanup</div>
                      <div className="text-xs text-muted-foreground">Construction debris and dust removal</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="event-cleanup">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Event Cleanup</div>
                      <div className="text-xs text-muted-foreground">Pre/post event cleaning</div>
                    </div>
                  </div>
                </SelectItem>
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

          {/* Dynamic Job-Specific Fields */}
          {selectedJobType && (
            <div className="space-y-6 p-6 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold">{selectedJobType.name} Details</h3>
              
              {/* Square Footage - Common field */}
              {selectedJobType.fields.includes('squareFootage') && (
                <div className="space-y-2">
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                    required
                  />
                </div>
              )}

              {/* Office-specific fields */}
              {formData.jobType === 'office-cleaning' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="numberOfEmployees"
                        type="number"
                        placeholder="e.g., 25"
                        className="pl-10"
                        value={formData.numberOfEmployees}
                        onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Restaurant-specific fields */}
              {formData.jobType === 'restaurant-cleaning' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                    <Input
                      id="seatingCapacity"
                      type="number"
                      placeholder="e.g., 80"
                      value={formData.seatingCapacity}
                      onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kitchenEquipment">Kitchen Equipment</Label>
                    <Textarea
                      id="kitchenEquipment"
                      placeholder="Describe kitchen equipment (ovens, fryers, etc.)"
                      value={formData.kitchenEquipment}
                      onChange={(e) => setFormData({ ...formData, kitchenEquipment: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Retail-specific fields */}
              {formData.jobType === 'retail-cleaning' && (
                <div className="space-y-2">
                  <Label htmlFor="storeType">Store Type</Label>
                  <Select
                    value={formData.storeType}
                    onValueChange={(value) => setFormData({ ...formData, storeType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing Store</SelectItem>
                      <SelectItem value="electronics">Electronics Store</SelectItem>
                      <SelectItem value="grocery">Grocery Store</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="furniture">Furniture Store</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Event-specific fields */}
              {formData.jobType === 'event-cleanup' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select
                      value={formData.eventType}
                      onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="party">Party</SelectItem>
                        <SelectItem value="trade-show">Trade Show</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendeeCount">Expected Attendees</Label>
                    <Input
                      id="attendeeCount"
                      type="number"
                      placeholder="e.g., 150"
                      value={formData.attendeeCount}
                      onChange={(e) => setFormData({ ...formData, attendeeCount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDuration">Event Duration (hours)</Label>
                    <Input
                      id="eventDuration"
                      type="number"
                      placeholder="e.g., 4"
                      value={formData.eventDuration}
                      onChange={(e) => setFormData({ ...formData, eventDuration: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Cleaning Frequency - Common field */}
              {selectedJobType.fields.includes('cleaningFrequency') && (
                <div className="space-y-2">
                  <Label htmlFor="cleaningFrequency">How often do you need cleaning?</Label>
                  <Select
                    value={formData.cleaningFrequency}
                    onValueChange={(value) => setFormData({ ...formData, cleaningFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cleaning frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly (every 2 weeks)</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="one-time">One-time only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Previous Cleaning Experience */}
              <div className="space-y-4">
                <h4 className="font-medium">Previous Cleaning Experience</h4>
                <div className="space-y-2">
                  <Label htmlFor="hasBeenCleaned">Has this space been professionally cleaned before?</Label>
                  <Select
                    value={formData.hasBeenCleaned}
                    onValueChange={(value) => setFormData({ ...formData, hasBeenCleaned: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, regularly</SelectItem>
                      <SelectItem value="occasionally">Yes, occasionally</SelectItem>
                      <SelectItem value="never">No, never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.hasBeenCleaned && formData.hasBeenCleaned !== 'never' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="previousCleanerCount">How many cleaners typically worked?</Label>
                      <Input
                        id="previousCleanerCount"
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.previousCleanerCount}
                        onChange={(e) => setFormData({ ...formData, previousCleanerCount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousCleaningDuration">How long did it typically take?</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="previousCleaningDuration"
                          placeholder="e.g., 3 hours"
                          className="pl-10"
                          value={formData.previousCleaningDuration}
                          onChange={(e) => setFormData({ ...formData, previousCleaningDuration: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requirements */}
              {selectedJobType.fields.includes('specialRequirements') && (
                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Any specific requirements, areas to focus on, or special instructions..."
                    rows={3}
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  />
                </div>
              )}
            </div>
          )}

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="fullAddress">Full Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullAddress"
                  placeholder="123 Main Street, Suite 100"
                  className="pl-10"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Budget and Timing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Your Budget</Label>
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
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="preferredDate"
                  type="date"
                  className="pl-10"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => setFormData({ ...formData, urgency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Flexible timing</SelectItem>
                  <SelectItem value="normal">Normal - Within a week</SelectItem>
                  <SelectItem value="high">High - Within 2-3 days</SelectItem>
                  <SelectItem value="urgent">Urgent - ASAP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Photos (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              Upload photos to help cleaners understand the space and cleaning requirements
            </p>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="text-sm font-medium text-primary hover:text-primary/80">
                      Click to upload photos
                    </span>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" size="lg">
              Post Job & Get Quotes
            </Button>
            <Button type="button" variant="outline" className="flex-1" size="lg">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
