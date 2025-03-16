'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, RefreshCw, ThumbsUp, ThumbsDown, Copy, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentSuggestionsProps {
  isLiveActive: boolean;
  currentTopic?: string;
  commentKeywords?: string[];
}

interface Suggestion {
  id: string;
  type: 'topic' | 'question' | 'challenge' | 'trend';
  content: string;
  tags: string[];
  isLiked?: boolean;
  isDisliked?: boolean;
}

// Mock data for suggestions
const MOCK_SUGGESTIONS: Record<string, Suggestion[]> = {
  topics: [
    {
      id: 't1',
      type: 'topic',
      content: 'Share your favorite productivity hack',
      tags: ['productivity', 'tips', 'lifestyle'],
    },
    {
      id: 't2',
      type: 'topic',
      content: 'React vs Vue - pros and cons from my experience',
      tags: ['coding', 'webdev', 'frontend'],
    },
    {
      id: 't3',
      type: 'topic',
      content: 'How I built a successful side project in 30 days',
      tags: ['entrepreneurship', 'coding', 'business'],
    },
    {
      id: 't4',
      type: 'topic',
      content: 'My morning routine as a developer',
      tags: ['lifestyle', 'productivity', 'morning'],
    },
  ],
  questions: [
    {
      id: 'q1',
      type: 'question',
      content: "What's the most challenging bug you've ever fixed?",
      tags: ['coding', 'debugging', 'stories'],
    },
    {
      id: 'q2',
      type: 'question',
      content: 'What tools do you use for project management?',
      tags: ['productivity', 'tools', 'management'],
    },
    {
      id: 'q3',
      type: 'question',
      content: 'How do you balance learning new technologies vs mastering current ones?',
      tags: ['career', 'learning', 'skills'],
    },
    {
      id: 'q4',
      type: 'question',
      content: "What's your opinion on AI tools for developers?",
      tags: ['ai', 'tools', 'future'],
    },
  ],
  challenges: [
    {
      id: 'c1',
      type: 'challenge',
      content: 'Code review challenge: spot the bugs in this snippet',
      tags: ['interactive', 'coding', 'bugs'],
    },
    {
      id: 'c2',
      type: 'challenge',
      content: 'Build a simple component in 5 minutes',
      tags: ['coding', 'frontend', 'speed'],
    },
    {
      id: 'c3',
      type: 'challenge',
      content: 'Explain a complex concept in simple terms',
      tags: ['teaching', 'communication', 'skills'],
    },
    {
      id: 'c4',
      type: 'challenge',
      content: 'Recreate this UI without looking at the code',
      tags: ['ui', 'design', 'frontend'],
    },
  ],
  trends: [
    {
      id: 'tr1',
      type: 'trend',
      content: 'React Server Components and the future of React',
      tags: ['react', 'frontend', 'trends'],
    },
    {
      id: 'tr2',
      type: 'trend',
      content: 'AI pair programming tools - are they worth it?',
      tags: ['ai', 'tools', 'coding'],
    },
    {
      id: 'tr3',
      type: 'trend',
      content: 'The rise of TypeScript and static typing',
      tags: ['typescript', 'javascript', 'trends'],
    },
    {
      id: 'tr4',
      type: 'trend',
      content: 'Web performance optimization techniques for 2023',
      tags: ['performance', 'web', 'optimization'],
    },
  ],
};

export function ContentSuggestions({
  isLiveActive,
  currentTopic,
  commentKeywords = [],
}: ContentSuggestionsProps) {
  const [activeTab, setActiveTab] = useState('topics');
  const [suggestions, setSuggestions] = useState<Record<string, Suggestion[]>>(MOCK_SUGGESTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerateContent = () => {
    setIsGenerating(true);

    // Simulate API call to generate content
    setTimeout(() => {
      // In a real implementation, this would call an AI service
      // For now, we'll just shuffle the existing suggestions
      const shuffled = { ...suggestions };
      Object.keys(shuffled).forEach(key => {
        shuffled[key] = [...shuffled[key]].sort(() => Math.random() - 0.5);
      });

      setSuggestions(shuffled);
      setIsGenerating(false);
    }, 1500);
  };

  const handleLike = (id: string) => {
    setSuggestions(prev => {
      const newSuggestions = { ...prev };
      Object.keys(newSuggestions).forEach(key => {
        newSuggestions[key] = newSuggestions[key].map(suggestion =>
          suggestion.id === id
            ? {
                ...suggestion,
                isLiked: !suggestion.isLiked,
                isDisliked: suggestion.isDisliked ? false : suggestion.isDisliked,
              }
            : suggestion
        );
      });
      return newSuggestions;
    });
  };

  const handleDislike = (id: string) => {
    setSuggestions(prev => {
      const newSuggestions = { ...prev };
      Object.keys(newSuggestions).forEach(key => {
        newSuggestions[key] = newSuggestions[key].map(suggestion =>
          suggestion.id === id
            ? {
                ...suggestion,
                isDisliked: !suggestion.isDisliked,
                isLiked: suggestion.isLiked ? false : suggestion.isLiked,
              }
            : suggestion
        );
      });
      return newSuggestions;
    });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // In a real app, you might want to show a toast notification here
  };

  const handleCustomGenerate = () => {
    if (!customPrompt.trim()) return;

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const newSuggestion: Suggestion = {
        id: `custom-${Date.now()}`,
        type: activeTab.slice(0, -1) as any, // Remove 's' from the end
        content: customPrompt,
        tags: commentKeywords.slice(0, 3),
      };

      setSuggestions(prev => ({
        ...prev,
        [activeTab]: [newSuggestion, ...prev[activeTab]],
      }));

      setCustomPrompt('');
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Content Ideas
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateContent}
            disabled={isGenerating || !isLiveActive}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Refresh Ideas
              </>
            )}
          </Button>
        </div>
        <CardDescription>AI-powered content suggestions for your stream</CardDescription>

        <div className="flex items-center gap-2 pt-2">
          <Input
            placeholder="Custom idea prompt..."
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            disabled={isGenerating || !isLiveActive}
            className="flex-1"
          />
          <Button
            onClick={handleCustomGenerate}
            disabled={!customPrompt.trim() || isGenerating || !isLiveActive}
          >
            Generate
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLiveActive ? (
          <>
            {commentKeywords.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Trending keywords from comments:
                </p>
                <div className="flex flex-wrap gap-1">
                  {commentKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="topics" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              {Object.keys(suggestions).map(key => (
                <TabsContent key={key} value={key} className="mt-0">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {suggestions[key].map(suggestion => (
                        <div
                          key={suggestion.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{suggestion.content}</p>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleLike(suggestion.id)}
                              >
                                <ThumbsUp
                                  className={`h-4 w-4 ${suggestion.isLiked ? 'fill-primary text-primary' : ''}`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleDislike(suggestion.id)}
                              >
                                <ThumbsDown
                                  className={`h-4 w-4 ${suggestion.isDisliked ? 'fill-destructive text-destructive' : ''}`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleCopy(suggestion.content)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {suggestion.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <Lightbulb className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Connect to a live stream to get content suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
