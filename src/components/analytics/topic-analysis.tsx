'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const topicData = [
  { topic: 'TikTok Algorithm', engagement: 78, growth: '+12%', trend: 'increasing' },
  { topic: 'Behind the Scenes', engagement: 65, growth: '+8%', trend: 'stable' },
  { topic: 'Day in the Life', engagement: 62, growth: '+5%', trend: 'stable' },
  { topic: 'Content Creation Tips', engagement: 59, growth: '+18%', trend: 'increasing' },
  { topic: 'Q&A Sessions', engagement: 57, growth: '-3%', trend: 'decreasing' },
  { topic: 'Product Reviews', engagement: 52, growth: '+7%', trend: 'stable' },
  { topic: 'Industry News', engagement: 48, growth: '+14%', trend: 'increasing' },
  { topic: 'Guest Interviews', engagement: 45, growth: '+2%', trend: 'stable' },
];

const keywordData = [
  { name: 'growth-hacks', value: 85 },
  { name: 'viral-content', value: 78 },
  { name: 'creator-economy', value: 72 },
  { name: 'algorithm', value: 68 },
  { name: 'analytics', value: 65 },
  { name: 'influencer', value: 62 },
  { name: 'monetization', value: 58 },
  { name: 'engagement', value: 55 },
];

export function TopicAnalysis() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Topic Analysis</CardTitle>
        <CardDescription>Identify which topics resonate with your audience</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="topics" className="space-y-4">
          <TabsList className="grid grid-cols-2 h-9">
            <TabsTrigger value="topics">Top Topics</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="topics">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-right">Engagement</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topicData.map(topic => (
                  <TableRow key={topic.topic}>
                    <TableCell className="font-medium">{topic.topic}</TableCell>
                    <TableCell className="text-right">{topic.engagement}%</TableCell>
                    <TableCell className="text-right">{topic.growth}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          topic.trend === 'increasing'
                            ? 'default'
                            : topic.trend === 'decreasing'
                              ? 'destructive'
                              : 'outline'
                        }
                      >
                        {topic.trend}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Topics ranked by audience engagement and growth over time</p>
            </div>
          </TabsContent>

          <TabsContent value="keywords">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={keywordData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" name="Relevance Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Keywords that drive the most engagement in your content</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
