'use client';

import { Suspense, useState } from 'react';
import { Metadata } from 'next';
import {
  AreaChart,
  BarChart4,
  Clock,
  DollarSign,
  LineChart,
  MessageSquare,
  RefreshCw,
  Star,
  TrendingUp,
  Users,
  Zap,
  ChevronDown,
  ArrowUpRight,
  Heart,
  Share2,
  Smile,
  Meh,
  Frown,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/enhanced-tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { ChartSkeleton } from '@/components/ui/chart-skeleton';

// Import existing analytics components
import { RealTimeInsights } from '@/components/analytics/real-time-insights';
import { RevenueInsights } from '@/components/analytics/revenue-insights';
import { CompetitorAnalysis } from '@/components/analytics/competitor-analysis';
import { HistoricalPerformance } from '@/components/analytics/historical-performance';
import { EngagementMetrics } from '@/components/analytics/engagement-metrics';

// Create a consolidated analytics dashboard component
export default function EnhancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate data refresh
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Analytics Dashboard
            <EnhancedBadge type="gradient" className="ml-2">
              Enhanced
            </EnhancedBadge>
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your TikTok streaming
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Viewers</p>
                <h3 className="text-2xl font-bold mt-1">1,248</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12% from average
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-200/50 dark:bg-blue-800/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <h3 className="text-2xl font-bold mt-1">6.8%</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2.5% from last stream
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-200/50 dark:bg-green-800/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-tiktok-pink/10 to-tiktok-pink/20 dark:from-tiktok-pink/30 dark:to-tiktok-pink/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                <h3 className="text-2xl font-bold mt-1">124.5K</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +328 today
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-tiktok-pink/20 dark:bg-tiktok-pink/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-tiktok-pink" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
                <h3 className="text-2xl font-bold mt-1">$328.42</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +18% from yesterday
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-200/50 dark:bg-amber-800/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Real-Time</span>
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Growth</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="benchmarking" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Benchmarking</span>
          </TabsTrigger>
        </TabsList>

        {/* Real-Time Tab Content */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Live Viewer Count</CardTitle>
                <CardDescription>
                  Real-time viewer count with minute-by-minute tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Suspense fallback={<ChartSkeleton height={300} />}>
                  <div className="h-[300px]">
                    {/* This will be replaced by the actual chart from RealTimeInsights */}
                    <RealTimeInsights />
                  </div>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Real-Time Sentiment</CardTitle>
                <CardDescription>Live comment sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smile className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Positive</span>
                    </div>
                    <div className="font-bold">68%</div>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: '68%' }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Meh className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Neutral</span>
                    </div>
                    <div className="font-bold">22%</div>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: '22%' }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Frown className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Negative</span>
                    </div>
                    <div className="font-bold">10%</div>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Top Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    <EnhancedBadge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      amazing
                    </EnhancedBadge>
                    <EnhancedBadge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      love it
                    </EnhancedBadge>
                    <EnhancedBadge variant="outline" className="bg-amber-50 dark:bg-amber-900/20">
                      interesting
                    </EnhancedBadge>
                    <EnhancedBadge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      awesome
                    </EnhancedBadge>
                    <EnhancedBadge variant="outline" className="bg-amber-50 dark:bg-amber-900/20">
                      ok
                    </EnhancedBadge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Real-time interactions per minute</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center p-3 bg-muted/50 rounded-lg">
                    <Heart className="h-5 w-5 text-tiktok-pink mb-1" />
                    <div className="text-2xl font-bold">142</div>
                    <div className="text-xs text-muted-foreground">Likes/min</div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-muted/50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-500 mb-1" />
                    <div className="text-2xl font-bold">38</div>
                    <div className="text-xs text-muted-foreground">Comments/min</div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-muted/50 rounded-lg">
                    <Share2 className="h-5 w-5 text-green-500 mb-1" />
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Shares/min</div>
                  </div>
                </div>

                <Suspense fallback={<ChartSkeleton height={200} />}>
                  <div className="h-[200px]">
                    {/* Will integrate with EngagementMetrics component */}
                    <EngagementMetrics />
                  </div>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Audience Retention</CardTitle>
                    <CardDescription>Viewer retention over stream duration</CardDescription>
                  </div>
                  <EnhancedBadge type="info" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Live Data
                  </EnhancedBadge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px] flex flex-col justify-between">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium">Average watch time</div>
                      <div className="text-2xl font-bold">8m 42s</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Retention rate</div>
                      <div className="text-2xl font-bold">72%</div>
                    </div>
                  </div>

                  <div className="h-[200px] bg-muted/20 rounded-lg flex items-end p-4">
                    {/* This will be a placeholder for retention chart */}
                    <div className="w-full flex items-end justify-between gap-1">
                      {[85, 95, 100, 92, 88, 85, 80, 76, 72, 68].map((height, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-t from-tiktok-pink/80 to-tiktok-pink/50 rounded-t-sm"
                          style={{ height: `${height * 1.5}px`, width: '8%' }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Start</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>Current</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Growth Tab Content */}
        <TabsContent value="growth" className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <HistoricalPerformance />
          </Suspense>
        </TabsContent>

        {/* Engagement Tab Content */}
        <TabsContent value="engagement" className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <EngagementMetrics />
          </Suspense>
        </TabsContent>

        {/* Revenue Tab Content */}
        <TabsContent value="revenue" className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueInsights />
          </Suspense>
        </TabsContent>

        {/* Benchmarking Tab Content */}
        <TabsContent value="benchmarking" className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <CompetitorAnalysis />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
