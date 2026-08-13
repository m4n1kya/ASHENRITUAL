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
    <div className="flex h-screen bg-[#050505] text-[#E8E8E8] font-sans overflow-hidden flex-col" style={{ paddingTop: '64px' }}>
      {/* Slim top nav */}
      <nav className="flex-none flex items-center gap-1 px-4 py-2 border-b border-white/[0.05] bg-[#080808] shrink-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-[#FDFCFB]'
                  : 'text-[#4A4A4A] hover:text-[#8D8D8D] hover:bg-white/[0.04]'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
