import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RealtimeProvider } from '@/components/company-dashboard/realtime-provider';
import { Navigation } from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Link Pro - Professional Cleaning Marketplace',
  description: 'Connect with professional cleaners. Post jobs, receive bids, and get your space cleaned by verified experts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RealtimeProvider>
          <Navigation />
          {children}
        </RealtimeProvider>
      </body>
    </html>
  );
}
