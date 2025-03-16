'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  HashIcon,
  Music,
  Play,
  Sparkles,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  BookMarked,
} from 'lucide-react';

// Sample trending hashtags data
const trendingHashtags = [
  { name: '#tiktoktips', posts: 4.8, views: 12.6, growth: 32, category: 'Education' },
  { name: '#dancechallenge', posts: 8.2, views: 45.3, growth: 28, category: 'Entertainment' },
  { name: '#dayinmylife', posts: 6.4, views: 18.7, growth: 24, category: 'Lifestyle' },
  { name: '#learnontiktok', posts: 5.3, views: 22.1, growth: 21, category: 'Education' },
  { name: '#tiktokhack', posts: 7.1, views: 28.5, growth: 18, category: 'Tutorial' },
  { name: '#viralsound', posts: 9.5, views: 38.9, growth: 15, category: 'Music' },
];

// Sample trending sounds data
const trendingSounds = [
  {
    id: 'sound1',
    name: 'Original Sound - Creator Name',
    uses: 450000,
    growth: 42,
    duration: '00:15',
  },
  { id: 'sound2', name: 'Popular Song - Artist Name', uses: 820000, growth: 38, duration: '00:30' },
  { id: 'sound3', name: 'Viral Quote - Movie Name', uses: 380000, growth: 34, duration: '00:12' },
  {
    id: 'sound4',
    name: 'Trending Beat - Producer Name',
    uses: 290000,
    growth: 28,
    duration: '00:20',
  },
];

// Sample trend growth data for charts
const trendGrowthData = [
  { day: 'Mon', views: 2400, posts: 240, engagement: 4.5 },
  { day: 'Tue', views: 1800, posts: 220, engagement: 4.2 },
  { day: 'Wed', views: 3200, posts: 280, engagement: 5.1 },
  { day: 'Thu', views: 4800, posts: 350, engagement: 5.8 },
  { day: 'Fri', views: 5200, posts: 410, engagement: 6.2 },
  { day: 'Sat', views: 7800, posts: 580, engagement: 6.8 },
  { day: 'Sun', views: 8400, posts: 610, engagement: 7.2 },
];

// Trending categories
const trendingCategories = [
  'All',
  'Entertainment',
  'Education',
  'Lifestyle',
  'Tutorial',
  'Music',
  'Fashion',
  'Food',
  'Comedy',
];

export function TrendingTopics() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [savedItems, setSavedItems] = useState<string[]>([]);

  // Filter hashtags based on selected category
  const filteredHashtags =
    selectedCategory === 'All'
      ? trendingHashtags
      : trendingHashtags.filter(hashtag => hashtag.category === selectedCategory);

  // Toggle saved item
  const toggleSavedItem = (id: string) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(item => item !== id));
    } else {
      setSavedItems([...savedItems, id]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>Discover trending topics and hashtags on TikTok</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {trendingCategories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="hashtags" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hashtags" className="flex items-center gap-1">
              <HashIcon className="h-4 w-4" />
              <span>Hashtags</span>
            </TabsTrigger>
            <TabsTrigger value="sounds" className="flex items-center gap-1">
              <Music className="h-4 w-4" />
              <span>Sounds</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hashtags">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Hashtag</th>
                    <th className="text-right p-3 text-sm font-medium">Posts (M)</th>
                    <th className="text-right p-3 text-sm font-medium">Views (M)</th>
                    <th className="text-right p-3 text-sm font-medium">Growth</th>
                    <th className="text-right p-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHashtags.map((hashtag, index) => (
                    <tr
                      key={hashtag.name}
                      className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                    >
                      <td className="p-3">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {hashtag.category}
                          </Badge>
                          <span className="font-medium">{hashtag.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">{hashtag.posts}M</td>
                      <td className="p-3 text-right">{hashtag.views}M</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-green-600">
                          <ArrowUpRight className="h-4 w-4" />
                          <span>{hashtag.growth}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleSavedItem(hashtag.name)}
                          >
                            <BookMarked
                              className={`h-4 w-4 ${savedItems.includes(hashtag.name) ? 'text-primary' : ''}`}
                            />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="sounds">
            <div className="space-y-4">
              {trendingSounds.map(sound => (
                <div
                  key={sound.id}
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mr-3">
                      <Music className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sound.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{(sound.uses / 1000).toFixed(0)}K uses</span>
                        <span className="flex items-center gap-1 text-green-600">
                          <ArrowUpRight className="h-3 w-3" />
                          {sound.growth}%
                        </span>
                        <span>{sound.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleSavedItem(sound.id)}
                    >
                      <BookMarked
                        className={`h-4 w-4 ${savedItems.includes(sound.id) ? 'text-primary' : ''}`}
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Trend Growth (Last 7 Days)</h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendGrowthData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Views (K)"
                      />
                      <Area
                        type="monotone"
                        dataKey="posts"
                        stackId="2"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Posts"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Top Categories</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { category: 'Entertainment', value: 32 },
                          { category: 'Education', value: 24 },
                          { category: 'Lifestyle', value: 18 },
                          { category: 'Tutorial', value: 14 },
                          { category: 'Music', value: 12 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="category" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Trend Strength" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Engagement by Day</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendGrowthData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="engagement"
                          stroke="#8884d8"
                          name="Engagement (%)"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
