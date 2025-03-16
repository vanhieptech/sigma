'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TikTokContentIdea } from '@/types/tiktok';
import { Calendar, CheckCircle2, Clock, Filter, Plus, Share2, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

// Sample content ideas
const contentIdeas: TikTokContentIdea[] = [
  {
    id: '1',
    title: 'Day in the Life of a TikTok Creator',
    description:
      'Show your followers what goes into creating content, from planning to execution, in a behind-the-scenes format.',
    trending: true,
    estimatedViews: 35000,
    estimatedEngagement: 8.2,
    suggestedHashtags: ['#dayinthelife', '#contentcreator', '#behindthescenes'],
    suggestedSoundId: 'soundid_12345',
    trend: {
      type: 'hashtag',
      name: 'behindthescenes',
      growthRate: 24,
    },
    createdAt: new Date().toISOString(),
    category: 'Lifestyle',
  },
  {
    id: '2',
    title: "Top 5 TikTok Growth Hacks You Haven't Tried",
    description:
      "Share your best-performing strategies for growing a TikTok account that most creators don't know about.",
    trending: true,
    estimatedViews: 42000,
    estimatedEngagement: 9.5,
    suggestedHashtags: ['#tiktokgrowth', '#creatortips', '#socialmediatips'],
    trend: {
      type: 'hashtag',
      name: 'creatortips',
      growthRate: 18,
    },
    createdAt: new Date().toISOString(),
    category: 'Education',
  },
  {
    id: '3',
    title: 'React to Your Oldest Content',
    description:
      "Review and react to your earliest TikToks, showing your growth and sharing what you've learned.",
    trending: false,
    estimatedViews: 28000,
    estimatedEngagement: 7.8,
    suggestedHashtags: ['#throwback', '#contentcreator', '#reaction'],
    createdAt: new Date().toISOString(),
    category: 'Entertainment',
  },
  {
    id: '4',
    title: 'Trying This Viral TikTok Hack',
    description:
      "Test and review a trending TikTok hack or challenge that's going viral right now.",
    trending: true,
    estimatedViews: 38000,
    estimatedEngagement: 8.8,
    suggestedHashtags: ['#tiktokhack', '#viral', '#trending'],
    suggestedSoundId: 'soundid_67890',
    trend: {
      type: 'challenge',
      name: 'viralhack',
      growthRate: 32,
    },
    createdAt: new Date().toISOString(),
    category: 'Trends',
  },
  {
    id: '5',
    title: 'How I Edit My TikToks (Step by Step)',
    description:
      'Walk through your editing process, showing the tools, effects, and transitions you use to create your content.',
    trending: false,
    estimatedViews: 25000,
    estimatedEngagement: 6.9,
    suggestedHashtags: ['#editing', '#tutorial', '#tiktoktips'],
    createdAt: new Date().toISOString(),
    category: 'Tutorial',
  },
];

// Content idea categories
const contentCategories = [
  'All',
  'Trending',
  'Educational',
  'Entertainment',
  'Tutorial',
  'Challenge',
  'Q&A',
  'Lifestyle',
  'Behind the Scenes',
];

export function ContentIdeas() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);

  // Filter ideas based on selected category
  const filteredIdeas =
    selectedCategory === 'All'
      ? contentIdeas
      : selectedCategory === 'Trending'
        ? contentIdeas.filter(idea => idea.trending)
        : contentIdeas.filter(
            idea => idea.category.toLowerCase() === selectedCategory.toLowerCase()
          );

  // Toggle saved idea
  const toggleSavedIdea = (id: string) => {
    if (savedIdeas.includes(id)) {
      setSavedIdeas(savedIdeas.filter(ideaId => ideaId !== id));
    } else {
      setSavedIdeas([...savedIdeas, id]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Content Ideas</CardTitle>
            <CardDescription>
              AI-generated content suggestions based on your audience and trending topics
            </CardDescription>
          </div>
          <Button size="sm" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span>Generate More</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {contentCategories.map(category => (
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

        <Tabs defaultValue="ideas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ideas" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Scheduled</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="space-y-4">
            {filteredIdeas.map(idea => (
              <Card key={idea.id} className="overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
                    </div>
                    <Button
                      variant={savedIdeas.includes(idea.id) ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleSavedIdea(idea.id)}
                    >
                      {savedIdeas.includes(idea.id) ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {idea.suggestedHashtags.map(hashtag => (
                      <Badge key={hashtag} variant="secondary" className="text-xs">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>

                  {idea.trend && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>
                        <span className="font-medium">#{idea.trend.name}</span>
                        <span className="text-green-500 ml-1">
                          +{idea.trend.growthRate}% growth
                        </span>
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Est. Views</span>
                      <span className="font-medium">
                        {(idea.estimatedViews / 1000).toFixed(1)}K
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Engagement</span>
                      <span className="font-medium">{idea.estimatedEngagement}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Relevance</span>
                      <div className="flex items-center gap-1">
                        <Progress value={idea.trending ? 85 : 70} className="h-2 w-16" />
                        <span className="text-xs">{idea.trending ? 'High' : 'Medium'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center justify-between p-2 px-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Best time to post: 7:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Calendar className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="trending">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Trending Topics Analysis</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-2">
                See what&apos;s currently trending on TikTok and how you can leverage these trends
                in your content.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="scheduled">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Content Calendar</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-2">
                Plan and schedule your content based on AI-recommended optimal posting times.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Create Custom
          </Button>
          <Button size="sm">Schedule Selected</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
