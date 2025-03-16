'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StaggerContainer } from '@/components/ui/motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  heading?: React.ReactNode;
  sidebar?: React.ReactNode;
  fullWidth?: boolean;
}

export function DashboardLayout({
  children,
  className,
  heading,
  sidebar,
  fullWidth = false,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {heading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-6 px-4 sm:px-6 lg:px-8 border-b"
        >
          {heading}
        </motion.div>
      )}

      <div className={cn('mx-auto', fullWidth ? 'max-w-full' : 'max-w-7xl')}>
        <div
          className={cn(
            'flex flex-col lg:flex-row',
            sidebar ? 'lg:gap-8' : '',
            'px-4 sm:px-6 lg:px-8 py-6',
            className
          )}
        >
          {sidebar && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:w-64 flex-shrink-0 mb-8 lg:mb-0"
            >
              {sidebar}
            </motion.aside>
          )}

          <main className="flex-1">
            <StaggerContainer className="grid grid-cols-1 gap-6" staggerDelay={0.05} delay={0.1}>
              {children}
            </StaggerContainer>
          </main>
        </div>
      </div>
    </div>
  );
}
