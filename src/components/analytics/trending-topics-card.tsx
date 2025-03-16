'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingItem } from '@/types/analytics';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrendingUpIcon,
  Music2Icon,
  SparklesIcon,
  HashIcon,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TrendingTopicsCardProps {
  hashtags?: TrendingItem[];
  sounds?: TrendingItem[];
  effects?: TrendingItem[];
  challenges?: TrendingItem[];
  isLoading?: boolean;
  error?: string | null;
}

export function TrendingTopicsCard({
  hashtags = [],
  sounds = [],
  effects = [],
  challenges = [],
  isLoading = false,
  error = null,
}: TrendingTopicsCardProps) {
  // Default tab selection
  const [selectedTab, setSelectedTab] = useState('hashtags');

  // Configuration for each trend type
  const trendConfig = {
    hashtags: {
      icon: HashIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      title: 'Trending Hashtags',
      emptyMessage: 'No trending hashtags available',
    },
    sounds: {
      icon: Music2Icon,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      title: 'Trending Sounds',
      emptyMessage: 'No trending sounds available',
    },
    effects: {
      icon: SparklesIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      title: 'Trending Effects',
      emptyMessage: 'No trending effects available',
    },
    challenges: {
      icon: TrendingUpIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      title: 'Trending Challenges',
      emptyMessage: 'No trending challenges available',
    },
  };

  // Get the data for the selected tab
  const getTrendData = (tab: string) => {
    switch (tab) {
      case 'hashtags':
        return hashtags;
      case 'sounds':
        return sounds;
      case 'effects':
        return effects;
      case 'challenges':
        return challenges;
      default:
        return [];
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
          <CardDescription>Stay updated with what&apos;s trending</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending Topics</CardTitle>
        <CardDescription>Stay updated with what&apos;s trending on TikTok</CardDescription>
      </CardHeader>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hashtags" className="text-xs">
              Hashtags
            </TabsTrigger>
            <TabsTrigger value="sounds" className="text-xs">
              Sounds
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              Effects
            </TabsTrigger>
            <TabsTrigger value="challenges" className="text-xs">
              Challenges
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4 px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-[350px]">
              <p className="text-muted-foreground">Loading trending data...</p>
            </div>
          ) : (
            Object.keys(trendConfig).map(tab => {
              const config = trendConfig[tab as keyof typeof trendConfig];
              const data = getTrendData(tab);
              const Icon = config.icon;

              return (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-md ${config.bgColor} ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-md font-medium">{config.title}</h3>
                  </div>

                  {data && data.length > 0 ? (
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="space-y-3">
                        {data.map(item => (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg border flex justify-between items-center"
                          >
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {(
                                  item.count ||
                                  item.creatorCount ||
                                  item.viewCount ||
                                  0
                                ).toLocaleString()}
                                {item.count ? 'posts' : item.creatorCount ? 'creators' : 'views'}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1 ${item.growth > 0 ? 'text-green-500' : 'text-red-500'}`}
                            >
                              {item.growth > 0 ? (
                                <ArrowUpIcon className="h-3 w-3" />
                              ) : (
                                <ArrowDownIcon className="h-3 w-3" />
                              )}
                              {Math.abs(item.growth)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-[350px]">
                      <p className="text-muted-foreground">{config.emptyMessage}</p>
                    </div>
                  )}
                </TabsContent>
              );
            })
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
}
