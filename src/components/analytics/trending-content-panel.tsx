'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Hash,
  Music,
  RefreshCw,
  Plus,
  Sparkles,
  FileText,
  Lightbulb,
  Play,
  Copy,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTrendingContent } from '@/hooks/use-trending-content';
import { TikTokContentIdea } from '@/types/tiktok';

// Component to display a content idea card
const ContentIdeaCard = ({ idea, onSave }: { idea: TikTokContentIdea; onSave: () => void }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    onSave();
    // Reset saved state after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Card className="relative">
      {idea.trending && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-base">{idea.title}</CardTitle>
        <CardDescription className="text-sm">{idea.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-2">
        {idea.trend && (
          <div className="flex items-center space-x-2 text-sm">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
            >
              <TrendingUp className="h-3 w-3" />
              {idea.trend.type === 'hashtag' ? 'Hashtag' : 'Sound'} Trend
            </Badge>
            <span className="text-green-600 dark:text-green-400 text-xs">
              +{Math.round(idea.trend.growthRate)}% growth
            </span>
          </div>
        )}

        <div>
          <p className="text-xs font-medium mb-1 text-muted-foreground">Suggested Hashtags:</p>
          <div className="flex flex-wrap gap-1">
            {idea.suggestedHashtags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {idea.suggestedSoundId && (
          <div>
            <p className="text-xs font-medium mb-1 text-muted-foreground">Suggested Sound:</p>
            <div className="flex items-center bg-muted p-2 rounded-md">
              <Play className="h-4 w-4 mr-2 text-primary" />
              <span className="text-xs truncate">Trending Sound - Click to preview</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 p-2 rounded-md">
            <p className="font-medium">Est. Views</p>
            <p className="text-sm">{idea.estimatedViews.toLocaleString()}</p>
          </div>
          <div className="bg-muted/50 p-2 rounded-md">
            <p className="font-medium">Est. Engagement</p>
            <p className="text-sm">{idea.estimatedEngagement.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          variant={isSaved ? 'default' : 'outline'}
          size="sm"
          className="w-full"
          onClick={handleSave}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Save Idea
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Hashtag component
const HashtagItem = ({
  name,
  videos,
  trending,
}: {
  name: string;
  videos: number;
  trending: boolean;
}) => (
  <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
    <div className="flex items-center">
      <Hash className="h-4 w-4 mr-2 text-blue-500" />
      <span className="font-medium">#{name}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">{videos.toLocaleString()} videos</span>
      {trending && (
        <Badge
          variant="outline"
          className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Trending
        </Badge>
      )}
    </div>
  </div>
);

// Sound component
const SoundItem = ({
  name,
  authorName,
  usageCount,
  trending,
  durationSec,
}: {
  name: string;
  authorName: string;
  usageCount: number;
  trending: boolean;
  durationSec: number;
}) => (
  <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
    <div className="flex items-center">
      <Music className="h-4 w-4 mr-2 text-purple-500" />
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">
          @{authorName} • {durationSec}s
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">{usageCount.toLocaleString()} uses</span>
      {trending && (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Trending
        </Badge>
      )}
    </div>
  </div>
);

export default function TrendingContentPanel() {
  const [savedIdeas, setSavedIdeas] = useState<TikTokContentIdea[]>([]);

  const {
    hashtags,
    sounds,
    contentIdeas,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    refreshTrends,
    generateContentIdea,
  } = useTrendingContent();

  const handleSaveIdea = (idea: TikTokContentIdea) => {
    setSavedIdeas(prev => {
      // Check if already saved (by id)
      if (!prev.some(i => i.id === idea.id)) {
        return [...prev, idea];
      }
      return prev;
    });
  };

  const handleCreateNewIdea = () => {
    const newIdea = generateContentIdea();
    setSavedIdeas(prev => [...prev, newIdea]);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            <span>TikTok Trending Content</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshTrends} disabled={isLoading}>
            <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Discover trending content and generate viral ideas for your TikTok channel
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Filter by Category:</h3>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="dance">Dance</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="beauty">Beauty</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="pets">Pets</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="ideas">
              <Lightbulb className="h-4 w-4 mr-2" />
              Content Ideas
            </TabsTrigger>
            <TabsTrigger value="hashtags">
              <Hash className="h-4 w-4 mr-2" />
              Hashtags
            </TabsTrigger>
            <TabsTrigger value="sounds">
              <Music className="h-4 w-4 mr-2" />
              Sounds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">AI Generated Content Ideas</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => contentIdeas.forEach(handleSaveIdea)}
              >
                <Copy className="h-3 w-3 mr-2" />
                Save All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentIdeas.map(idea => (
                <ContentIdeaCard key={idea.id} idea={idea} onSave={() => handleSaveIdea(idea)} />
              ))}
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Your Saved Ideas ({savedIdeas.length})</h3>
              <Button variant="outline" size="sm" onClick={handleCreateNewIdea}>
                <Sparkles className="h-3 w-3 mr-2" />
                Generate New
              </Button>
            </div>

            {savedIdeas.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid grid-cols-1 gap-4">
                  {savedIdeas.map(idea => (
                    <Card key={idea.id} className="p-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{idea.title}</h4>
                          <p className="text-sm text-muted-foreground">{idea.description}</p>
                        </div>
                        <Badge variant={idea.trending ? 'default' : 'outline'}>
                          {idea.category}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
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
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="border rounded-md flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-lg">No saved ideas yet</p>
                <p className="text-sm mb-4">Save content ideas for your future videos</p>
                <Button variant="outline" size="sm" onClick={handleCreateNewIdea}>
                  <Sparkles className="h-3 w-3 mr-2" />
                  Generate an Idea
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hashtags">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Trending Hashtags</h3>
                <Badge className="bg-amber-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {hashtags.filter(h => h.trending).length} Trending
                </Badge>
              </div>

              <Accordion type="single" collapsible defaultValue="trending">
                <AccordionItem value="trending">
                  <AccordionTrigger className="text-sm font-medium">Trending Now</AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-1 pr-4">
                        {hashtags
                          .filter(hashtag => hashtag.trending)
                          .map(hashtag => (
                            <HashtagItem
                              key={hashtag.name}
                              name={hashtag.name}
                              videos={hashtag.videos}
                              trending={hashtag.trending}
                            />
                          ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="all">
                  <AccordionTrigger className="text-sm font-medium">
                    All Popular Hashtags
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-1 pr-4">
                        {hashtags.map(hashtag => (
                          <HashtagItem
                            key={hashtag.name}
                            name={hashtag.name}
                            videos={hashtag.videos}
                            trending={hashtag.trending}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                  Hashtag Strategy Tips
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Mix trending and niche hashtags for better reach</li>
                  <li>• Use 5-10 hashtags per video for optimal visibility</li>
                  <li>• Place hashtags in caption, not comments</li>
                  <li>• Create a branded hashtag for your channel</li>
                  <li>• Refresh your hashtag strategy every few weeks</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sounds">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Trending Sounds</h3>
                <Badge className="bg-purple-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {sounds.filter(s => s.trending).length} Trending
                </Badge>
              </div>

              <Accordion type="single" collapsible defaultValue="trending">
                <AccordionItem value="trending">
                  <AccordionTrigger className="text-sm font-medium">Trending Now</AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-1 pr-4">
                        {sounds
                          .filter(sound => sound.trending)
                          .map(sound => (
                            <SoundItem
                              key={sound.id}
                              name={sound.name}
                              authorName={sound.authorName}
                              usageCount={sound.usageCount}
                              trending={sound.trending}
                              durationSec={sound.durationSec}
                            />
                          ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="all">
                  <AccordionTrigger className="text-sm font-medium">
                    All Popular Sounds
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-1 pr-4">
                        {sounds.map(sound => (
                          <SoundItem
                            key={sound.id}
                            name={sound.name}
                            authorName={sound.authorName}
                            usageCount={sound.usageCount}
                            trending={sound.trending}
                            durationSec={sound.durationSec}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-purple-500" />
                  Sound Strategy Tips
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use trending sounds within first 48 hours of popularity</li>
                  <li>• Try to use the first 15 seconds of a sound for best algorithm boost</li>
                  <li>• Save sounds you like for future videos</li>
                  <li>• Original sounds can help establish your brand</li>
                  <li>• Remix popular sounds with your own twist</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <div className="w-full flex justify-between text-xs text-muted-foreground">
          <div>
            Category: <span className="font-medium capitalize">{selectedCategory}</span>
          </div>
          <div>Last updated: {new Date().toLocaleString()}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
