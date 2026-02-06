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
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Friendly Groves - Premium Rental Apartments in Vizag',
    description:
      'Discover premium rental apartments in Visakhapatnam. Beautiful accommodations with modern amenities.',
    type: 'website',
    url: 'https://www.friendlygroves.co.in',
    images: [
      {
        url: 'https://www.friendlygroves.co.in/images/friendly-groves-logo.png',
        width: 1024,
        height: 1024,
        alt: 'Friendly Groves Logo',
      },
    ],
    siteName: 'Friendly Groves',
  },
  twitter: {
    card: 'summary',
    title: 'Friendly Groves - Premium Rental Apartments in Vizag',
    description:
      'Discover premium rental apartments in Visakhapatnam. Beautiful accommodations with modern amenities.',
    images: ['https://www.friendlygroves.co.in/images/friendly-groves-logo.png'],
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
