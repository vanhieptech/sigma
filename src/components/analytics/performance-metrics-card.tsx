'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsMetrics } from '@/types/analytics';
import {
  BarChart4Icon,
  HeartIcon,
  MessageSquareIcon,
  Share2Icon,
  UsersIcon,
  DiamondIcon,
  PercentIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from 'lucide-react';

interface PerformanceMetricsCardProps {
  data?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    followers: number;
    engagement: number;
    diamonds?: number;
  };
  changes?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    followers: number;
    engagement: number;
    diamonds?: number;
  };
  isLoading?: boolean;
}

// Utility to format large numbers with K/M suffix
const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export function PerformanceMetricsCard({
  data,
  changes,
  isLoading = false,
}: PerformanceMetricsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key metrics for your account</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[355px]">
          <p className="text-muted-foreground">Loading metrics...</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !changes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key metrics for your account</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[355px]">
          <p className="text-muted-foreground">No metrics available</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      name: 'Views',
      value: data.views,
      change: changes.views,
      icon: BarChart4Icon,
      color: 'bg-blue-500/20 text-blue-500',
    },
    {
      name: 'Likes',
      value: data.likes,
      change: changes.likes,
      icon: HeartIcon,
      color: 'bg-pink-500/20 text-pink-500',
    },
    {
      name: 'Comments',
      value: data.comments,
      change: changes.comments,
      icon: MessageSquareIcon,
      color: 'bg-orange-500/20 text-orange-500',
    },
    {
      name: 'Shares',
      value: data.shares,
      change: changes.shares,
      icon: Share2Icon,
      color: 'bg-purple-500/20 text-purple-500',
    },
    {
      name: 'New Followers',
      value: data.followers,
      change: changes.followers,
      icon: UsersIcon,
      color: 'bg-green-500/20 text-green-500',
    },
  ];

  // Add diamonds if available
  if (data.diamonds !== undefined && changes.diamonds !== undefined) {
    metrics.push({
      name: 'Diamonds',
      value: data.diamonds,
      change: changes.diamonds,
      icon: DiamondIcon,
      color: 'bg-yellow-500/20 text-yellow-500',
    });
  }

  // Always add engagement rate last
  metrics.push({
    name: 'Engagement Rate',
    value: data.engagement * 100, // Convert to percentage
    change: changes.engagement,
    icon: PercentIcon,
    color: 'bg-indigo-500/20 text-indigo-500',
    isPercentage: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key metrics for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map(metric => (
            <div key={metric.name} className="flex flex-col p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-md ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{metric.name}</span>
              </div>

              <div className="mt-1">
                <div className="text-2xl font-bold">
                  {metric.isPercentage ? `${metric.value.toFixed(2)}%` : formatNumber(metric.value)}
                </div>

                <div className="flex items-center mt-1">
                  {metric.change > 0 ? (
                    <div className="flex items-center text-xs text-green-500">
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                      <span>{Math.abs(metric.change).toFixed(1)}%</span>
                    </div>
                  ) : metric.change < 0 ? (
                    <div className="flex items-center text-xs text-red-500">
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                      <span>{Math.abs(metric.change).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No change</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
