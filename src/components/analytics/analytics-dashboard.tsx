'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHistoricalAnalytics } from '@/hooks/analytics/use-historical-analytics';
import { useTrendAnalytics } from '@/hooks/analytics/use-trend-analytics';
import { useSentimentAnalytics } from '@/hooks/analytics/use-sentiment-analytics';
import { TimeInterval } from '@/types/analytics';
import { HistoricalChart } from './historical-chart';
import { TrendingTopicsCard } from '@/components/analytics/trending-topics-card';
import { ContentSuggestionCard } from '@/components/analytics/content-suggestion-card';
import { SentimentAnalysisCard } from '@/components/analytics/sentiment-analysis-card';
import { PerformanceMetricsCard } from '@/components/analytics/performance-metrics-card';

interface AnalyticsDashboardProps {
  userId?: string;
}

export function AnalyticsDashboard({ userId = 'demo-user' }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeInterval>('24h');

  // Fetch historical analytics data
  const {
    comparison,
    isLoading: isLoadingHistorical,
    error: historicalError,
    fetchComparison,
  } = useHistoricalAnalytics({
    userId,
    initialTimeRange: timeRange,
    autoFetch: true,
  });

  // Fetch trend analytics data
  const {
    hashtags,
    sounds,
    recommendations,
    contentIdeas,
    isLoading: isLoadingTrends,
    error: trendsError,
  } = useTrendAnalytics();

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: TimeInterval) => {
    setTimeRange(newTimeRange);
    fetchComparison(newTimeRange);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Historical Performance Chart */}
            <HistoricalChart
              data={comparison}
              isLoading={isLoadingHistorical}
              error={historicalError}
              onTimeRangeChange={handleTimeRangeChange}
            />

            {/* Performance Summary */}
            <PerformanceMetricsCard
              data={comparison?.metrics.current}
              changes={comparison?.metrics.growth}
              isLoading={isLoadingHistorical}
            />
          </div>

          {/* Recent Content Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Content Performance</CardTitle>
              <CardDescription>View how your recent videos are performing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This feature will display your recent video performance metrics. Coming soon in the
                next update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TrendingTopicsCard
              hashtags={hashtags}
              sounds={sounds}
              isLoading={isLoadingTrends}
              error={trendsError}
            />

            <ContentSuggestionCard
              contentIdeas={contentIdeas}
              recommendations={recommendations}
              isLoading={isLoadingTrends}
            />
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <SentimentAnalysisCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
