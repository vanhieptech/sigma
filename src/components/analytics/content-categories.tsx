'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Filter, Hash, Layers, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from 'recharts';

// Sample data for content categories treemap
const contentCategoriesData = [
  {
    name: 'Tutorials',
    value: 35,
    color: '#8884d8',
    children: [
      { name: 'Software Tutorials', value: 15, color: '#8884d8' },
      { name: 'DIY Tutorials', value: 12, color: '#9884d8' },
      { name: 'Educational', value: 8, color: '#a884d8' },
    ],
  },
  {
    name: 'Entertainment',
    value: 25,
    color: '#82ca9d',
    children: [
      { name: 'Skits', value: 10, color: '#82ca9d' },
      { name: 'Reactions', value: 8, color: '#72ca9d' },
      { name: 'Challenges', value: 7, color: '#62ca9d' },
    ],
  },
  {
    name: 'Informational',
    value: 20,
    color: '#ffc658',
    children: [
      { name: 'Industry News', value: 8, color: '#ffc658' },
      { name: 'Tips & Tricks', value: 7, color: '#ffb658' },
      { name: 'Reviews', value: 5, color: '#ffa658' },
    ],
  },
  {
    name: 'Lifestyle',
    value: 15,
    color: '#ff8042',
    children: [
      { name: 'Day in Life', value: 6, color: '#ff8042' },
      { name: 'Vlogs', value: 5, color: '#ff7042' },
      { name: 'Travel', value: 4, color: '#ff6042' },
    ],
  },
  {
    name: 'Promotional',
    value: 5,
    color: '#d84315',
    children: [
      { name: 'Product Launches', value: 3, color: '#d84315' },
      { name: 'Advertisements', value: 2, color: '#c84315' },
    ],
  },
];

// Sample data for tags
const tagsData = [
  { name: 'tutorial', count: 28, engagement: 6.8 },
  { name: 'tiktokgrowth', count: 24, engagement: 7.2 },
  { name: 'creator', count: 22, engagement: 6.5 },
  { name: 'trending', count: 20, engagement: 8.1 },
  { name: 'socialmediatips', count: 18, engagement: 6.9 },
  { name: 'viral', count: 16, engagement: 7.8 },
  { name: 'contentcreator', count: 15, engagement: 6.2 },
  { name: 'fyp', count: 14, engagement: 7.5 },
  { name: 'learnontiktok', count: 12, engagement: 6.4 },
  { name: 'howto', count: 10, engagement: 5.9 },
  { name: 'behindthescenes', count: 9, engagement: 6.1 },
  { name: 'technology', count: 8, engagement: 5.8 },
];

// Sample data for content sentiment analysis
const sentimentData = [
  { name: 'Positive', value: 65, color: '#4caf50' },
  { name: 'Neutral', value: 25, color: '#2196f3' },
  { name: 'Negative', value: 10, color: '#f44336' },
];

// Sample data for category performance
const categoryPerformanceData = [
  { category: 'Tutorials', views: 450000, engagement: 7.2, posts: 35 },
  { category: 'Entertainment', views: 380000, engagement: 8.4, posts: 25 },
  { category: 'Informational', views: 320000, engagement: 6.8, posts: 20 },
  { category: 'Lifestyle', views: 280000, engagement: 7.5, posts: 15 },
  { category: 'Promotional', views: 120000, engagement: 5.6, posts: 5 },
];

export function ContentCategories() {
  const [tags, setTags] = useState(tagsData);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Add a new tag
  const addTag = () => {
    if (tagInput.trim() && !tags.some(tag => tag.name === tagInput.trim())) {
      const newTag = {
        name: tagInput.trim(),
        count: 1,
        engagement: 0,
      };
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  // Delete a tag
  const deleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag.name !== tagToDelete));
    setSelectedTags(selectedTags.filter(tag => tag !== tagToDelete));
  };

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Content Categories</CardTitle>
            <CardDescription>Analyze and manage your content categories and tags</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              <span>Tags</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={contentCategoriesData}
                  dataKey="value"
                  nameKey="name"
                  stroke="#fff"
                  fill="#8884d8"
                >
                  {contentCategoriesData.map((item, index) => {
                    if (item.children) {
                      return item.children.map((child, childIndex) => (
                        <Cell key={`cell-${index}-${childIndex}`} fill={child.color} />
                      ));
                    }
                    return <Cell key={`cell-${index}`} fill={item.color} />;
                  })}
                </Treemap>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Sentiment Analysis</h4>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Category Distribution</h4>
                <div className="space-y-3">
                  {contentCategoriesData.map(category => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm">{category.value}%</span>
                      </div>
                      <Progress value={category.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tags">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Add a new tag..."
                  className="pl-8"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      addTag();
                    }
                  }}
                />
              </div>
              <Button size="sm" onClick={addTag}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(tag => (
                <Badge
                  key={tag.name}
                  variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                  className="flex items-center gap-1 px-3 py-1 cursor-pointer"
                  onClick={() => toggleTag(tag.name)}
                >
                  <span>#{tag.name}</span>
                  <span className="text-xs opacity-70">({tag.count})</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={e => {
                      e.stopPropagation();
                      deleteTag(tag.name);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tags.slice(0, 10)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    name="Usage Count"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="engagement"
                    name="Engagement (%)"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between">
              <div>
                <span className="text-sm font-medium">Total Tags:</span> <span>{tags.length}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Most Used:</span>{' '}
                <span>#{tags[0]?.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Best Performing:</span>{' '}
                <span>#{tags.sort((a, b) => b.engagement - a.engagement)[0]?.name}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'Views') {
                        return [formatNumber(value as number), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="views"
                    name="Views"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="engagement"
                    name="Engagement (%)"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Top Performing Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">Entertainment</div>
                      <p className="text-xs text-muted-foreground">Highest engagement rate</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">8.4%</div>
                      <p className="text-xs text-muted-foreground">Avg. engagement</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Views</span>
                      <span className="font-medium">380K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Content Count</span>
                      <span className="font-medium">25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Watch Time</span>
                      <span className="font-medium">1:45</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recommended Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">Tutorials</div>
                      <p className="text-xs text-muted-foreground">Highest overall performance</p>
                    </div>
                    <Badge className="text-xs">High Growth Potential</Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Views/Post Ratio</span>
                      <span className="font-medium">12.9K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Growth Rate</span>
                      <span className="font-medium text-green-600">+18%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Audience Retention</span>
                      <span className="font-medium">68%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
