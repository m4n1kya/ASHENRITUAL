import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { VesperAction } from '@/store/vesper.store';

export function VesperActionNav({ actions }: { actions: VesperAction[] }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {actions.map((action, i) => {
        // Resolve target based on action type
        let href = action.target;
        if (action.type === 'product' && !href.startsWith('/')) href = `/products/${href}`;
        else if (action.type === 'chapter' && !href.startsWith('/')) href = `/chapters/${href}`;
        else if (action.type === 'collection' && !href.startsWith('/')) href = `/shop?category=${href}`;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={href}
              className="group flex items-center gap-2 border border-[rgba(255,255,255,0.1)] bg-transparent px-4 py-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8E8E8] transition-all hover:border-[#FDFCFB] hover:bg-[#FDFCFB] hover:text-[#0A0A0A]"
            >
              {action.label}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
