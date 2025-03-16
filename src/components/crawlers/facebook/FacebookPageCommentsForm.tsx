'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SocialMediaComment } from '@/types/crawler';
import { InfoIcon, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { FacebookLoginButton } from '@/components/auth/FacebookLoginButton';
import { CheckCircle2 } from 'lucide-react';

export function FacebookPageCommentsForm() {
  const [url, setUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [comments, setComments] = useState<SocialMediaComment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [pageAccessToken, setPageAccessToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Add a state for tracking if the user is authenticated with Facebook
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setComments([]);
    setNextCursor(undefined);
    setPageAccessToken(null);

    if (!url.trim()) {
      setError('Please enter a Facebook post URL');
      return;
    }

    if (!accessToken.trim()) {
      setError('Please enter your Facebook access token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/crawlers/facebook/page-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postUrl: url,
          userAccessToken: accessToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.error || 'Failed to fetch comments';

        // Provide more user-friendly error messages
        if (data.error?.includes('New Pages experience')) {
          errorMessage =
            "This Page uses the New Pages Experience. We've updated our code to handle this, but you may need to get additional permissions or use a different access token. Try refreshing and trying again.";
        } else if (data.error?.includes('OAuthException')) {
          errorMessage =
            'Authentication error: Your access token may be invalid or expired. Please try logging in again.';
        } else if (data.error?.includes('permissions error')) {
          errorMessage =
            'You don\'t have the required permissions. Make sure you\'ve granted "pages_read_engagement" permission when logging in.';
        }

        setError(errorMessage);
        setLoading(false);
        return;
      }

      setComments(data.comments);
      setNextCursor(data.nextCursor);
      setPageAccessToken(data.pageAccessToken);
      setSuccess(true);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (!pageAccessToken || !nextCursor) return;

    setLoadingMore(true);
    setError(null);

    try {
      const response = await fetch('/api/crawlers/facebook/page-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postUrl: url,
          userAccessToken: accessToken,
          pageAccessToken: pageAccessToken,
          limit: 100,
          cursor: nextCursor,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComments(prev => [...prev, ...data.comments]);
        setNextCursor(data.nextCursor);
      } else {
        setError(data.error || 'Failed to fetch more comments');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching more comments');
    } finally {
      setLoadingMore(false);
    }
  };

  const exportToCsv = () => {
    if (comments.length === 0) return;

    // Create CSV content
    const headers = [
      'ID',
      'Author Name',
      'Author ID',
      'Content',
      'Published At',
      'Likes',
      'Replies',
      'Parent Comment ID',
    ];
    const csvContent = [
      headers.join(','),
      ...comments.map(comment =>
        [
          comment.id,
          `"${comment.authorName.replace(/"/g, '""')}"`,
          comment.authorId,
          `"${comment.content.replace(/"/g, '""')}"`,
          comment.publishedAt.toISOString(),
          comment.metrics.likes,
          comment.metrics.replies,
          comment.parentCommentId || '',
        ].join(',')
      ),
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `facebook-comments-${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAccessTokenReceived = (token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Facebook Page Comments</CardTitle>
        <CardDescription>
          Fetch comments from a Facebook post using your page admin access
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="url" className="text-sm font-medium">
                Facebook Post URL
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Enter the full URL of a Facebook post from a page you manage
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="url"
              placeholder="https://www.facebook.com/pagename/posts/123456789"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Facebook Authentication</Label>

            {!isAuthenticated ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm mb-4">
                    Connect with Facebook to get an access token automatically. This will allow
                    access to comments from pages you manage.
                  </p>
                  <FacebookLoginButton
                    onAccessTokenReceived={handleAccessTokenReceived}
                    buttonText="Connect with Facebook"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or enter token manually
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Connected to Facebook
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAuthenticated(false);
                    setAccessToken('');
                  }}
                >
                  Disconnect
                </Button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="accessToken" className="text-sm font-medium">
                    User Access Token
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Enter your Facebook access token with pages_read_engagement permission
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Enter your Facebook access token"
                  value={accessToken}
                  onChange={e => setAccessToken(e.target.value)}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  <a href="/dashboard/help/access-tokens" className="text-primary hover:underline">
                    Need help getting an access token?
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !url || !accessToken}>
              {loading && <Spinner className="mr-2 h-4 w-4" />}
              Fetch Comments
            </Button>

            {comments.length > 0 && (
              <Button type="button" variant="outline" onClick={exportToCsv}>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </Button>
            )}
          </div>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && comments.length === 0 && (
          <Alert className="mt-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>No Comments Found</AlertTitle>
            <AlertDescription>This post does not have any comments.</AlertDescription>
          </Alert>
        )}

        {comments.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Comments ({comments.length})</h3>
              {nextCursor && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadMoreComments}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Load More
                </Button>
              )}
            </div>

            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="tree">Threaded View</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead className="w-[500px]">Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Replies</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.map(comment => (
                      <TableRow
                        key={comment.id}
                        className={comment.parentCommentId ? 'bg-muted/30' : ''}
                      >
                        <TableCell className="font-medium">
                          {comment.authorName}
                          {comment.parentCommentId && (
                            <span className="ml-2 text-xs text-muted-foreground">(reply)</span>
                          )}
                        </TableCell>
                        <TableCell>{comment.content}</TableCell>
                        <TableCell>{new Date(comment.publishedAt).toLocaleString()}</TableCell>
                        <TableCell>{comment.metrics.likes}</TableCell>
                        <TableCell>{comment.metrics.replies}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="tree">
                <div className="space-y-4">
                  {comments
                    .filter(comment => !comment.parentCommentId)
                    .map(comment => (
                      <CommentThread
                        key={comment.id}
                        comment={comment}
                        replies={comments.filter(c => c.parentCommentId === comment.id)}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CommentThreadProps {
  comment: SocialMediaComment;
  replies: SocialMediaComment[];
}

function CommentThread({ comment, replies }: CommentThreadProps) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          {comment.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.authorName}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.publishedAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-1">{comment.content}</p>
          <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
            <span>{comment.metrics.likes} likes</span>
            <span>{comment.metrics.replies} replies</span>
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-12 mt-4 space-y-4 border-l-2 pl-4">
          {replies.map(reply => (
            <div key={reply.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                {reply.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{reply.authorName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(reply.publishedAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1">{reply.content}</p>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{reply.metrics.likes} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
