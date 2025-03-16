'use client';

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoricalComparison, TimeInterval } from '@/types/analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoricalChartProps {
  data: HistoricalComparison | null;
  isLoading: boolean;
  error: string | null;
  onTimeRangeChange?: (timeRange: TimeInterval) => void;
}

// Map metrics to user-friendly labels
const metricLabels: Record<string, string> = {
  views: 'Views',
  likes: 'Likes',
  comments: 'Comments',
  shares: 'Shares',
  follows: 'New Followers',
  diamonds: 'Diamonds',
  engagementRate: 'Engagement Rate',
};

export function HistoricalChart({
  data,
  isLoading,
  error,
  onTimeRangeChange,
}: HistoricalChartProps) {
  // Generate chart data for the selected metric
  const generateChartData = (metric: keyof typeof metricLabels) => {
    if (!data) return [];

    // For engagement rate, multiply by 100 to show as percentage
    const multiplier = metric === 'engagementRate' ? 100 : 1;

    return [
      {
        name: 'Previous Period',
        value:
          data.metrics.previous[metric === 'engagementRate' ? 'engagement' : metric] * multiplier,
      },
      {
        name: 'Current Period',
        value:
          data.metrics.current[metric === 'engagementRate' ? 'engagement' : metric] * multiplier,
      },
    ];
  };

  // Default to views if data is available
  const defaultMetric = data ? 'views' : null;
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(defaultMetric);

  // Update default metric when data changes
  React.useEffect(() => {
    if (data && !selectedMetric) {
      setSelectedMetric('views');
    }
  }, [data, selectedMetric]);

  // Format large numbers with k/m suffix
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Format numbers based on metric type
  const formatValue = (value: number, metric: string) => {
    if (metric === 'engagementRate') {
      return `${value.toFixed(2)}%`;
    }
    return formatNumber(value);
  };

  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    if (!selectedMetric || !data) return [];
    return generateChartData(selectedMetric as keyof typeof metricLabels);
  }, [selectedMetric, data]);

  // Calculate percentage change color and icon
  const getChangeDisplay = (change: number) => {
    const isPositive = change > 0;
    const color = isPositive ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500';
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

    return {
      color,
      icon: Icon,
      value: `${Math.abs(change).toFixed(1)}%`,
    };
  };

  // Update the prepareChartData function to use the new structure
  const prepareChartData = (data: HistoricalComparison) => {
    return data.growthTrend.map(point => ({
      date: point.date,
      views: point.views,
      followers: point.followers,
      engagement: point.engagement * 100, // Convert to percentage
    }));
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-52">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historical Performance</CardTitle>
        <CardDescription>Compare your current and previous period metrics</CardDescription>

        {/* Time range selector */}
        {onTimeRangeChange && (
          <Tabs
            defaultValue="24h"
            className="mt-2"
            onValueChange={value => onTimeRangeChange(value as TimeInterval)}
          >
            <TabsList className="grid grid-cols-3 w-fit">
              <TabsTrigger value="24h">24 Hours</TabsTrigger>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-56">
            <p>Loading historical data...</p>
          </div>
        ) : !data ? (
          <div className="flex items-center justify-center h-56">
            <p>No historical data available</p>
          </div>
        ) : (
          <>
            {/* Metric selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(metricLabels).map(([key, label]) => {
                // Skip diamonds if not available
                if (key === 'diamonds' && data.metrics.current.diamonds === undefined) {
                  return null;
                }

                const isSelected = selectedMetric === key;
                const metricKey =
                  key === 'engagementRate' ? 'engagement' : key === 'follows' ? 'followers' : key;
                const change = data.metrics.growth[metricKey as keyof typeof data.metrics.growth];
                const { color, icon: Icon, value } = getChangeDisplay(change);

                return (
                  <Badge
                    key={key}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer h-7 py-1 pr-1.5 flex items-center gap-1',
                      isSelected && 'pl-2'
                    )}
                    onClick={() => setSelectedMetric(key)}
                  >
                    {label}
                    {isSelected && (
                      <span className={`ml-1 flex items-center text-xs ${color}`}>
                        <Icon className="h-3 w-3 mr-0.5" />
                        {value}
                      </span>
                    )}
                  </Badge>
                );
              })}
            </div>

            {/* Chart */}
            {selectedMetric && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={value => formatValue(value, selectedMetric)} />
                    <Tooltip
                      formatter={(value: number) => [
                        formatValue(value, selectedMetric),
                        metricLabels[selectedMetric],
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium">Current Period</h3>
                <p className="text-xs text-muted-foreground">{data.metrics.timeInterval.label}</p>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium">Previous Period</h3>
                <p className="text-xs text-muted-foreground">
                  Previous {data.metrics.timeInterval.duration} days
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
