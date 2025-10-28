'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface TimeSlot {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

interface Availability {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export default function JanitorAvailability() {
  const [user, setUser] = useState<any>(null);
  const [availability, setAvailability] = useState<Availability>({
    monday: { morning: true, afternoon: true, evening: false },
    tuesday: { morning: true, afternoon: true, evening: false },
    wednesday: { morning: true, afternoon: true, evening: false },
    thursday: { morning: true, afternoon: true, evening: false },
    friday: { morning: true, afternoon: true, evening: false },
    saturday: { morning: false, afternoon: true, evening: false },
    sunday: { morning: false, afternoon: false, evening: false },
  });

  const [timeSlots] = useState([
    { id: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM' },
    { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM' },
    { id: 'evening', label: 'Evening', time: '5:00 PM - 9:00 PM' },
  ]);

  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');
    
    if (userEmail && userName) {
      setUser({ email: userEmail, name: userName });
    }
  }, []);

  const toggleAvailability = (day: keyof Availability, slot: keyof TimeSlot) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: !prev[day][slot]
      }
    }));
  };

  const getTotalAvailableHours = () => {
    let total = 0;
    Object.values(availability).forEach(day => {
      Object.values(day).forEach(slot => {
        if (slot) total += 4; // 4 hours per slot
      });
    });
    return total;
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

          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Availability Settings</h1>
              <p className="text-muted-foreground">
                Set your available hours to help companies find you for jobs
              </p>
            </div>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Availability Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{getTotalAvailableHours()}</div>
                    <div className="text-sm text-muted-foreground">Hours Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(availability).filter(day => 
                        Object.values(day).some(slot => slot)
                      ).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.values(availability).reduce((total, day) => 
                        total + Object.values(day).filter(slot => slot).length, 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Time Slots</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Click on time slots to toggle your availability
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2 font-medium">Day</th>
                        {timeSlots.map(slot => (
                          <th key={slot.id} className="text-center p-2 font-medium">
                            <div className="text-sm">{slot.label}</div>
                            <div className="text-xs text-muted-foreground">{slot.time}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {days.map(day => (
                        <tr key={day.id} className="border-t">
                          <td className="p-2 font-medium">{day.label}</td>
                          {timeSlots.map(slot => (
                            <td key={slot.id} className="p-2 text-center">
                              <Button
                                variant={availability[day.id as keyof Availability][slot.id as keyof TimeSlot] ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleAvailability(day.id as keyof Availability, slot.id as keyof TimeSlot)}
                                className="w-full"
                              >
                                {availability[day.id as keyof Availability][slot.id as keyof TimeSlot] ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </Button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const weekdays: (keyof Availability)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                      setAvailability(prev => {
                        const newAvailability = { ...prev };
                        weekdays.forEach(day => {
                          newAvailability[day] = {
                            morning: true,
                            afternoon: true,
                            evening: false
                          };
                        });
                        return newAvailability;
                      });
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Weekdays Only
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setAvailability(prev => {
                        const newAvailability = { ...prev };
                        Object.keys(newAvailability).forEach(day => {
                          newAvailability[day as keyof Availability] = {
                            morning: true,
                            afternoon: true,
                            evening: true
                          };
                        });
                        return newAvailability;
                      });
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    All Available
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setAvailability(prev => {
                        const newAvailability = { ...prev };
                        Object.keys(newAvailability).forEach(day => {
                          newAvailability[day as keyof Availability] = {
                            morning: false,
                            afternoon: false,
                            evening: false
                          };
                        });
                        return newAvailability;
                      });
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="text-center">
              <Button size="lg" onClick={() => console.log('Availability saved:', availability)}>
                Save Availability Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}