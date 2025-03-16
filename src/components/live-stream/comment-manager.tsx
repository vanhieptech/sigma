'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { AIConfig, Question, TikTokComment, TikTokEvent, TikTokEventEnum } from '@/types/tiktok';
import {
  AlertCircle,
  Gift,
  Pin,
  PinIcon,
  PinOff,
  Search,
  SkipForward,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  UserPlus,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface CommentManagerProps {
  events: TikTokEvent[];
  aiConfig: AIConfig;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  isConnected: boolean;
  pinComment?: (commentId: string, pinned: boolean) => Promise<void>;
  toggleMute?: (userId: string, muted: boolean) => Promise<void>;
  addQuestion?: (question: string, askedBy: string, askedById: string) => Promise<Question>;
}

// Default moderation filters
const DEFAULT_FILTERS = {
  offensiveLanguage: true,
  spam: true,
  harassment: true,
  inappropriateContent: true,
  promotions: true,
};

// Comment filtration options
const COMMENT_FILTERS = {
  all: 'All Comments',
  questions: 'Questions',
  positive: 'Positive',
  negative: 'Negative',
  fans: 'From Fans',
  flagged: 'Flagged',
};

export function CommentManager({
  events,
  aiConfig,
  updateAIConfig,
  isConnected,
  pinComment,
  toggleMute,
  addQuestion,
}: CommentManagerProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [pinnedCommentId, setPinnedCommentId] = useState<string | null>(null);
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [flaggedComments, setFlaggedComments] = useState<string[]>([]);
  const [ignoredComments, setIgnoredComments] = useState<string[]>([]);
  const [moderationFilters, setModerationFilters] = useState(DEFAULT_FILTERS);
  const [questionInput, setQuestionInput] = useState('');

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get comment events
  const commentEvents = useMemo(() => {
    return events
      .filter(event => event.type === 'comment')
      .map(event => ({
        ...event,
        data: event.data as TikTokComment,
      }));
  }, [events]);

  // Apply filters to comments
  const filteredComments = useMemo(() => {
    if (!commentEvents.length) return [];

    // First filter out muted users and ignored comments
    let filtered = commentEvents.filter(event => {
      const comment = event.data;
      return !mutedUsers.includes(comment.userId) && !ignoredComments.includes(comment.comment);
    });

    // Then apply the active filter
    switch (activeFilter) {
      case 'questions':
        filtered = filtered.filter(event => {
          const text = event.data.comment.toLowerCase();
          return (
            text.endsWith('?') ||
            text.includes('what') ||
            text.includes('how') ||
            text.includes('why') ||
            text.includes('when') ||
            text.includes('who') ||
            event.data.isQuestion
          );
        });
        break;
      case 'positive':
        filtered = filtered.filter(event => event.data.sentiment === 'positive');
        break;
      case 'negative':
        filtered = filtered.filter(event => event.data.sentiment === 'negative');
        break;
      case 'fans':
        filtered = filtered.filter(event => event.data.followRole > 0);
        break;
      case 'flagged':
        filtered = filtered.filter(event => flaggedComments.includes(event.data.comment));
        break;
    }

    // Apply search filter if needed
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.data.comment.toLowerCase().includes(query) ||
          event.data.nickname.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [commentEvents, activeFilter, searchQuery, mutedUsers, ignoredComments, flaggedComments]);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [filteredComments, autoScroll]);

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Handle comment pin
  const handlePinComment = async (commentId: string, comment: TikTokComment) => {
    const isPinned = pinnedCommentId === commentId;

    if (isPinned) {
      setPinnedCommentId(null);
      if (pinComment) {
        try {
          await pinComment(commentId, false);
        } catch (error) {
          console.error('Error unpinning comment:', error);
        }
      }
    } else {
      setPinnedCommentId(commentId);
      if (pinComment) {
        try {
          await pinComment(commentId, true);
        } catch (error) {
          console.error('Error pinning comment:', error);
        }
      }
    }
  };

  // Handle user mute
  const handleMuteUser = async (userId: string, nickname: string) => {
    if (mutedUsers.includes(userId)) {
      setMutedUsers(prev => prev.filter(id => id !== userId));
      if (toggleMute) {
        try {
          await toggleMute(userId, false);
        } catch (error) {
          console.error('Error unmuting user:', error);
        }
      }
    } else {
      setMutedUsers(prev => [...prev, userId]);
      if (toggleMute) {
        try {
          await toggleMute(userId, true);
        } catch (error) {
          console.error('Error muting user:', error);
        }
      }
    }
  };

  // Flag a comment
  const handleFlagComment = (commentText: string) => {
    if (flaggedComments.includes(commentText)) {
      setFlaggedComments(prev => prev.filter(c => c !== commentText));
    } else {
      setFlaggedComments(prev => [...prev, commentText]);
    }
  };

  // Ignore a comment
  const handleIgnoreComment = (commentText: string) => {
    setIgnoredComments(prev => [...prev, commentText]);
  };

  // Add to questions
  const handleAddQuestion = async (comment: TikTokComment) => {
    if (addQuestion) {
      try {
        await addQuestion(comment.comment, comment.nickname, comment.userId);
      } catch (error) {
        console.error('Error adding question:', error);
      }
    }
  };

  // Clear all moderation actions
  const clearModeration = () => {
    setPinnedCommentId(null);
    setMutedUsers([]);
    setFlaggedComments([]);
    setIgnoredComments([]);
  };

  // Get sentiment badge
  const getSentimentBadge = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    if (!sentiment) return null;

    switch (sentiment) {
      case 'positive':
        return (
          <Badge className="bg-green-500 text-white">
            <ThumbsUp className="h-3 w-3 mr-1" />
            Positive
          </Badge>
        );
      case 'negative':
        return (
          <Badge className="bg-red-500 text-white">
            <ThumbsDown className="h-3 w-3 mr-1" />
            Negative
          </Badge>
        );
      case 'neutral':
        return <Badge variant="outline">Neutral</Badge>;
    }
  };

  // Get priority indicator
  const getPriorityIndicator = (priority?: number) => {
    if (!priority) return null;

    if (priority > 8) {
      return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
    } else if (priority > 5) {
      return <Star className="h-4 w-4 text-yellow-500" />;
    }

    return null;
  };

  const handleAddQuestionToStream = () => {
    if (questionInput.trim()) {
      addQuestion?.(questionInput.trim(), '', '');
      setQuestionInput('');
    }
  };

  const renderEventContent = (event: TikTokEvent) => {
    switch (event.type) {
      case TikTokEventEnum.Comment:
        const comment = event.data as TikTokComment;
        const isCommentPinned = pinnedCommentId === comment.userId + comment.timestamp;
        const isUserMuted = mutedUsers.includes(comment.userId);

        return (
          <div
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg',
              isCommentPinned ? 'bg-primary/10' : 'hover:bg-muted/50'
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  comment.profilePictureUrl ||
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${comment.userId}`
                }
              />
              <AvatarFallback>{comment.nickname?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.nickname || 'User'}</span>
                {comment.followRole > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Follower
                  </Badge>
                )}
                {comment.isModerator && <Badge className="bg-blue-500 text-xs h-4 px-1">Mod</Badge>}
                {isUserMuted && (
                  <Badge variant="destructive" className="text-xs h-4 px-1">
                    Muted
                  </Badge>
                )}
              </div>
              <p className={cn('text-sm', isUserMuted && 'line-through text-muted-foreground')}>
                {comment.comment}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handlePinComment(comment.userId + comment.timestamp, comment)}
              >
                {isCommentPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleMuteUser(comment.userId, comment.nickname || '')}
              >
                {isUserMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        );

      case TikTokEventEnum.Gift:
        const gift = event.data as any;
        return (
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  gift.profilePictureUrl ||
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${gift.userId}`
                }
              />
              <AvatarFallback>{gift.nickname?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{gift.nickname || 'User'}</span>
                <Badge variant="secondary" className="text-xs">
                  Gift
                </Badge>
              </div>
              <p className="text-sm">
                Sent {gift.repeatCount || 1}x {gift.giftName || 'gift'}
                {gift.diamondCount ? ` (${gift.diamondCount} diamonds)` : ''}
              </p>
            </div>
            <Gift className="h-5 w-5 text-pink-500" />
          </div>
        );

      case TikTokEventEnum.Follow:
        const follow = event.data as any;
        return (
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  follow.profilePictureUrl ||
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${follow.userId}`
                }
              />
              <AvatarFallback>{follow.nickname?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{follow.nickname || 'User'}</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 text-xs">
                  New Follower
                </Badge>
              </div>
              <p className="text-sm">Started following you</p>
            </div>
            <UserPlus className="h-5 w-5 text-blue-500" />
          </div>
        );

      case TikTokEventEnum.Member:
        const join = event.data as any;
        return (
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  join.profilePictureUrl ||
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${join.userId}`
                }
              />
              <AvatarFallback>{join.nickname?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{join.nickname || 'User'}</span>
              </div>
              <p className="text-sm">Joined the stream</p>
            </div>
            <User className="h-5 w-5 text-green-500" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Live Comments</span>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? `${commentEvents.length} Comments` : 'Disconnected'}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAutoScroll(!autoScroll)}
              className={autoScroll ? 'text-primary' : 'text-muted-foreground'}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Monitor and moderate your live stream comments</CardDescription>
      </CardHeader>

      <div className="px-6 py-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(COMMENT_FILTERS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="comments" className="flex-1 flex flex-col px-6">
        <TabsList className="self-start">
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent
          value="comments"
          className="flex-1 pt-2 data-[state=active]:flex data-[state=active]:flex-col"
        >
          {pinnedCommentId && (
            <div className="border rounded-md mb-2 p-3 bg-muted/50">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="gap-1">
                  <PinIcon className="h-3 w-3" />
                  Pinned Comment
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setPinnedCommentId(null)}
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>

              {commentEvents.find(
                event => event.data.userId + event.data.timestamp === pinnedCommentId
              )?.data && (
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={
                        commentEvents.find(
                          event => event.data.userId + event.data.timestamp === pinnedCommentId
                        )?.data.profilePictureUrl
                      }
                    />
                    <AvatarFallback>
                      {commentEvents
                        .find(event => event.data.userId + event.data.timestamp === pinnedCommentId)
                        ?.data.nickname.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {
                        commentEvents.find(
                          event => event.data.userId + event.data.timestamp === pinnedCommentId
                        )?.data.nickname
                      }
                    </div>
                    <p className="text-sm">
                      {
                        commentEvents.find(
                          event => event.data.userId + event.data.timestamp === pinnedCommentId
                        )?.data.comment
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 border rounded-md overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full">
              {filteredComments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">No comments to display</p>
                  <p className="text-xs text-muted-foreground">
                    {isConnected
                      ? 'Comments will appear here when viewers start chatting'
                      : 'Connect to a live stream to see comments'}
                  </p>
                </div>
              ) : (
                <div className="p-3 space-y-1">
                  {filteredComments.map(event => {
                    const comment = event.data;
                    const commentId = comment.userId + comment.timestamp;
                    const isPinned = pinnedCommentId === commentId;
                    const isFlagged = flaggedComments.includes(comment.comment);
                    const isMuted = mutedUsers.includes(comment.userId);

                    return (
                      <div
                        key={commentId}
                        className={`flex items-start py-2 px-2 hover:bg-muted/50 rounded-md transition-colors relative ${
                          isPinned ? 'bg-muted/70' : ''
                        } ${isFlagged ? 'bg-red-50 dark:bg-red-950/20' : ''}`}
                      >
                        {renderEventContent(event)}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="moderation" className="pt-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Comment Moderation</h3>
              <Button variant="outline" size="sm" onClick={clearModeration} className="h-8">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Muted Users</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  {mutedUsers.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-2">No muted users</div>
                  ) : (
                    <ScrollArea className="h-32">
                      <div className="space-y-1">
                        {mutedUsers.map(userId => {
                          const userComment = commentEvents.find(
                            event => event.data.userId === userId
                          );

                          if (!userComment) return null;

                          return (
                            <div key={userId} className="flex items-center justify-between py-1">
                              <div className="flex items-center">
                                <Avatar className="h-5 w-5 mr-2">
                                  <AvatarImage src={userComment.data.profilePictureUrl} />
                                  <AvatarFallback>
                                    {userComment.data.nickname.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm truncate max-w-[100px]">
                                  {userComment.data.nickname}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleMuteUser(userId, userComment.data.nickname)}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Flagged Comments</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  {flaggedComments.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-2">No flagged comments</div>
                  ) : (
                    <ScrollArea className="h-32">
                      <div className="space-y-1">
                        {flaggedComments.map((comment, index) => (
                          <div key={index} className="flex items-center justify-between py-1">
                            <span className="text-sm truncate max-w-[150px]">{comment}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleFlagComment(comment)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Auto-Moderation Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Filtered Content</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="space-y-2">
                    {Object.entries(moderationFilters).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`filter-${key}`} className="text-sm cursor-pointer">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={`filter-${key}`}
                          checked={value}
                          onCheckedChange={checked => {
                            setModerationFilters({
                              ...moderationFilters,
                              [key]: checked,
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">AI Comment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="comment-prioritization" className="text-sm cursor-pointer">
                        Comment Prioritization
                      </Label>
                      <Switch
                        id="comment-prioritization"
                        checked={aiConfig.commentPrioritization}
                        onCheckedChange={checked => {
                          updateAIConfig({ commentPrioritization: checked });
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="sentiment-analysis" className="text-sm cursor-pointer">
                        Sentiment Analysis
                      </Label>
                      <Switch
                        id="sentiment-analysis"
                        checked={aiConfig.sentimentAnalysis}
                        onCheckedChange={checked => {
                          updateAIConfig({ sentimentAnalysis: checked });
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-moderation" className="text-sm cursor-pointer">
                        Auto-Moderation
                      </Label>
                      <Switch
                        id="auto-moderation"
                        checked={aiConfig.autoModeration}
                        onCheckedChange={checked => {
                          updateAIConfig({ autoModeration: checked });
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-translation" className="text-sm cursor-pointer">
                        Auto-Translation
                      </Label>
                      <Switch
                        id="auto-translation"
                        checked={aiConfig.autoTranslation}
                        onCheckedChange={checked => {
                          updateAIConfig({ autoTranslation: checked });
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className="border-t pt-4">
        <div className="w-full flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredComments.length} of {commentEvents.length} comments shown
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('')}
              disabled={!searchQuery}
            >
              Clear Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter('all')}
              disabled={activeFilter === 'all'}
            >
              Show All
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
