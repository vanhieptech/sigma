'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoAnalytics, SentimentAnalysis, AudienceTimingMetrics } from '@/types/analytics';
import { Badge } from '@/components/ui/badge';
import {
  ChartBarIcon,
  ClockIcon,
  FaceSmileIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';

// Mock data for analytics
const mockVideoAnalytics: VideoAnalytics = {
  id: '1',
  videoId: 'vid-12345',
  title: 'Summer Outfit Ideas 2023',
  thumbnailUrl: 'https://placekitten.com/300/200',
  duration: 45,
  publishedAt: Date.now() - 86400000 * 3, // 3 days ago
  views: 125000,
  likes: 15000,
  comments: 2300,
  shares: 4500,
  watchTimeAvg: 32,
  completionRate: 72,
  engagementRate: 18.5,
  peakViewerCount: 2800,
  audienceRetention: [
    { timestamp: 0, retentionRate: 100 },
    { timestamp: 10, retentionRate: 95 },
    { timestamp: 20, retentionRate: 85 },
    { timestamp: 30, retentionRate: 80 },
    { timestamp: 40, retentionRate: 65 },
  ],
  demographicBreakdown: {
    ageGroups: {
      '13-17': 15,
      '18-24': 45,
      '25-34': 25,
      '35-44': 10,
      '45+': 5,
    },
    genders: {
      female: 65,
      male: 32,
      other: 3,
    },
    topCountries: {
      'United States': 45,
      'United Kingdom': 12,
      Canada: 8,
      Australia: 7,
      Other: 28,
    },
    topCities: {
      'New York': 12,
      'Los Angeles': 8,
      London: 7,
      Toronto: 5,
      Sydney: 4,
    },
  },
};

const mockSentimentAnalysis: SentimentAnalysis = {
  positive: 65,
  neutral: 30,
  negative: 5,
  wordCloud: {
    love: 120,
    amazing: 95,
    cute: 85,
    style: 75,
    beautiful: 70,
    outfit: 65,
    wow: 60,
    obsessed: 55,
    stunning: 50,
    perfect: 45,
  },
  topPositiveKeywords: ['love', 'amazing', 'beautiful', 'stunning'],
  topNegativeKeywords: ['boring', 'basic', 'overpriced'],
  overallSentiment: 'positive',
};

const mockAudienceTimingMetrics: AudienceTimingMetrics = {
  bestPostingTimes: [
    { weekday: 'Sunday', hour: 20, engagementRate: 8.5 },
    { weekday: 'Wednesday', hour: 19, engagementRate: 7.8 },
    { weekday: 'Friday', hour: 21, engagementRate: 7.5 },
  ],
  audienceActiveHours: [
    { hour: 8, activity: 25 },
    { hour: 12, activity: 40 },
    { hour: 16, activity: 60 },
    { hour: 19, activity: 85 },
    { hour: 21, activity: 95 },
    { hour: 23, activity: 70 },
  ],
  audienceActiveWeekdays: [
    { weekday: 'Monday', activity: 65 },
    { weekday: 'Tuesday', activity: 70 },
    { weekday: 'Wednesday', activity: 85 },
    { weekday: 'Thursday', activity: 80 },
    { weekday: 'Friday', activity: 90 },
    { weekday: 'Saturday', activity: 100 },
    { weekday: 'Sunday', activity: 95 },
  ],
  timezone: [
    { name: 'EST', percentage: 45 },
    { name: 'PST', percentage: 25 },
    { name: 'GMT', percentage: 15 },
    { name: 'Other', percentage: 15 },
  ],
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

const MetricCard = ({ title, value, change, icon }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>

        {change !== undefined && (
          <div
            className={`text-xs mt-2 flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            <span>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground ml-1">vs. previous</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface EngagementBarProps {
  engagement: number;
  label: string;
  color: string;
}

const EngagementBar = ({ engagement, label, color }: EngagementBarProps) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{engagement}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${engagement}%` }}></div>
      </div>
    </div>
  );
};

interface AiAnalyticsPanelProps {
  videoId?: string;
}

export function AiAnalyticsPanel({ videoId }: AiAnalyticsPanelProps) {
  const [videoAnalytics] = useState<VideoAnalytics>(mockVideoAnalytics);
  const [sentimentAnalysis] = useState<SentimentAnalysis>(mockSentimentAnalysis);
  const [audienceTimingMetrics] = useState<AudienceTimingMetrics>(mockAudienceTimingMetrics);

  return (
    <div className="w-full bg-card rounded-lg border shadow-sm">
      <Tabs defaultValue="performance" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance" className="flex items-center gap-1">
              <ChartBarIcon className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-1">
              <UserGroupIcon className="h-4 w-4" />
              <span>Audience</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-1">
              <FaceSmileIcon className="h-4 w-4" />
              <span>Sentiment</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="performance" className="p-4 pt-2">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <MetricCard
              title="Views"
              value={Intl.NumberFormat().format(videoAnalytics.views)}
              change={12}
              icon={<PresentationChartLineIcon className="h-5 w-5" />}
            />
            <MetricCard
              title="Likes"
              value={Intl.NumberFormat().format(videoAnalytics.likes)}
              change={8}
            />
            <MetricCard
              title="Comments"
              value={Intl.NumberFormat().format(videoAnalytics.comments)}
              change={15}
            />
            <MetricCard
              title="Shares"
              value={Intl.NumberFormat().format(videoAnalytics.shares)}
              change={20}
            />
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Engagement Metrics</h3>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <Badge variant="outline">{videoAnalytics.completionRate}%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${videoAnalytics.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Average Watch Time</span>
                  <span className="text-sm">
                    {videoAnalytics.watchTimeAvg}s / {videoAnalytics.duration}s
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{
                      width: `${(videoAnalytics.watchTimeAvg! / videoAnalytics.duration!) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Engagement Rate</span>
                  <Badge variant={videoAnalytics.engagementRate > 15 ? 'success' : 'warning'}>
                    {videoAnalytics.engagementRate}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {videoAnalytics.engagementRate > 15
                    ? 'Above average engagement for your niche'
                    : 'Average engagement for your niche'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="p-4 pt-2">
          <h3 className="text-sm font-medium mb-3">Audience Demographics</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Age Groups</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {Object.entries(videoAnalytics.demographicBreakdown!.ageGroups).map(
                  ([age, percentage]) => (
                    <EngagementBar
                      key={age}
                      label={age}
                      engagement={percentage}
                      color="bg-blue-500"
                    />
                  )
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Gender</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {Object.entries(videoAnalytics.demographicBreakdown!.genders).map(
                  ([gender, percentage]) => (
                    <EngagementBar
                      key={gender}
                      label={gender.charAt(0).toUpperCase() + gender.slice(1)}
                      engagement={percentage}
                      color="bg-purple-500"
                    />
                  )
                )}
              </CardContent>
            </Card>
          </div>

          <h3 className="text-sm font-medium mb-3 mt-4">Best Posting Times</h3>
          <Card>
            <CardContent className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {audienceTimingMetrics.bestPostingTimes.map((time, index) => (
                  <div key={index} className="bg-slate-50 p-2 rounded-md text-center">
                    <p className="text-xs text-muted-foreground">{time.weekday}</p>
                    <p className="font-semibold flex items-center justify-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {time.hour}:00
                    </p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {time.engagementRate}% engage
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="p-4 pt-2">
          <h3 className="text-sm font-medium mb-2">Comment Sentiment</h3>
          <div className="mb-4">
            <div className="flex mb-3">
              <div
                className="bg-green-500 h-6 rounded-l"
                style={{ width: `${sentimentAnalysis.positive}%` }}
              ></div>
              <div
                className="bg-gray-300 h-6"
                style={{ width: `${sentimentAnalysis.neutral}%` }}
              ></div>
              <div
                className="bg-red-500 h-6 rounded-r"
                style={{ width: `${sentimentAnalysis.negative}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Positive ({sentimentAnalysis.positive}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                <span>Neutral ({sentimentAnalysis.neutral}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>Negative ({sentimentAnalysis.negative}%)</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Top Keywords</h3>
            <div className="flex flex-wrap gap-1">
              {Object.entries(sentimentAnalysis.wordCloud || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 12)
                .map(([word, count]) => (
                  <Badge
                    key={word}
                    variant="secondary"
                    className="text-xs py-1 px-2"
                    style={{
                      fontSize: `${Math.max(10, Math.min(16, 10 + count / 10))}px`,
                      opacity: 0.5 + count / 200,
                    }}
                  >
                    {word}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">Top Positive</h4>
              <div className="space-y-1">
                {sentimentAnalysis.topPositiveKeywords?.map((keyword, i) => (
                  <Badge key={i} variant="outline" className="bg-green-50 text-green-700 mr-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">Top Negative</h4>
              <div className="space-y-1">
                {sentimentAnalysis.topNegativeKeywords?.map((keyword, i) => (
                  <Badge key={i} variant="outline" className="bg-red-50 text-red-700 mr-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
