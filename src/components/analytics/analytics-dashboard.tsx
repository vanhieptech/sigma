"use client";

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Calendar, 
  Loader2, 
  RefreshCw, 
  BarChart2, 
  PieChart as PieChartIcon, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  User2,
} from 'lucide-react';

import { useTikTokAnalytics } from '@/hooks/use-tiktok-analytics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Color pallette for charts
const CHART_COLORS = {
  primary: '#FF0050', // TikTok red
  secondary: '#00F2EA', // TikTok teal
  tertiary: '#7856FF', // Purple
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  neutral: '#9E9E9E',
  followerGrowth: '#00C853',
  followerLost: '#FF5252',
  views: '#2196F3',
  likes: '#E91E63',
  comments: '#FF9800',
  shares: '#9C27B0',
};

const GENDER_COLORS = {
  Female: '#FF6B98',
  Male: '#73B8FF',
  Other: '#9E9E9E',
};

// Utility to get color for engagement rate
const getEngagementRateColor = (rate: number) => {
  if (rate < 0.02) return CHART_COLORS.error;
  if (rate < 0.04) return CHART_COLORS.warning;
  return CHART_COLORS.success;
};

// Format percentage 
const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

// Format large numbers
const formatNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function AnalyticsDashboard() {
  const [username, setUsername] = useState<string>('');
  const [submittedUsername, setSubmittedUsername] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('30');
  
  const { analytics, isLoading, error, refreshAnalytics } = useTikTokAnalytics({
    username: submittedUsername,
    daysToAnalyze: parseInt(timeRange)
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedUsername(username);
  };
  
  const handleRefresh = () => {
    refreshAnalytics();
  };
  
  // Calculate total metrics
  const totalFollowers = analytics?.followerGrowth[analytics.followerGrowth.length - 1]?.followers || 0;
  const totalGrowth = analytics?.followerGrowth.reduce((sum, item) => sum + item.growth, 0) || 0;
  const totalLost = analytics?.followerGrowth.reduce((sum, item) => sum + item.lost, 0) || 0;
  const totalViews = analytics?.viewsPerVideo.reduce((sum, item) => sum + item.views, 0) || 0;
  const totalLikes = analytics?.viewsPerVideo.reduce((sum, item) => sum + item.likes, 0) || 0;
  const totalComments = analytics?.viewsPerVideo.reduce((sum, item) => sum + item.comments, 0) || 0;
  const totalShares = analytics?.viewsPerVideo.reduce((sum, item) => sum + item.shares, 0) || 0;
  
  // Calculate averages
  const avgEngagementRate = analytics?.engagementRate.reduce((sum, item) => sum + item.rate, 0) / (analytics?.engagementRate.length || 1);
  const avgLikesPerVideo = totalLikes / (analytics?.viewsPerVideo.length || 1);
  const avgViewsPerVideo = totalViews / (analytics?.viewsPerVideo.length || 1);
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            <span>TikTok Analytics Dashboard</span>
          </div>
          {submittedUsername && !isLoading && (
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-3 w-3 mr-2" />
              Refresh Data
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Analyze your TikTok account performance and track growth metrics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!submittedUsername ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter TikTok username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!username.trim()}>
              Analyze
            </Button>
          </form>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading analytics for @{submittedUsername}...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-red-500 font-medium">Error loading analytics</p>
            <p className="text-muted-foreground mt-1">{error.message}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSubmittedUsername('')}
            >
              Try Another Username
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  @{submittedUsername}
                  <Badge className="ml-2">Pro</Badge>
                </h2>
                <p className="text-muted-foreground">
                  Analytics for the past {timeRange} days
                </p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Total Followers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <Badge variant="outline" className={`flex items-center gap-1 ${totalGrowth > totalLost ? 'text-green-600' : 'text-red-600'}`}>
                      {totalGrowth > totalLost ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(totalGrowth - totalLost).toLocaleString()} net {totalGrowth > totalLost ? 'gain' : 'loss'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Avg. {formatNumber(avgViewsPerVideo)} per video
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Engagement Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{formatPercent(avgEngagementRate)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {avgEngagementRate >= 0.05 ? 'Above industry average' : 'Below industry average'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Total Likes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Avg. {formatNumber(avgLikesPerVideo)} per video
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="growth" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="growth">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Growth
                </TabsTrigger>
                <TabsTrigger value="content">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="engagement">
                  <Activity className="h-4 w-4 mr-2" />
                  Engagement
                </TabsTrigger>
                <TabsTrigger value="audience">
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Audience
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="growth">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Follower Growth</h3>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={analytics?.followerGrowth}
                            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                          >
                            <defs>
                              <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.6} />
                                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fontSize: 12 }}
                              tickFormatter={formatDate}
                              tickMargin={10}
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              tickFormatter={formatNumber}
                            />
                            <Tooltip 
                              formatter={(value: number) => [value.toLocaleString(), 'Followers']}
                              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="followers" 
                              stroke={CHART_COLORS.primary} 
                              strokeWidth={2}
                              fillOpacity={1} 
                              fill="url(#colorFollowers)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm">Daily Follower Growth</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={analytics?.followerGrowth}
                              margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 10 }}
                                tickFormatter={formatDate}
                                tickMargin={10}
                              />
                              <YAxis 
                                tick={{ fontSize: 10 }}
                              />
                              <Tooltip 
                                formatter={(value: number) => [value.toLocaleString(), 'New Followers']}
                                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                              />
                              <Legend wrapperStyle={{ fontSize: '10px' }} />
                              <Bar 
                                dataKey="growth" 
                                name="New Followers" 
                                fill={CHART_COLORS.followerGrowth}
                              />
                              <Bar 
                                dataKey="lost" 
                                name="Lost Followers" 
                                fill={CHART_COLORS.followerLost}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm">Engagement Rate Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={analytics?.engagementRate}
                              margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 10 }}
                                tickFormatter={formatDate}
                                tickMargin={10}
                              />
                              <YAxis 
                                tick={{ fontSize: 10 }}
                                tickFormatter={formatPercent}
                              />
                              <Tooltip 
                                formatter={(value: number) => [formatPercent(value), 'Engagement Rate']}
                                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="rate" 
                                name="Engagement Rate"
                                stroke={CHART_COLORS.tertiary}
                                strokeWidth={2} 
                                dot={{ r: 2 }}
                                activeDot={{ r: 5 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Content Performance</h3>
                  
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm">Views per Video</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analytics?.viewsPerVideo.slice().reverse()}
                            margin={{ top: 10, right: 30, left: 10, bottom: 50 }}
                            barSize={28}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              dataKey="title" 
                              tick={{ fontSize: 10 }}
                              angle={-45}
                              textAnchor="end"
                              tickMargin={20}
                            />
                            <YAxis 
                              tick={{ fontSize: 10 }}
                              tickFormatter={formatNumber}
                            />
                            <Tooltip 
                              formatter={(value: number) => [value.toLocaleString(), 'Views']}
                            />
                            <Bar 
                              dataKey="views" 
                              name="Views" 
                              fill={CHART_COLORS.views}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <h3 className="text-lg font-medium mt-4">Top Performing Videos</h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2 pr-4">
                      {analytics?.topPerformingVideos.map((video) => (
                        <Card key={video.videoId} className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{video.title}</h4>
                              <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {video.views.toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                  <Heart className="h-3 w-3 mr-1" />
                                  {video.likes.toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {video.comments.toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                  <Share2 className="h-3 w-3 mr-1" />
                                  {video.shares.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Badge className={`${video.engagementRate >= 0.1 ? 'bg-green-500' : video.engagementRate >= 0.05 ? 'bg-amber-500' : 'bg-red-500'}`}>
                              {formatPercent(video.engagementRate)}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="engagement">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Engagement Metrics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm">Engagement Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Likes', value: totalLikes },
                                  { name: 'Comments', value: totalComments },
                                  { name: 'Shares', value: totalShares }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell fill={CHART_COLORS.likes} />
                                <Cell fill={CHART_COLORS.comments} />
                                <Cell fill={CHART_COLORS.shares} />
                              </Pie>
                              <Tooltip 
                                formatter={(value: number) => [value.toLocaleString(), '']}
                              />
                              <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ fontSize: '12px' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm">Engagement by Video</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={analytics?.viewsPerVideo.slice(0, 5)}
                              layout="vertical"
                              margin={{ top: 10, right: 60, left: 90, bottom: 30 }}
                              barSize={14}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                              <XAxis 
                                type="number"
                                tick={{ fontSize: 10 }}
                                tickFormatter={formatNumber}
                              />
                              <YAxis 
                                type="category"
                                dataKey="title" 
                                tick={{ fontSize: 10 }}
                                width={80}
                              />
                              <Tooltip 
                                formatter={(value: number) => [value.toLocaleString(), '']}
                              />
                              <Legend wrapperStyle={{ fontSize: '10px' }} />
                              <Bar 
                                dataKey="likes" 
                                name="Likes" 
                                fill={CHART_COLORS.likes}
                                stackId="a"
                              />
                              <Bar 
                                dataKey="comments" 
                                name="Comments" 
                                fill={CHART_COLORS.comments}
                                stackId="a"
                              />
                              <Bar 
                                dataKey="shares" 
                                name="Shares" 
                                fill={CHART_COLORS.shares}
                                stackId="a"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="audience">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Audience Demographics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm flex items-center">
                          <User2 className="h-4 w-4 mr-2" />
                          Age Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={analytics?.audienceDemo.age}
                              layout="vertical"
                              margin={{ top: 10, right: 10, left: 40, bottom: 30 }}
                              barSize={30}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                              <XAxis 
                                type="number"
                                tick={{ fontSize: 10 }}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                              />
                              <YAxis 
                                type="category"
                                dataKey="group" 
                                tick={{ fontSize: 10 }}
                                width={40}
                              />
                              <Tooltip 
                                formatter={(value: number) => [`${value}%`, 'Percentage']}
                              />
                              <Bar 
                                dataKey="percentage" 
                                name="Percentage" 
                                fill={CHART_COLORS.tertiary}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm flex items-center">
                          <User2 className="h-4 w-4 mr-2" />
                          Gender Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics?.audienceDemo.gender}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                dataKey="percentage"
                                nameKey="group"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {analytics?.audienceDemo.gender.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={GENDER_COLORS[entry.group as keyof typeof GENDER_COLORS] || CHART_COLORS.neutral} 
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number) => [`${value}%`, 'Percentage']}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          Top Countries
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={analytics?.audienceDemo.topCountries}
                              layout="vertical"
                              margin={{ top: 10, right: 10, left: 100, bottom: 30 }}
                              barSize={20}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                              <XAxis 
                                type="number"
                                tick={{ fontSize: 10 }}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                              />
                              <YAxis 
                                type="category"
                                dataKey="country" 
                                tick={{ fontSize: 10 }}
                                width={90}
                              />
                              <Tooltip 
                                formatter={(value: number) => [`${value}%`, 'Percentage']}
                              />
                              <Bar 
                                dataKey="percentage" 
                                name="Percentage" 
                                fill={CHART_COLORS.secondary}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      {submittedUsername && !isLoading && !error && (
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <div>Account: <span className="font-medium">@{submittedUsername}</span></div>
          <div>Last updated: {new Date().toLocaleString()}</div>
        </CardFooter>
      )}
    </Card>
  );
} 