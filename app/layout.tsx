import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalHeader from '@/components/ConditionalHeader';
import ConditionalFooter from '@/components/ConditionalFooter';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Friendly Groves - Premium Rental Apartments in Vizag',
  description:
    'Discover premium rental apartments in Visakhapatnam. Beautiful accommodations with modern amenities, prime locations, and exceptional service. Book your perfect stay today!',
  keywords: [
    'rental apartments Vizag',
    'Visakhapatnam accommodations',
    'vacation rentals Vizag',
    'furnished apartments Vizag',
    'Friendly Groves',
  ],
  openGraph: {
    title: 'Friendly Groves - Premium Rental Apartments in Vizag',
    description:
      'Discover premium rental apartments in Visakhapatnam. Beautiful accommodations with modern amenities.',
    type: 'website',
    url: 'https://www.friendlygroves.co.in',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ConditionalHeader />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
