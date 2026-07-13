'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  centered?: boolean;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.22, 1, 0.36, 1] as number[],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as number[] },
  },
};

export function SectionHeader({
  label,
  title,
  description,
  action,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`flex flex-col gap-3 ${centered ? 'items-center text-center' : 'items-start'} ${className ?? ''}`}
    >
      {/* Label */}
      <motion.span
        variants={itemVariants}
        className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground"
      >
        {label}
      </motion.span>

      {/* Title + Action row */}
      <motion.div
        variants={itemVariants}
        className={`flex w-full items-end justify-between gap-4 ${centered ? 'flex-col items-center' : ''}`}
      >
        <h2 className="font-heading text-4xl leading-none tracking-wide text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h2>

        {action && !centered && (
          <Link
            href={action.href}
            className="group flex shrink-0 items-center gap-2 pb-1 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            {action.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        )}
      </motion.div>

      {/* Description */}
      {description && (
        <motion.p
          variants={itemVariants}
          className="max-w-xl text-sm leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>
      )}

      {/* Centered action */}
      {action && centered && (
        <motion.div variants={itemVariants}>
          <Link
            href={action.href}
            className="group mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            {action.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
