'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const engagementData = [
  { date: 'Mar 1', views: 1200, likes: 450, comments: 48, shares: 28 },
  { date: 'Mar 2', views: 1800, likes: 590, comments: 76, shares: 42 },
  { date: 'Mar 3', views: 1400, likes: 480, comments: 64, shares: 36 },
  { date: 'Mar 4', views: 2000, likes: 700, comments: 98, shares: 55 },
  { date: 'Mar 5', views: 2400, likes: 840, comments: 110, shares: 70 },
  { date: 'Mar 6', views: 1900, likes: 620, comments: 84, shares: 48 },
  { date: 'Mar 7', views: 2200, likes: 780, comments: 92, shares: 62 },
];

const engagementRatioData = [
  { name: 'Likes', value: 24, color: '#ec4899' },
  { name: 'Comments', value: 8, color: '#8b5cf6' },
  { name: 'Shares', value: 12, color: '#06b6d4' },
  { name: 'Saves', value: 16, color: '#10b981' },
  { name: 'Follows', value: 5, color: '#f59e0b' },
];

const livestreamEngagementData = [
  { minute: '0:00', viewers: 120, comments: 10, gifts: 0 },
  { minute: '5:00', viewers: 245, comments: 28, gifts: 2 },
  { minute: '10:00', viewers: 350, comments: 42, gifts: 5 },
  { minute: '15:00', viewers: 410, comments: 56, gifts: 8 },
  { minute: '20:00', viewers: 380, comments: 48, gifts: 7 },
  { minute: '25:00', viewers: 420, comments: 62, gifts: 12 },
  { minute: '30:00', viewers: 390, comments: 54, gifts: 9 },
];

export function EngagementMetrics() {
  const [timeRange, setTimeRange] = useState('7days');

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
        <CardDescription>Real-time viewer engagement analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-3 h-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ratio">Engagement Ratio</TabsTrigger>
            <TabsTrigger value="livestream">Livestream</TabsTrigger>
          </TabsList>

          <div className="flex justify-end space-x-2">
            <TabsList className="h-8">
              <TabsTrigger
                value="7days"
                className="text-xs px-2 h-8"
                onClick={() => setTimeRange('7days')}
                data-state={timeRange === '7days' ? 'active' : ''}
              >
                7D
              </TabsTrigger>
              <TabsTrigger
                value="30days"
                className="text-xs px-2 h-8"
                onClick={() => setTimeRange('30days')}
                data-state={timeRange === '30days' ? 'active' : ''}
              >
                30D
              </TabsTrigger>
              <TabsTrigger
                value="90days"
                className="text-xs px-2 h-8"
                onClick={() => setTimeRange('90days')}
                data-state={timeRange === '90days' ? 'active' : ''}
              >
                90D
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" name="Views" />
                  <Bar dataKey="likes" fill="#ec4899" name="Likes" />
                  <Bar dataKey="comments" fill="#8b5cf6" name="Comments" />
                  <Bar dataKey="shares" fill="#06b6d4" name="Shares" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total Views</span>
                <span className="text-2xl font-bold">12.9K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Avg. Watch Time</span>
                <span className="text-2xl font-bold">2:48</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Completion Rate</span>
                <span className="text-2xl font-bold">64%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Engagement Rate</span>
                <span className="text-2xl font-bold">5.2%</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ratio">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementRatioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {engagementRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Breakdown of engagement actions from your audience
              </p>
            </div>
          </TabsContent>

          <TabsContent value="livestream">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={livestreamEngagementData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="minute" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="viewers" stroke="#8884d8" name="Viewers" />
                  <Line type="monotone" dataKey="comments" stroke="#8b5cf6" name="Comments" />
                  <Line type="monotone" dataKey="gifts" stroke="#f59e0b" name="Gifts" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Peak Viewers</span>
                <span className="text-2xl font-bold">420</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total Comments</span>
                <span className="text-2xl font-bold">300</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total Gifts</span>
                <span className="text-2xl font-bold">43</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
