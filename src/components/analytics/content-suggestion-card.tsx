'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendRecommendation, ContentIdea } from '@/types/analytics';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LightbulbIcon,
  ThumbsUpIcon,
  ArrowUpRightIcon,
  HashIcon,
  MusicIcon,
  ZapIcon,
  LayoutIcon,
} from 'lucide-react';

interface ContentSuggestionCardProps {
  contentIdeas?: ContentIdea[];
  recommendations?: TrendRecommendation[];
  isLoading?: boolean;
}

export function ContentSuggestionCard({
  contentIdeas = [],
  recommendations = [],
  isLoading = false,
}: ContentSuggestionCardProps) {
  const [activeTab, setActiveTab] = useState('ideas');

  // Format based on content idea format
  const formatBadgeColor = (format: string) => {
    switch (format) {
      case 'short':
        return 'bg-red-100 text-red-800';
      case 'long':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-purple-100 text-purple-800';
      case 'photo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format based on recommendation type
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'hashtag':
        return HashIcon;
      case 'sound':
        return MusicIcon;
      case 'effect':
        return ZapIcon;
      case 'challenge':
        return ArrowUpRightIcon;
      case 'content':
        return LayoutIcon;
      default:
        return ThumbsUpIcon;
    }
  };

  // Format views estimate
  const formatViews = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Suggestions</CardTitle>
        <CardDescription>Personalized content ideas and trend recommendations</CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ideas">
              <LightbulbIcon className="h-4 w-4 mr-2" />
              Content Ideas
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <ThumbsUpIcon className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4 px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-muted-foreground">Loading suggestions...</p>
            </div>
          ) : (
            <>
              {/* Content Ideas Tab */}
              <TabsContent value="ideas" className="mt-0">
                {contentIdeas && contentIdeas.length > 0 ? (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {contentIdeas.map(idea => (
                        <div key={idea.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{idea.title}</h3>
                            <Badge className={formatBadgeColor(idea.format)}>
                              {idea.format.charAt(0).toUpperCase() + idea.format.slice(1)}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {idea.suggestedHashtags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          {idea.suggestedSounds && idea.suggestedSounds.length > 0 && (
                            <div className="mb-3">
                              <div className="text-xs font-medium mb-1">Suggested Sounds:</div>
                              <div className="flex flex-wrap gap-1">
                                {idea.suggestedSounds.map(sound => (
                                  <Badge
                                    key={sound}
                                    variant="outline"
                                    className="text-xs flex items-center"
                                  >
                                    <MusicIcon className="h-3 w-3 mr-1" />
                                    {sound}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div>
                              Est. Views:{' '}
                              {formatViews(idea.estimatedViews.min, idea.estimatedViews.max)}
                            </div>
                            <div>Relevance: {idea.relevance}/10</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[400px]">
                    <p className="text-muted-foreground">No content ideas available</p>
                  </div>
                )}
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="mt-0">
                {recommendations && recommendations.length > 0 ? (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {recommendations.map(rec => {
                        const Icon = getRecommendationIcon(rec.type);

                        return (
                          <div key={rec.id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-800">
                                <Icon className="h-4 w-4" />
                              </div>
                              <h3 className="font-medium">{rec.name}</h3>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>

                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="border rounded p-2">
                                <div className="text-muted-foreground mb-1">Relevance</div>
                                <div className="font-medium">{rec.relevanceScore}/10</div>
                              </div>
                              <div className="border rounded p-2">
                                <div className="text-muted-foreground mb-1">Popularity</div>
                                <div className="font-medium">{rec.popularity}/10</div>
                              </div>
                              <div className="border rounded p-2">
                                <div className="text-muted-foreground mb-1">Growth</div>
                                <div className="font-medium flex items-center">
                                  <ArrowUpRightIcon
                                    className={`h-3 w-3 mr-1 ${rec.growth > 0 ? 'text-green-500' : 'text-red-500'}`}
                                  />
                                  {Math.abs(rec.growth)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[400px]">
                    <p className="text-muted-foreground">No recommendations available</p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
}
