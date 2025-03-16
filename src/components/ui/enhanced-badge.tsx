'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success:
          'border-transparent bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-400',
        warning:
          'border-transparent bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-400',
        info: 'border-transparent bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-400',
      },
      type: {
        default: '',
        gradient: 'border-transparent bg-gradient-to-r from-tiktok-pink to-tiktok-blue text-white',
        info: 'border-transparent bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-400',
        success:
          'border-transparent bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-400',
        warning:
          'border-transparent bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-400',
        error: 'border-transparent bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function EnhancedBadge({ className, variant, type, ...props }: BadgeProps) {
  // If type is provided, use it for styling, otherwise use variant
  const variantToUse = type ? undefined : variant;

  return (
    <div className={cn(badgeVariants({ variant: variantToUse, type }), className)} {...props} />
  );
}

export { EnhancedBadge, badgeVariants };
