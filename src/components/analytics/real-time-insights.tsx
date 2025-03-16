'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/enhanced-tabs';
import { ChartTooltip, formatNumber } from '@/components/ui/chart-tooltip';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  Smile,
  Frown,
  Meh,
} from 'lucide-react';

// Sample data for real-time metrics
const generateRealtimeData = (count = 30) => {
  const now = new Date();
  const data = [];

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Generate realistic viewer pattern with fluctuations
    const baseViewers = 15000 - i * 100;
    const viewers = Math.max(0, baseViewers + Math.floor(Math.random() * 3000 - 1500));

    // Engagement metrics
    const likes = Math.floor(viewers * (0.15 + Math.random() * 0.1));
    const comments = Math.floor(viewers * (0.02 + Math.random() * 0.01));
    const shares = Math.floor(viewers * (0.01 + Math.random() * 0.005));

    // Add some peaks and valleys for realism
    const adjustedViewers = i % 7 === 0 ? viewers * 1.2 : i % 11 === 0 ? viewers * 0.85 : viewers;

    data.push({
      time: timeStr,
      viewers: Math.floor(adjustedViewers),
      likes,
      comments,
      shares,
    });
  }

  return data;
};

// Sample sentiment data
const sentimentData = [
  { time: '11:00', positive: 65, neutral: 30, negative: 5 },
  { time: '11:05', positive: 68, neutral: 28, negative: 4 },
  { time: '11:10', positive: 62, neutral: 32, negative: 6 },
  { time: '11:15', positive: 70, neutral: 25, negative: 5 },
  { time: '11:20', positive: 72, neutral: 23, negative: 5 },
  { time: '11:25', positive: 68, neutral: 26, negative: 6 },
  { time: '11:30', positive: 75, neutral: 20, negative: 5 },
  { time: '11:35', positive: 80, neutral: 16, negative: 4 },
  { time: '11:40', positive: 78, neutral: 18, negative: 4 },
  { time: '11:45', positive: 82, neutral: 15, negative: 3 },
  { time: '11:50', positive: 85, neutral: 12, negative: 3 },
  { time: '11:55', positive: 83, neutral: 14, negative: 3 },
  { time: '12:00', positive: 85, neutral: 12, negative: 3 },
];

// Sample data for new followers
const followerData = [
  { time: '11:00', followers: 25 },
  { time: '11:05', followers: 32 },
  { time: '11:10', followers: 28 },
  { time: '11:15', followers: 45 },
  { time: '11:20', followers: 51 },
  { time: '11:25', followers: 48 },
  { time: '11:30', followers: 62 },
  { time: '11:35', followers: 70 },
  { time: '11:40', followers: 65 },
  { time: '11:45', followers: 75 },
  { time: '11:50', followers: 82 },
  { time: '11:55', followers: 78 },
  { time: '12:00', followers: 85 },
];

const realtimeMetrics = [
  {
    id: 'viewers',
    label: 'Live Viewers',
    value: 15842,
    change: '+12.5%',
    isPositive: true,
    icon: <Eye className="h-5 w-5 text-blue-500" />,
    color: 'blue',
  },
  {
    id: 'likes',
    label: 'Likes',
    value: 3241,
    change: '+8.7%',
    isPositive: true,
    icon: <Heart className="h-5 w-5 text-pink-500" />,
    color: 'pink',
  },
  {
    id: 'comments',
    label: 'Comments',
    value: 432,
    change: '+5.2%',
    isPositive: true,
    icon: <MessageCircle className="h-5 w-5 text-purple-500" />,
    color: 'purple',
  },
  {
    id: 'shares',
    label: 'Shares',
    value: 187,
    change: '+15.3%',
    isPositive: true,
    icon: <Share2 className="h-5 w-5 text-green-500" />,
    color: 'green',
  },
  {
    id: 'followers',
    label: 'New Followers',
    value: 521,
    change: '+22.8%',
    isPositive: true,
    icon: <Users className="h-5 w-5 text-tiktok-pink" />,
    color: 'tiktok-pink',
  },
  {
    id: 'sentiment',
    label: 'Positive Sentiment',
    value: '85%',
    change: '+4.3%',
    isPositive: true,
    icon: <Smile className="h-5 w-5 text-tiktok-cyan" />,
    color: 'tiktok-cyan',
  },
];

export function RealTimeInsights() {
  const [realtimeData, setRealtimeData] = useState(generateRealtimeData());
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setRealtimeData(prevData => {
        const newData = [...prevData.slice(1)];

        const lastTime = new Date();
        const timeStr = lastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const lastViewers = prevData[prevData.length - 1].viewers;
        const viewers = Math.max(0, lastViewers + Math.floor(Math.random() * 1000 - 300));

        const likes = Math.floor(viewers * (0.15 + Math.random() * 0.1));
        const comments = Math.floor(viewers * (0.02 + Math.random() * 0.01));
        const shares = Math.floor(viewers * (0.01 + Math.random() * 0.005));

        newData.push({
          time: timeStr,
          viewers,
          likes,
          comments,
          shares,
        });

        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <EnhancedCard className="w-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Real-Time Stream Insights
              {isLive && (
                <EnhancedBadge type="pulse" className="ml-2 bg-red-500">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    LIVE
                  </div>
                </EnhancedBadge>
              )}
            </CardTitle>
            <CardDescription>
              Monitor performance and audience engagement in real-time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="viewers" className="space-y-4">
          <TabsList className="tabs-enhanced">
            <TabsTrigger value="viewers" className="tab-trigger-enhanced flex gap-2 items-center">
              <Eye className="h-4 w-4" />
              <span>Viewers</span>
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="tab-trigger-enhanced flex gap-2 items-center"
            >
              <Heart className="h-4 w-4" />
              <span>Engagement</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="tab-trigger-enhanced flex gap-2 items-center">
              <Smile className="h-4 w-4" />
              <span>Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="followers" className="tab-trigger-enhanced flex gap-2 items-center">
              <Users className="h-4 w-4" />
              <span>Followers</span>
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {realtimeMetrics.map(metric => (
              <div
                key={metric.id}
                className="flex flex-col justify-between p-4 bg-card rounded-lg border"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-full bg-card shadow-sm border">{metric.icon}</div>
                  <div
                    className={`text-xs font-medium flex items-center ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}
                  >
                    <TrendingUp className={`h-3 w-3 mr-1 ${!metric.isPositive && 'rotate-180'}`} />
                    {metric.change}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <div className="text-2xl font-bold mt-1">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          <TabsContent value="viewers" className="space-y-4">
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realtimeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => formatNumber(value)}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="viewers"
                    name="Viewers"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorViewers)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Peak Viewers
                </h4>
                <div className="text-2xl font-bold">17,842</div>
                <p className="text-xs text-muted-foreground mt-1">
                  11:42 AM • During dance segment
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Viewer Retention
                </h4>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average viewers stayed for 14 minutes
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={realtimeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    name="Likes"
                    stroke="#ff4d69"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    name="Comments"
                    stroke="#7c5dfa"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="shares"
                    name="Shares"
                    stroke="#00c2b8"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  Engagement Rate
                </h4>
                <div className="text-2xl font-bold">6.2%</div>
                <p className="text-xs text-muted-foreground mt-1">Above account average (5.1%)</p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-purple-500" />
                  Top Comment
                </h4>
                <div className="text-sm font-medium">"This is amazing content! 🔥"</div>
                <p className="text-xs text-muted-foreground mt-1">642 likes • 32 replies</p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-green-500" />
                  Share Conversion
                </h4>
                <div className="text-2xl font-bold">1.2%</div>
                <p className="text-xs text-muted-foreground mt-1">Industry average is 0.8%</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4">
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sentimentData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  stackOffset="expand"
                >
                  <defs>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    name="Positive"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#colorPositive)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    name="Neutral"
                    stackId="1"
                    stroke="#6b7280"
                    fill="url(#colorNeutral)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    name="Negative"
                    stackId="1"
                    stroke="#ef4444"
                    fill="url(#colorNegative)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Smile className="h-4 w-4 text-green-500" />
                  Positive Comments
                </h4>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground mt-1">Up 4.3% from last stream</p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Meh className="h-4 w-4 text-gray-500" />
                  Neutral Comments
                </h4>
                <div className="text-2xl font-bold">12%</div>
                <p className="text-xs text-muted-foreground mt-1">Down 2.1% from last stream</p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Frown className="h-4 w-4 text-red-500" />
                  Negative Comments
                </h4>
                <div className="text-2xl font-bold">3%</div>
                <p className="text-xs text-muted-foreground mt-1">Down 2.2% from last stream</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="followers" className="space-y-4">
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={followerData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--tiktok-pink))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--tiktok-pink))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="followers"
                    name="New Followers"
                    stroke="hsl(var(--tiktok-pink))"
                    fillOpacity={1}
                    fill="url(#colorFollowers)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-tiktok-pink" />
                  Total Followers Gained
                </h4>
                <div className="text-2xl font-bold">521</div>
                <p className="text-xs text-muted-foreground mt-1">
                  22.8% increase from last stream
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Conversion Rate
                </h4>
                <div className="text-2xl font-bold">3.3%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3.3% of viewers became followers
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </EnhancedCard>
  );
}
