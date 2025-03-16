'use client';

import { CompetitorAnalysis } from '@/components/analytics/competitor-analysis';
import { ContentCategories } from '@/components/analytics/content-categories';
import { ContentIdeas } from '@/components/analytics/content-ideas';
import { DemographicInsights } from '@/components/analytics/demographic-insights';
import { EngagementMetrics } from '@/components/analytics/engagement-metrics';
import { HistoricalPerformance } from '@/components/analytics/historical-performance';
import { PeakTimeAnalysis } from '@/components/analytics/peak-time-analysis';
import { PredictiveTrends } from '@/components/analytics/predictive-trends';
import { RealTimeInsights } from '@/components/analytics/real-time-insights';
import { RevenueInsights } from '@/components/analytics/revenue-insights';
import { TopicAnalysis } from '@/components/analytics/topic-analysis';
import { TrendingTopics } from '@/components/analytics/trending-topics';
import { DashboardLayout } from '@/components/dashboard-layout';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { ChartSkeleton } from '@/components/ui/chart-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/enhanced-tabs';
import { StaggerContainer } from '@/components/ui/motion';
import {
  AreaChart,
  ArrowUpRight,
  BarChart4,
  Clock,
  LineChart,
  Users,
  Zap,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout
      heading={
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Analytics Dashboard
            <EnhancedBadge type="gradient" className="ml-2">
              Enhanced
            </EnhancedBadge>
          </h1>
          <p className="text-muted-foreground">
            Track your performance and discover content opportunities
          </p>
        </div>
      }
    >
      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList className="tabs-enhanced">
          <TabsTrigger value="analysis" className="tab-trigger-enhanced flex gap-2 items-center">
            <BarChart4 className="h-4 w-4" />
            <span>Content Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="realtime" className="tab-trigger-enhanced flex gap-2 items-center">
            <Clock className="h-4 w-4" />
            <span>Real-Time</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="tab-trigger-enhanced flex gap-2 items-center">
            <TrendingUp className="h-4 w-4" />
            <span>Predictions</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="tab-trigger-enhanced flex gap-2 items-center">
            <DollarSign className="h-4 w-4" />
            <span>Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="tab-trigger-enhanced flex gap-2 items-center">
            <Zap className="h-4 w-4" />
            <span>Suggestions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedCard animation="fadeIn" delay={0.1} hoverEffect="glow">
              <div className="flex flex-row items-center justify-between p-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Views</h3>
                  <div className="text-2xl font-bold mt-1">2.4M</div>
                  <div className="flex items-center text-xs text-green-500 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12.5% from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10">
                  <AreaChart className="h-6 w-6 text-primary" />
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard animation="fadeIn" delay={0.2} hoverEffect="glow">
              <div className="flex flex-row items-center justify-between p-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Avg. Engagement Rate
                  </h3>
                  <div className="text-2xl font-bold mt-1">5.28%</div>
                  <div className="flex items-center text-xs text-green-500 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+2.1% from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-secondary/10">
                  <LineChart className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard animation="fadeIn" delay={0.3} hoverEffect="glow">
              <div className="flex flex-row items-center justify-between p-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">New Followers</h3>
                  <div className="text-2xl font-bold mt-1">12.8K</div>
                  <div className="flex items-center text-xs text-green-500 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+18.2% from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-tiktok-pink/10">
                  <Users className="h-6 w-6 text-tiktok-pink" />
                </div>
              </div>
            </EnhancedCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<ChartSkeleton />}>
              <EngagementMetrics />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <TopicAnalysis />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<ChartSkeleton />}>
              <CompetitorAnalysis />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <HistoricalPerformance />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<ChartSkeleton />}>
              <PeakTimeAnalysis />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <DemographicInsights />
            </Suspense>
          </div>

          <Suspense fallback={<ChartSkeleton />}>
            <ContentCategories />
          </Suspense>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <RealTimeInsights />
          </Suspense>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <PredictiveTrends />
          </Suspense>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueInsights />
          </Suspense>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedCard animation="fadeIn" delay={0.1} gradient>
              <div className="flex flex-row items-center justify-between p-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Trending Topics</h3>
                  <div className="text-2xl font-bold mt-1">18</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    New trending topics today
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <ArrowUpRight className="h-6 w-6 text-primary" />
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard animation="fadeIn" delay={0.2} gradient>
              <div className="flex flex-row items-center justify-between p-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Content Ideas</h3>
                  <div className="text-2xl font-bold mt-1">42</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Generated based on your audience
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard animation="fadeIn" delay={0.3} gradient>
              <div className="flex flex-row items-center justify-between p-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Optimal Post Time</h3>
                  <div className="text-2xl font-bold mt-1">7:00 PM</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Today&apos;s optimal posting time
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </EnhancedCard>
          </div>

          <Suspense fallback={<ChartSkeleton />}>
            <TrendingTopics />
          </Suspense>

          <Suspense fallback={<ChartSkeleton />}>
            <ContentIdeas />
          </Suspense>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
