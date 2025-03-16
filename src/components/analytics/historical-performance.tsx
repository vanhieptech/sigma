'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useState } from 'react';

// Sample data for historical performance
const monthlyData = [
  { month: 'Jan', views: 380000, followers: 12500, engagement: 4.2, posts: 28 },
  { month: 'Feb', views: 420000, followers: 14800, engagement: 4.5, posts: 32 },
  { month: 'Mar', views: 520000, followers: 18200, engagement: 4.8, posts: 35 },
  { month: 'Apr', views: 680000, followers: 22400, engagement: 5.2, posts: 38 },
  { month: 'May', views: 750000, followers: 28500, engagement: 5.6, posts: 42 },
  { month: 'Jun', views: 820000, followers: 32000, engagement: 5.8, posts: 40 },
];

const quarterlyData = [
  { quarter: 'Q1', views: 1320000, followers: 18200, engagement: 4.5, posts: 95 },
  { quarter: 'Q2', views: 2250000, followers: 32000, engagement: 5.5, posts: 120 },
  { quarter: 'Q3', views: 3100000, followers: 45000, engagement: 6.2, posts: 135 },
  { quarter: 'Q4', views: 3800000, followers: 58000, engagement: 6.8, posts: 142 },
];

const yearlyData = [
  { year: '2020', views: 4200000, followers: 28000, engagement: 3.8, posts: 320 },
  { year: '2021', views: 8500000, followers: 58000, engagement: 4.6, posts: 410 },
  { year: '2022', views: 12800000, followers: 120000, engagement: 5.5, posts: 480 },
  { year: '2023', views: 18500000, followers: 220000, engagement: 6.2, posts: 520 },
];

export function HistoricalPerformance() {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [metric, setMetric] = useState('views');

  // Select the appropriate data based on the time frame
  const data =
    timeFrame === 'quarterly' ? quarterlyData : timeFrame === 'yearly' ? yearlyData : monthlyData;

  // Get the appropriate key for the X-axis
  const xAxisKey =
    timeFrame === 'quarterly' ? 'quarter' : timeFrame === 'yearly' ? 'year' : 'month';

  // Format large numbers for display
  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Customize the tooltip to display formatted values
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          {metric === 'views' && (
            <p className="text-sm">
              Views: <span className="font-medium">{formatValue(data.views)}</span>
            </p>
          )}
          {metric === 'followers' && (
            <p className="text-sm">
              Followers: <span className="font-medium">{formatValue(data.followers)}</span>
            </p>
          )}
          {metric === 'engagement' && (
            <p className="text-sm">
              Engagement: <span className="font-medium">{data.engagement}%</span>
            </p>
          )}
          {metric === 'posts' && (
            <p className="text-sm">
              Posts: <span className="font-medium">{data.posts}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Historical Performance</CardTitle>
            <CardDescription>Track your account performance over time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs value={timeFrame} onValueChange={setTimeFrame} className="w-[260px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="engagement">Engagement Rate</SelectItem>
              <SelectItem value="posts">Post Count</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {metric === 'engagement' ? (
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis domain={[0, 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis tickFormatter={value => formatValue(value)} domain={[0, 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey={metric} fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Views</span>
            <span className="text-xl font-bold">
              {formatValue(data.reduce((sum, item) => sum + item.views, 0))}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Follower Growth</span>
            <span className="text-xl font-bold">
              {formatValue(data[data.length - 1].followers - data[0].followers)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Avg. Engagement</span>
            <span className="text-xl font-bold">
              {(data.reduce((sum, item) => sum + item.engagement, 0) / data.length).toFixed(1)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Posts</span>
            <span className="text-xl font-bold">
              {data.reduce((sum, item) => sum + item.posts, 0)}
            </span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center mt-2">
          <p>Data shown reflects your account performance over the selected time period</p>
        </div>
      </CardContent>
    </Card>
  );
}
