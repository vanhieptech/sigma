'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingItem, ContentIdea, TrendRecommendation } from '@/types/analytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronUp,
  ChevronDown,
  Star,
  TrendingUp,
  Lightbulb,
  BarChart,
  Sparkles,
  Clock,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAiTrends } from '@/hooks/use-ai-trends';
import { useApiContext } from '@/providers/tiktok-api-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TiktokAuthForm } from '@/components/auth/tiktok-auth-form';

interface TrendingItemCardProps {
  item: TrendingItem;
}

const TrendingItemCard = ({ item }: TrendingItemCardProps) => {
  return (
    <Card className="mb-2 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{item.name}</span>
            {item.category && (
              <Badge variant="outline" className="text-xs mt-1 w-fit">
                {item.category}
              </Badge>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">
              {Intl.NumberFormat().format(item.viewCount)} views
            </span>
            <div
              className={`flex items-center mt-1 ${item.growth > 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {item.growth > 0 ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="text-xs font-medium">{Math.abs(item.growth).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ContentIdeaCardProps {
  idea: ContentIdea;
  onUse: (idea: ContentIdea) => void;
}

const ContentIdeaCard = ({ idea, onUse }: ContentIdeaCardProps) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{idea.title}</CardTitle>
          <Badge
            variant={
              idea.difficulty === 'easy'
                ? 'secondary'
                : idea.difficulty === 'medium'
                  ? 'outline'
                  : 'destructive'
            }
            className="text-xs"
          >
            {idea.difficulty || 'medium'}
          </Badge>
        </div>
        <CardDescription className="text-sm mt-1">
          {idea.format && (
            <Badge variant="outline" className="mr-2">
              {idea.format}
            </Badge>
          )}
          {idea.videoLength}s video
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground">{idea.description}</p>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {idea.suggestedHashtags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {idea.suggestedHashtags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{idea.suggestedHashtags.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {idea.estimatedViews && (
          <div className="mt-2 text-xs text-muted-foreground">
            Est. views: {Intl.NumberFormat().format(idea.estimatedViews.min)} -
            {Intl.NumberFormat().format(idea.estimatedViews.max)}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-xs">{idea.estimatedEngagement}% engagement</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onUse(idea)}>
            Use Idea
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

interface TrendRecommendationCardProps {
  recommendation: TrendRecommendation;
}

const TrendRecommendationCard = ({ recommendation }: TrendRecommendationCardProps) => {
  return (
    <Card className="mb-2 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{recommendation.name}</span>
              <Badge variant="outline" className="text-xs">
                {recommendation.type}
              </Badge>
            </div>
            {recommendation.description && (
              <p className="text-xs text-muted-foreground mt-1">{recommendation.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end">
            {recommendation.confidence !== undefined && (
              <Badge
                variant={
                  recommendation.confidence > 80
                    ? 'secondary'
                    : recommendation.confidence > 50
                      ? 'outline'
                      : 'destructive'
                }
                className="text-xs"
              >
                {recommendation.confidence}% confidence
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-3 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Current</span>
            {recommendation.currentViews && (
              <span>{Intl.NumberFormat().format(recommendation.currentViews)}</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Predicted</span>
            {recommendation.predictedViews && (
              <span>{Intl.NumberFormat().format(recommendation.predictedViews)}</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Growth</span>
            <div
              className={`flex items-center ${recommendation.growth > 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {recommendation.growth > 0 ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              <span>{Math.abs(recommendation.growth)}%</span>
            </div>
          </div>

          {recommendation.peakTime && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Peak Time</span>
              <span>
                {new Date(recommendation.peakTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface UserSettingsFormProps {
  onUpdate: (userType: string, niche: string) => void;
}

const UserSettingsForm = ({ onUpdate }: UserSettingsFormProps) => {
  const [userType, setUserType] = useState('creator');
  const [niche, setNiche] = useState('lifestyle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(userType, niche);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/30 rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userType">Creator Type</Label>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger>
              <SelectValue placeholder="Select creator type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="influencer">Influencer</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="niche">Content Niche</Label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger>
              <SelectValue placeholder="Select content niche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="beauty">Beauty</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="dance">Dance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" size="sm" className="w-full">
        Update Preferences
      </Button>
    </form>
  );
};

interface AiTrendPanelProps {
  onUseIdea?: (idea: ContentIdea) => void;
}

export function AiTrendPanel({ onUseIdea }: AiTrendPanelProps) {
  const { isAuthenticated } = useApiContext();
  const {
    trendingHashtags,
    trendingSounds,
    contentIdeas,
    recommendations,
    isLoading,
    error,
    refreshTrends,
    refreshContentIdeas,
  } = useAiTrends();

  const handleUseIdea = (idea: ContentIdea) => {
    if (onUseIdea) {
      onUseIdea(idea);
    }
  };

  const handleUpdatePreferences = (userType: string, niche: string) => {
    refreshContentIdeas(userType, niche);
  };

  if (!isAuthenticated) {
    return <TiktokAuthForm />;
  }

  return (
    <div className="w-full bg-card rounded-lg border shadow-sm">
      <Tabs defaultValue="trends" className="w-full">
        <div className="px-4 pt-4 flex justify-between items-center">
          <TabsList className="grid w-[70%] grid-cols-3">
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>For You</span>
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm" onClick={() => refreshTrends()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mx-4 mt-2 p-3 bg-red-50 text-red-700 text-sm rounded-md">{error}</div>
        )}

        <TabsContent value="trends" className="p-4 pt-2">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Currently Trending</h3>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium mb-2">Hashtags</h4>
                <div className="space-y-2 mb-4">
                  {trendingHashtags.length > 0 ? (
                    trendingHashtags.map(item => <TrendingItemCard key={item.id} item={item} />)
                  ) : (
                    <p className="text-sm text-muted-foreground">No trending hashtags found.</p>
                  )}
                </div>

                <h4 className="text-sm font-medium mb-2">Sounds</h4>
                <div className="space-y-2">
                  {trendingSounds.length > 0 ? (
                    trendingSounds.map(item => <TrendingItemCard key={item.id} item={item} />)
                  ) : (
                    <p className="text-sm text-muted-foreground">No trending sounds found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ideas" className="p-4 pt-2">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Content Ideas</h3>

            <UserSettingsForm onUpdate={handleUpdatePreferences} />

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {contentIdeas.length > 0 ? (
                  contentIdeas.map(idea => (
                    <ContentIdeaCard key={idea.id} idea={idea} onUse={handleUseIdea} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No content ideas available. Try refreshing or updating your preferences.
                  </p>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="p-4 pt-2">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Trend Predictions</h3>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {recommendations.length > 0 ? (
                  recommendations.map(recommendation => (
                    <TrendRecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recommendations available. Try refreshing.
                  </p>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
