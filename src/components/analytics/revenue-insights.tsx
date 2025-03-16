'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/enhanced-tabs';
import { ChartTooltip, formatNumber } from '@/components/ui/chart-tooltip';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import {
  DollarSign,
  Gift,
  TrendingUp,
  Calendar,
  BarChart2,
  PieChart as PieChartIcon,
} from 'lucide-react';

// Sample data for revenue analytics
const revenueByDay = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 145 },
  { name: 'Wed', value: 178 },
  { name: 'Thu', value: 210 },
  { name: 'Fri', value: 312 },
  { name: 'Sat', value: 348 },
  { name: 'Sun', value: 280 },
];

const revenueBySource = [
  { name: 'Gift coins', value: 65, color: '#FE2C55' },
  { name: 'Diamonds', value: 25, color: '#25F4EE' },
  { name: 'Live gifts', value: 10, color: '#7c5dfa' },
];

const topGifts = [
  { name: 'Universe', value: 145, count: 5 },
  { name: 'Lion', value: 132, count: 12 },
  { name: 'Galaxy', value: 128, count: 16 },
  { name: 'Rose', value: 95, count: 95 },
  { name: 'Heart', value: 82, count: 164 },
];

const topSupporters = [
  { name: 'user_1234', value: 250, gifts: 12 },
  { name: 'superfan_2022', value: 180, gifts: 8 },
  { name: 'tikfan_555', value: 145, gifts: 15 },
  { name: 'supporter99', value: 110, gifts: 22 },
  { name: 'fan_forever', value: 95, gifts: 19 },
];

export function RevenueInsights() {
  const totalRevenue = revenueByDay.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalRevenue);

  return (
    <EnhancedCard className="w-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Revenue Analytics
              <EnhancedBadge type="gradient" className="ml-2">
                Premium
              </EnhancedBadge>
            </CardTitle>
            <CardDescription>Track gifts, diamonds, and monetization performance</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="tabs-enhanced">
            <TabsTrigger value="overview" className="tab-trigger-enhanced flex gap-2 items-center">
              <BarChart2 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="tab-trigger-enhanced flex gap-2 items-center">
              <Gift className="h-4 w-4" />
              <span>Gifts</span>
            </TabsTrigger>
            <TabsTrigger
              value="supporters"
              className="tab-trigger-enhanced flex gap-2 items-center"
            >
              <PieChartIcon className="h-4 w-4" />
              <span>Supporters</span>
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2 p-4 rounded-lg border bg-card">
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                Total Revenue
              </div>
              <div className="text-2xl font-bold">{formattedTotal}</div>
              <div className="flex items-center text-xs text-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+18.5% from last week</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 p-4 rounded-lg border bg-card">
              <div className="flex items-center text-sm text-muted-foreground">
                <Gift className="h-4 w-4 mr-1 text-tiktok-pink" />
                Total Gifts
              </div>
              <div className="text-2xl font-bold">347</div>
              <div className="flex items-center text-xs text-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+24.2% from last week</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 p-4 rounded-lg border bg-card">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1 text-tiktok-cyan" />
                Most Profitable Day
              </div>
              <div className="text-2xl font-bold">Saturday</div>
              <div className="text-xs text-muted-foreground">$348 revenue • 92 gifts received</div>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByDay} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={value => `$${value}`}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-md p-3">
                            <div className="font-medium text-sm mb-1">{data.name}</div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                              <span className="text-xs">Revenue: ${data.value}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="text-lg font-medium mb-4">Revenue by Source</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBySource}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-md p-3">
                                <div className="flex items-center gap-1.5">
                                  <div
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: data.color }}
                                  />
                                  <span className="text-xs font-medium">{data.name}</span>
                                </div>
                                <div className="text-sm font-bold mt-1">
                                  ${data.value}% of total revenue
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h3 className="text-lg font-medium mb-4">Revenue Growth</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2">
                    <div className="text-sm">This Week</div>
                    <div className="text-sm font-medium">${totalRevenue}</div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/20 rounded-md">
                    <div className="text-sm">Last Week</div>
                    <div className="text-sm font-medium">${Math.round(totalRevenue * 0.85)}</div>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <div className="text-sm">This Month</div>
                    <div className="text-sm font-medium">${Math.round(totalRevenue * 4.2)}</div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/20 rounded-md">
                    <div className="text-sm">Last Month</div>
                    <div className="text-sm font-medium">${Math.round(totalRevenue * 3.4)}</div>
                  </div>
                  <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/20">
                    <h4 className="text-sm font-medium mb-1 text-primary">Growth Projection</h4>
                    <p className="text-xs text-muted-foreground">
                      Based on current trends, you're on track to increase revenue by 22% next
                      month.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gifts" className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Top Gifts Received</h3>
              <div className="space-y-2">
                {topGifts.map((gift, index) => (
                  <motion.div
                    key={gift.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Gift className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{gift.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {gift.count} {gift.count === 1 ? 'time' : 'times'}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold">${gift.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="text-sm font-medium mb-2">Gift Breakdown</h3>
                <div className="space-y-2 mt-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Big Gifts (100+ coins)</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-tiktok-pink w-[23%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Medium Gifts (20-99 coins)</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-tiktok-pink w-[42%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Small Gifts (1-19 coins)</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-tiktok-pink w-[35%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h3 className="text-sm font-medium mb-2">Gift Timing</h3>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xs">Peak Gift Time</div>
                    <div className="text-xs font-medium">8:00 PM - 9:00 PM</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">Gifts During First 5 Minutes</div>
                    <div className="text-xs font-medium">12% of total</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">Average Time Between Gifts</div>
                    <div className="text-xs font-medium">4.2 minutes</div>
                  </div>
                  <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/20">
                    <h4 className="text-xs font-medium mb-1 text-primary">Gift Strategy Tip</h4>
                    <p className="text-xs text-muted-foreground">
                      Streams on Friday and Saturday between 7-9 PM receive 32% more gifts. Consider
                      scheduling your important content for these times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="supporters" className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Top Supporters</h3>
              <div className="space-y-2">
                {topSupporters.map((supporter, index) => (
                  <motion.div
                    key={supporter.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-semibold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">@{supporter.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {supporter.gifts} gifts contributed
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold">${supporter.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="text-sm font-medium mb-2">Supporter Analysis</h3>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xs">Top 5 Supporters</div>
                    <div className="text-xs font-medium">42% of revenue</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">New Supporters This Week</div>
                    <div className="text-xs font-medium">18 users</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">Returning Supporters</div>
                    <div className="text-xs font-medium">73% of total</div>
                  </div>
                  <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/20">
                    <h4 className="text-xs font-medium mb-1 text-primary">Supporter Insight</h4>
                    <p className="text-xs text-muted-foreground">
                      Users who watch for 15+ minutes are 4x more likely to send gifts. Focus on
                      maintaining engagement throughout your streams.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h3 className="text-sm font-medium mb-2">Supporter Engagement</h3>
                <div className="space-y-2 mt-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Comment Rate</span>
                      <span className="font-medium">84%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-tiktok-cyan w-[84%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Return Rate</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-tiktok-cyan w-[76%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Share Rate</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-tiktok-cyan w-[32%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </EnhancedCard>
  );
}
