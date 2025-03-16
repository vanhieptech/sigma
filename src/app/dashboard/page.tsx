import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import TrendingContentPanel from '@/components/analytics/trending-content-panel';
import { DashboardLayout } from '@/components/dashboard-layout';
import LiveStreamPanel from '@/components/live-stream/live-stream-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  BarChart2,
  Calendar,
  LayoutPanelTop,
  MessageSquare,
  TrendingUp,
  Video,
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TikTok Stream Dashboard',
  description: 'Manage your TikTok live streams, analytics, and content',
};

export default function DashboardPage() {
  return (
    <DashboardLayout
      heading={<h2 className="text-3xl font-bold tracking-tight">TikTok Management Dashboard</h2>}
    >
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 opacity-70" />
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutPanelTop className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="stream" className="flex items-center gap-2">
                <Video className="h-4 w-4" /> Live Stream
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">54.2K</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6.2%</div>
                    <p className="text-xs text-muted-foreground">+0.4% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Video Views</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2M</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Live Viewers</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2K</div>
                    <p className="text-xs text-muted-foreground">+10% from average</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Quick overview of your TikTok activity in the last 7 days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[372px] flex items-center justify-center">
                      <div className="text-center">
                        <h4 className="text-lg font-medium">Welcome to your TikTok Dashboard!</h4>
                        <p className="text-muted-foreground mt-2">
                          Use the tabs above to explore your TikTok management tools.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-full lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Streams</CardTitle>
                    <CardDescription>Your scheduled live streams for this week.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">TikTok Q&A Session</p>
                          <p className="text-sm text-muted-foreground">
                            Tomorrow at
                            <time dateTime="2023-09-01T13:00:00"> 1:00PM</time>
                          </p>
                        </div>
                        <div className="ml-auto font-medium">15 min</div>
                      </div>
                      <div className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Dance Challenge</p>
                          <p className="text-sm text-muted-foreground">
                            Thursday at
                            <time dateTime="2023-09-01T13:00:00"> 6:30PM</time>
                          </p>
                        </div>
                        <div className="ml-auto font-medium">45 min</div>
                      </div>
                      <div className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Collab with @dancerTikTok
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Friday at
                            <time dateTime="2023-09-01T13:00:00"> 8:00PM</time>
                          </p>
                        </div>
                        <div className="ml-auto font-medium">60 min</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stream" className="space-y-4">
              <LiveStreamPanel />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <TrendingContentPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
