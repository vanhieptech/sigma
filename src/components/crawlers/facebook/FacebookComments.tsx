import React from 'react';
import { SocialMediaComment, SocialMediaPost, EngagementAnalysis } from '@/types/crawler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FacebookCommentsProps {
  post?: SocialMediaPost;
  comments: SocialMediaComment[];
  analysis?: EngagementAnalysis;
  loading: boolean;
}

export function FacebookComments({ post, comments, analysis, loading }: FacebookCommentsProps) {
  // Group comments by parent
  const topLevelComments = comments.filter(comment => !comment.parentCommentId);
  const repliesByParent = new Map<string, SocialMediaComment[]>();
  
  comments.forEach(comment => {
    if (comment.parentCommentId) {
      const replies = repliesByParent.get(comment.parentCommentId) || [];
      replies.push(comment);
      repliesByParent.set(comment.parentCommentId, replies);
    }
  });
  
  // Sort comments by date (newest first)
  const sortedComments = [...topLevelComments].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading comments...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while we fetch the comments...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!post && comments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No comments found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Start a crawl job to see comments here.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Tabs defaultValue="comments">
      <TabsList className="mb-4">
        <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
        <TabsTrigger value="influencers">Top Influencers</TabsTrigger>
        <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
      </TabsList>
      
      <TabsContent value="comments">
        <Card>
          <CardHeader>
            <CardTitle>
              {post?.content ? post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '') : 'Facebook Post'}
            </CardTitle>
            {post && (
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">
                  {post.metrics.likes} Likes
                </Badge>
                <Badge variant="secondary">
                  {post.metrics.comments} Comments
                </Badge>
                <Badge variant="secondary">
                  {post.metrics.shares} Shares
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedComments.map(comment => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {comment.authorName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{comment.authorName}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(comment.publishedAt).toLocaleString()}
                      </div>
                      <div className="mt-1">{comment.content}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {comment.metrics.likes} Likes
                        </span>
                        <span className="text-sm text-gray-500">
                          {comment.metrics.replies} Replies
                        </span>
                      </div>
                      
                      {/* Display hashtags and mentions */}
                      {(comment.hashtags.length > 0 || comment.mentions.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {comment.hashtags.map(tag => (
                            <Badge key={tag} variant="outline">#{tag}</Badge>
                          ))}
                          {comment.mentions.map(mention => (
                            <Badge key={mention} variant="outline">@{mention}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Display replies */}
                  {repliesByParent.has(comment.id) && (
                    <div className="pl-10 space-y-2 mt-2">
                      {repliesByParent.get(comment.id)!.map(reply => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            {reply.authorName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{reply.authorName}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(reply.publishedAt).toLocaleString()}
                            </div>
                            <div className="mt-1 text-sm">{reply.content}</div>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {reply.metrics.likes} Likes
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="stats">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{comments.length}</div>
                <div className="text-sm text-gray-500">Total Comments</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  {new Set(comments.map(c => c.authorId)).size}
                </div>
                <div className="text-sm text-gray-500">Unique Users</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  {analysis?.engagementRate.toFixed(2) || 0}
                </div>
                <div className="text-sm text-gray-500">Engagement Rate</div>
              </div>
            </div>
            
            {analysis?.activityTimeline && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Activity Timeline</h3>
                <div className="h-40 relative">
                  {/* Simple bar chart for activity */}
                  <div className="flex h-full items-end space-x-1">
                    {analysis.activityTimeline.map((day, i) => {
                      const maxCount = Math.max(...analysis.activityTimeline.map(d => d.commentCount));
                      const height = (day.commentCount / maxCount) * 100;
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs mt-1 transform -rotate-45 origin-top-left">
                            {new Date(day.date).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="influencers">
        <Card>
          <CardHeader>
            <CardTitle>Top Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis?.topInfluencers && (
              <div className="space-y-4">
                {analysis.topInfluencers.map((influencer, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {influencer.authorName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{influencer.authorName}</div>
                      <div className="text-sm text-gray-500">
                        {influencer.commentCount} comments, {influencer.totalLikes} likes
                      </div>
                    </div>
                    <Badge variant="secondary">#{i + 1}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="hashtags">
        <Card>
          <CardHeader>
            <CardTitle>Popular Hashtags</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis?.hashtagAnalysis && (
              <div className="flex flex-wrap gap-2">
                {analysis.hashtagAnalysis.map((tag) => (
                  <Badge key={tag.hashtag} className="text-lg py-1 px-3">
                    #{tag.hashtag} <span className="ml-1 text-sm">({tag.count})</span>
                  </Badge>
                ))}
              </div>
            )}
            
            {(!analysis?.hashtagAnalysis || analysis.hashtagAnalysis.length === 0) && (
              <p>No hashtags found in the comments.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 