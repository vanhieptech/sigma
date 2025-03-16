'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  labelFormatter?: (label: string) => React.ReactNode;
  valueFormatter?: (value: number, name: string) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  className,
  style,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label || '') : label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-background/95 backdrop-blur-sm border rounded-lg shadow-md p-3 min-w-[150px]',
        className
      )}
      style={style}
    >
      {formattedLabel && (
        <div className="font-medium text-sm mb-1 pb-1 border-b">{formattedLabel}</div>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const value = valueFormatter ? valueFormatter(entry.value, entry.name) : entry.value;

          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
              <span className="text-xs font-medium">{value}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Formatter functions
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
