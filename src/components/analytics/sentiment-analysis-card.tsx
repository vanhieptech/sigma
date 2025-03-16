'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSentimentAnalytics } from '@/hooks/analytics/use-sentiment-analytics';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SmileIcon,
  MehIcon,
  FrownIcon,
  PlusIcon,
  XIcon,
  BarChart2Icon,
  MessageSquareIcon,
} from 'lucide-react';

export function SentimentAnalysisCard() {
  const [activeTab, setActiveTab] = useState('single');
  const [singleComment, setSingleComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const {
    sentimentAnalysis,
    singleSentiment,
    wordCloud,
    isAnalyzing,
    error,
    analyzeComments,
    analyzeSingleComment,
  } = useSentimentAnalytics();

  // Handle single comment analysis
  const handleSingleAnalysis = () => {
    if (singleComment.trim()) {
      analyzeSingleComment(singleComment);
    }
  };

  // Handle multiple comments analysis
  const handleCommentsAnalysis = () => {
    if (comments.length > 0) {
      analyzeComments(comments, true);
    }
  };

  // Add a new comment to the list
  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  // Remove a comment from the list
  const removeComment = (index: number) => {
    setComments(comments.filter((_, i) => i !== index));
  };

  // Get color based on sentiment score
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.33) return 'text-green-500';
    if (sentiment < -0.33) return 'text-red-500';
    return 'text-yellow-500';
  };

  // Get icon based on sentiment score
  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.33) return SmileIcon;
    if (sentiment < -0.33) return FrownIcon;
    return MehIcon;
  };

  // Get label based on sentiment score
  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.33) return 'Positive';
    if (sentiment < -0.33) return 'Negative';
    return 'Neutral';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Analyze the sentiment of comments and feedback</CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">
              <MessageSquareIcon className="h-4 w-4 mr-2" />
              Single Comment
            </TabsTrigger>
            <TabsTrigger value="multiple">
              <BarChart2Icon className="h-4 w-4 mr-2" />
              Multiple Comments
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4 px-6">
          {/* Single Comment Analysis */}
          <TabsContent value="single" className="mt-0">
            <div className="space-y-4">
              <div>
                <Textarea
                  placeholder="Enter a comment to analyze..."
                  value={singleComment}
                  onChange={e => setSingleComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleSingleAnalysis}
                disabled={!singleComment.trim() || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
              </Button>

              {error && <div className="text-red-500 text-sm mt-2">Error: {error}</div>}

              {singleSentiment !== null && (
                <div className="mt-6 border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`p-2 rounded-full ${getSentimentColor(singleSentiment)} bg-opacity-10`}
                    >
                      {React.createElement(getSentimentIcon(singleSentiment), {
                        className: 'h-6 w-6',
                      })}
                    </div>
                    <div>
                      <div className="font-medium">{getSentimentLabel(singleSentiment)}</div>
                      <div className="text-sm text-muted-foreground">
                        Score: {singleSentiment.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium mb-1">Analyzed Comment:</div>
                    <div className="text-muted-foreground italic">"{singleComment}"</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Multiple Comments Analysis */}
          <TabsContent value="multiple" className="mt-0">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addComment}
                  disabled={!newComment.trim()}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-lg">
                <ScrollArea className="h-[200px]">
                  <div className="p-2 space-y-2">
                    {comments.length === 0 ? (
                      <div className="text-center text-muted-foreground p-4">
                        No comments added yet
                      </div>
                    ) : (
                      comments.map((comment, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 border rounded"
                        >
                          <div className="text-sm truncate">{comment}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeComment(index)}
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              <Button
                onClick={handleCommentsAnalysis}
                disabled={comments.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Comments'}
              </Button>

              {error && <div className="text-red-500 text-sm mt-2">Error: {error}</div>}

              {sentimentAnalysis && (
                <div className="mt-4 space-y-4">
                  {/* Overall Sentiment */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Overall Sentiment</h3>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="border rounded p-3 text-center">
                        <div className="text-green-500 font-medium">
                          {sentimentAnalysis.positive}%
                        </div>
                        <div className="text-xs text-muted-foreground">Positive</div>
                      </div>
                      <div className="border rounded p-3 text-center">
                        <div className="text-yellow-500 font-medium">
                          {sentimentAnalysis.neutral}%
                        </div>
                        <div className="text-xs text-muted-foreground">Neutral</div>
                      </div>
                      <div className="border rounded p-3 text-center">
                        <div className="text-red-500 font-medium">
                          {sentimentAnalysis.negative}%
                        </div>
                        <div className="text-xs text-muted-foreground">Negative</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Overall Score: </span>
                        <span className={getSentimentColor(sentimentAnalysis.overallSentiment)}>
                          {sentimentAnalysis.overallSentiment.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {React.createElement(getSentimentIcon(sentimentAnalysis.overallSentiment), {
                          className: `h-5 w-5 ${getSentimentColor(sentimentAnalysis.overallSentiment)}`,
                        })}
                        <span className="text-sm font-medium">
                          {getSentimentLabel(sentimentAnalysis.overallSentiment)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Positive Keywords</h3>
                      <div className="flex flex-wrap gap-1">
                        {sentimentAnalysis.topPositiveKeywords.length > 0 ? (
                          sentimentAnalysis.topPositiveKeywords.map((keyword, index) => (
                            <div
                              key={index}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                            >
                              {keyword}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No positive keywords found
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Negative Keywords</h3>
                      <div className="flex flex-wrap gap-1">
                        {sentimentAnalysis.topNegativeKeywords.length > 0 ? (
                          sentimentAnalysis.topNegativeKeywords.map((keyword, index) => (
                            <div
                              key={index}
                              className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                            >
                              {keyword}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No negative keywords found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Word Cloud */}
                  {wordCloud && wordCloud.length > 0 && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Word Cloud</h3>
                      <div className="flex flex-wrap gap-2">
                        {wordCloud.slice(0, 20).map((item, index) => {
                          // Calculate font size based on count (between 12px and 24px)
                          const maxCount = Math.max(...wordCloud.map(w => w.count));
                          const minSize = 12;
                          const maxSize = 24;
                          const fontSize = minSize + (item.count / maxCount) * (maxSize - minSize);

                          return (
                            <div
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded"
                              style={{ fontSize: `${fontSize}px` }}
                            >
                              {item.word}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
