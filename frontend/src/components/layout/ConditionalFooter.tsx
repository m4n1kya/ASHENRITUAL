'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  if (pathname === '/sanctum') {
    return null;
  }
  
  return <Footer />;
}
