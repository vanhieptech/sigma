'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  gradient?: boolean;
  animation?: 'fadeIn' | 'slideUp' | 'scale' | 'none';
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
  delay?: number;
}

export function EnhancedCard({
  children,
  className,
  gradient = false,
  animation = 'fadeIn',
  hoverEffect = 'lift',
  delay = 0,
  ...props
}: EnhancedCardProps) {
  // Animation variants
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
    none: {
      initial: {},
      animate: {},
    },
  };

  // Hover effects
  const getHoverClass = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md';
      case 'glow':
        return 'transition-all duration-300 hover:shadow-[0_0_15px_rgba(254,44,85,0.15)]';
      case 'border':
        return 'transition-all duration-300 hover:border-primary/40';
      case 'none':
        return '';
      default:
        return '';
    }
  };

  // Gradient classes
  const gradientClass = gradient
    ? 'border-transparent bg-card relative before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:p-[1px] before:bg-tiktok-gradient before:opacity-20 hover:before:opacity-100 before:transition-opacity'
    : '';

  return (
    <motion.div
      initial={variants[animation].initial}
      animate={variants[animation].animate}
      transition={{
        duration: 0.3,
        delay,
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
    >
      <Card className={cn(getHoverClass(), gradientClass, 'overflow-hidden', className)} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
