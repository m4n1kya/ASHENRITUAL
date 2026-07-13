import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

/* Reference: minimal, centered empty state with thin CTA button */

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {icon && (
        <div className="mb-8 opacity-20">
          {icon}
        </div>
      )}
      <h2 className="font-heading text-xl font-semibold uppercase tracking-[0.15em] text-[#E8E8E8]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[#8D8D8D]">
          {description}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="group mt-10 flex h-11 items-center gap-4 border border-[#202020] px-8 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8D8D8D] transition-all duration-500 hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8]"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
