'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartSkeletonProps {
  height?: number;
  showLegend?: boolean;
}

export function ChartSkeleton({ height = 250, showLegend = true }: ChartSkeletonProps) {
  return (
    <div className="w-full space-y-3">
      {showLegend && (
        <div className="flex space-x-2 justify-end">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      )}

      <Skeleton className="w-full" style={{ height: `${height}px` }} />

      <div className="flex justify-between">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
    </div>
  );
}
