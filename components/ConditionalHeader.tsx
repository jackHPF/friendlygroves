'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on all admin pages (including login)
  // During SSR, pathname might be null, so we check both conditions
  if (typeof window !== 'undefined' && pathname?.startsWith('/admin')) {
    return null;
  }
  
  // For SSR, we'll render it but hide it with CSS if needed
  // The client-side check above will handle it on the client
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <Header />;
}

