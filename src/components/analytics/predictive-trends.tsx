'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/enhanced-tabs';
import { ChartTooltip, formatNumber } from '@/components/ui/chart-tooltip';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { ArrowUpRight, Hash, VideoIcon, User, TrendingUp, Tag, MessageSquare } from 'lucide-react';

// Sample data for trending predictions
const trendingHashtags = [
  { name: '#dancechallenge', value: 89, growth: 23 },
  { name: '#fyp', value: 78, growth: 5 },
  { name: '#viral', value: 72, growth: 12 },
  { name: '#trending', value: 65, growth: 8 },
  { name: '#comedy', value: 61, growth: 15 },
  { name: '#dance', value: 58, growth: 4 },
  { name: '#music', value: 52, growth: 7 },
  { name: '#foryou', value: 48, growth: 9 },
];

const trendingTitles = [
  { name: 'Day in my life as a...', value: 85, growth: 18 },
  { name: 'POV: When you...', value: 79, growth: 12 },
  { name: '10 things I wish I knew before...', value: 76, growth: 21 },
  { name: 'What I eat in a day...', value: 71, growth: 9 },
  { name: 'Trying this viral...', value: 68, growth: 14 },
  { name: 'Hot take: why...', value: 61, growth: 17 },
  { name: 'Rating every...', value: 57, growth: 8 },
  { name: 'The truth about...', value: 52, growth: 11 },
];

const trendingContentTypes = [
  { name: 'Dance', value: 92, growth: 16 },
  { name: 'Comedy Skits', value: 87, growth: 12 },
  { name: 'Tutorials', value: 76, growth: 24 },
  { name: 'Day in Life', value: 73, growth: 18 },
  { name: 'Reviews', value: 68, growth: 9 },
  { name: 'Challenges', value: 65, growth: 7 },
  { name: 'Reactions', value: 59, growth: 11 },
  { name: 'Story Time', value: 53, growth: 15 },
];

const trendingUsernames = [
  { name: 'travel_', value: 88, growth: 19 },
  { name: 'lifestyle_', value: 82, growth: 14 },
  { name: 'official_', value: 76, growth: 7 },
  { name: 'real_', value: 71, growth: 11 },
  { name: 'digital_', value: 67, growth: 22 },
  { name: 'creative_', value: 61, growth: 16 },
  { name: 'viral_', value: 58, growth: 9 },
  { name: 'trending_', value: 54, growth: 13 },
];

// Weekly trend prediction data
const weeklyTrendData = [
  { day: 'Mon', hashtags: 60, content: 55, titles: 45 },
  { day: 'Tue', hashtags: 65, content: 60, titles: 50 },
  { day: 'Wed', hashtags: 75, content: 70, titles: 65 },
  { day: 'Thu', hashtags: 90, content: 85, titles: 75 },
  { day: 'Fri', hashtags: 100, content: 95, titles: 80 },
  { day: 'Sat', hashtags: 95, content: 90, titles: 85 },
  { day: 'Sun', hashtags: 85, content: 80, titles: 70 },
];

export function PredictiveTrends() {
  const [selectedTab, setSelectedTab] = useState('hashtags');

  // Function to get data based on selected tab
  const getTabData = () => {
    switch (selectedTab) {
      case 'hashtags':
        return trendingHashtags;
      case 'titles':
        return trendingTitles;
      case 'content':
        return trendingContentTypes;
      case 'usernames':
        return trendingUsernames;
      default:
        return trendingHashtags;
    }
  };

  // Function to get icon based on selected tab
  const getTabIcon = () => {
    switch (selectedTab) {
      case 'hashtags':
        return <Hash className="h-5 w-5 text-primary" />;
      case 'titles':
        return <MessageSquare className="h-5 w-5 text-primary" />;
      case 'content':
        return <VideoIcon className="h-5 w-5 text-primary" />;
      case 'usernames':
        return <User className="h-5 w-5 text-primary" />;
      default:
        return <Hash className="h-5 w-5 text-primary" />;
    }
  };

  // Function to get title based on selected tab
  const getTabTitle = () => {
    switch (selectedTab) {
      case 'hashtags':
        return 'Trending Hashtags';
      case 'titles':
        return 'Trending Video Titles';
      case 'content':
        return 'Trending Content Types';
      case 'usernames':
        return 'Trending Username Patterns';
      default:
        return 'Trending Hashtags';
    }
  };

  return (
    <EnhancedCard className="w-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Predictive Trends Analysis
              <EnhancedBadge type="gradient" className="ml-2">
                AI Powered
              </EnhancedBadge>
            </CardTitle>
            <CardDescription>Predict trending elements for your next viral content</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="hashtags" onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="tabs-enhanced">
            <TabsTrigger value="hashtags" className="tab-trigger-enhanced flex gap-2 items-center">
              <Hash className="h-4 w-4" />
              <span>Hashtags</span>
            </TabsTrigger>
            <TabsTrigger value="titles" className="tab-trigger-enhanced flex gap-2 items-center">
              <MessageSquare className="h-4 w-4" />
              <span>Titles</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="tab-trigger-enhanced flex gap-2 items-center">
              <VideoIcon className="h-4 w-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="usernames" className="tab-trigger-enhanced flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span>Usernames</span>
            </TabsTrigger>
          </TabsList>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    {getTabIcon()}
                    <span>Predicted {getTabTitle()}</span>
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    Next 7 days
                  </Badge>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {getTabData().map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <span className="font-medium text-sm text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Trend score: {item.value}/100
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center text-xs text-green-500">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>+{item.growth}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Weekly Trend Forecast</h3>
                  <Badge variant="outline" className="text-xs">
                    7-day prediction
                  </Badge>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyTrendData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                      <XAxis
                        dataKey="day"
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
                        tickFormatter={value => `${value}`}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="hashtags"
                        name="Hashtags"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="content"
                        name="Content"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="titles"
                        name="Titles"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-muted/20">
              <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
              <p className="text-sm text-muted-foreground">
                Based on current trending patterns, we recommend incorporating{' '}
                {selectedTab === 'hashtags'
                  ? 'hashtags like #dancechallenge and #viral'
                  : selectedTab === 'titles'
                    ? 'titles starting with "Day in my life" or "POV:"'
                    : selectedTab === 'content'
                      ? 'dance and tutorial content'
                      : 'username patterns with "travel_" or "lifestyle_"'}{' '}
                in your upcoming content for maximum reach and engagement.
              </p>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </EnhancedCard>
  );
}
