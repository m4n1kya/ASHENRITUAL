'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Scan, Eye, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Chat', href: '/vesper', icon: MessageSquare },
  { name: 'Size', href: '/vesper/size', icon: Scan },
  { name: 'Preview', href: '/vesper/preview', icon: Eye },
  { name: 'Fit', href: '/vesper/measurements', icon: Ruler },
];

export default function VesperLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      className="flex h-screen bg-[#050505] text-[#E8E8E8] font-sans overflow-hidden"
      style={{ paddingTop: '100px' }}
    >
      {/* Left: Chat content — takes most of the width */}
      <div className="flex-1 overflow-hidden min-w-0">
        {children}
      </div>

      {/* Right: Vertical nav — no box, pure floating links */}
      <nav className="flex-none flex flex-col items-end gap-1 px-6 pt-8 shrink-0" aria-label="Vesper navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 rounded-full',
                isActive
                  ? 'text-[#FDFCFB]'
                  : 'text-[#333] hover:text-[#8D8D8D]'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
