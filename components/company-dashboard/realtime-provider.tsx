'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSocket } from '@/lib/realtime';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // For now, we'll skip the Clerk authentication and just set up the socket
    // In a real app, you'd get the orgId from Clerk authentication
    const orgId = 'demo-org'; // Mock organization ID for demo purposes

    const socket = getClientSocket();
    
    // Subscribe to organization-specific job events
    const channel = `company:${orgId}:jobs`;
    
    const handleJobEvent = (data: any) => {
      console.log('Received job event:', data);
      
      // Refresh the current page to get updated data
      router.refresh();
      
      // You could also implement more granular updates here
      // For example, updating specific components without full page refresh
    };

    socket.on(channel, handleJobEvent);

    return () => {
      socket.off(channel, handleJobEvent);
    };
  }, [router]);

  return <>{children}</>;
}
