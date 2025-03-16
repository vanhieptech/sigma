'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  MessageSquare,
  Gift,
  Heart,
  Share,
  UserPlus,
  Users,
  AlertCircle,
  Loader2,
  Send,
  Settings,
  Volume2,
  VolumeX,
  RefreshCw,
} from 'lucide-react';

import { useTikTokStream } from '@/hooks/use-tiktok-stream';
import { TikTokEvent, TikTokEventType } from '@/types/tiktok';
import { cn } from '@/lib/utils';

type EventDisplayProps = {
  event: TikTokEvent;
};

// Component to render each type of event
const EventDisplay = ({ event }: EventDisplayProps) => {
  const getIcon = (type: TikTokEventType) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'gift':
        return <Gift className="h-4 w-4 mr-2" />;
      case 'like':
        return <Heart className="h-4 w-4 mr-2 text-pink-500" />;
      case 'share':
        return <Share className="h-4 w-4 mr-2 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 mr-2 text-green-500" />;
      case 'member':
        return <Users className="h-4 w-4 mr-2 text-purple-500" />;
      case 'connection':
        return <AlertCircle className="h-4 w-4 mr-2" />;
      case 'aiResponse':
        return <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Render based on event type
  switch (event.type) {
    case 'comment': {
      const data = event.data as any;
      return (
        <div className="flex items-start py-2 px-2 hover:bg-muted/50 rounded-md transition-colors">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={data.profilePictureUrl} alt={data.nickname} />
            <AvatarFallback>{data.nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{data.nickname}</span>
              {data.followRole > 0 && (
                <Badge variant="outline" className="text-xs h-4 px-1">
                  Fan
                </Badge>
              )}
              {data.isModerator && <Badge className="bg-blue-500 text-xs h-4 px-1">Mod</Badge>}
            </div>
            <p className="text-sm break-words">{data.comment}</p>
          </div>
          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
            {formatTimestamp(data.timestamp)}
          </span>
        </div>
      );
    }

    case 'gift': {
      const data = event.data as any;
      return (
        <div className="flex items-start py-2 px-2 bg-amber-50 dark:bg-amber-950/20 rounded-md">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={data.profilePictureUrl} alt={data.nickname} />
            <AvatarFallback>{data.nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{data.nickname}</span>
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-xs">
                Gift
              </Badge>
            </div>
            <p className="text-sm">
              Sent {data.repeatCount > 1 ? `${data.repeatCount}x ` : ''}
              {data.giftName}
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {' '}
                (💎 {data.diamondValue * data.repeatCount})
              </span>
            </p>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            {formatTimestamp(data.timestamp)}
          </span>
        </div>
      );
    }

    case 'like': {
      const data = event.data as any;
      return (
        <div className="flex items-center py-2 px-2 hover:bg-muted/50 rounded-md">
          {getIcon(event.type)}
          <Avatar className="h-5 w-5 mr-2">
            <AvatarImage src={data.profilePictureUrl} alt={data.nickname} />
            <AvatarFallback>{data.nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="text-sm">
              {data.nickname} liked the stream {data.likeCount > 1 ? `${data.likeCount}x` : ''}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimestamp(data.timestamp)}</span>
        </div>
      );
    }

    case 'follow': {
      const data = event.data as any;
      return (
        <div className="flex items-center py-2 px-2 hover:bg-muted/50 rounded-md">
          {getIcon(event.type)}
          <Avatar className="h-5 w-5 mr-2">
            <AvatarImage src={data.profilePictureUrl} alt={data.nickname} />
            <AvatarFallback>{data.nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="text-sm">{data.nickname} followed</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimestamp(data.timestamp)}</span>
        </div>
      );
    }

    case 'share': {
      const data = event.data as any;
      return (
        <div className="flex items-center py-2 px-2 hover:bg-muted/50 rounded-md">
          {getIcon(event.type)}
          <Avatar className="h-5 w-5 mr-2">
            <AvatarImage src={data.profilePictureUrl} alt={data.nickname} />
            <AvatarFallback>{data.nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="text-sm">{data.nickname} shared the stream</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimestamp(data.timestamp)}</span>
        </div>
      );
    }

    case 'member': {
      const data = event.data as any;
      return (
        <div className="flex items-center py-2 px-2 hover:bg-muted/50 rounded-md">
          {getIcon(event.type)}
          <Avatar className="h-5 w-5 mr-2">
            <AvatarImage src={data.profilePictureUrl} alt={data.nickname} />
            <AvatarFallback>{data.nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="text-sm">
              {data.nickname} {data.joinType === 1 ? 'joined' : 'rejoined'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimestamp(data.timestamp)}</span>
        </div>
      );
    }

    case 'viewerCount': {
      const data = event.data as any;
      return (
        <div className="flex items-center py-2 px-2 text-muted-foreground text-xs">
          <Users className="h-3 w-3 mr-1" />
          <span>Viewers: {data.viewerCount.toLocaleString()}</span>
        </div>
      );
    }

    case 'connection': {
      const data = event.data as any;
      return (
        <div className="flex items-center py-2 px-2 text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span
            className={cn(
              data.state === 'CONNECTED'
                ? 'text-green-600 dark:text-green-400'
                : data.state === 'CONNECTING'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
            )}
          >
            {data.state}: {data.targetUniqueId || ''}
            {data.serverError && ` (Error: ${data.serverError})`}
          </span>
        </div>
      );
    }

    case 'aiResponse': {
      const data = event.data as any;
      return (
        <div className="flex items-start py-2 px-2 bg-blue-50 dark:bg-blue-950/20 rounded-md">
          <Avatar className="h-6 w-6 mr-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">AI Assistant</span>
              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-xs">
                Bot
              </Badge>
            </div>
            <p className="text-sm">{data.text}</p>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            {formatTimestamp(data.timestamp)}
          </span>
        </div>
      );
    }

    default:
      return null;
  }
};

export default function LiveStreamPanel() {
  const [username, setUsername] = useState<string>('');
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    events,
    connectionState,
    viewerCount,
    aiConfig,
    updateAIConfig,
    connect,
    disconnect,
    isConnected,
  } = useTikTokStream();

  // Debug log for events and connection state
  useEffect(() => {
    console.log('LiveStreamPanel - Events updated:', events.length, events);
    console.log('LiveStreamPanel - Connection state:', connectionState);
  }, [events, connectionState]);

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [events]);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username.trim());
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>TikTok Live Stream</span>
          {isConnected && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex gap-1 items-center">
                <Users className="h-3 w-3" /> {viewerCount}
              </Badge>
              <Badge
                variant={connectionState.state === 'CONNECTED' ? 'default' : 'destructive'}
                className="capitalize"
              >
                {connectionState.state.toLowerCase()}
              </Badge>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Connect to a TikTok live stream to see real-time events and engage with viewers
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="stream" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="stream">Stream</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="stream" className="space-y-4">
            {!isConnected ? (
              <form onSubmit={handleConnect} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="TikTok username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!username.trim() || connectionState.state === 'CONNECTING'}
                >
                  {connectionState.state === 'CONNECTING' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium mr-1">Connected to:</span>
                  <span className="text-primary">{connectionState.targetUniqueId}</span>
                </div>
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            )}

            <div className="border rounded-md h-[500px] flex flex-col">
              <ScrollArea ref={scrollAreaRef} className="flex-1">
                <div className="p-3 space-y-1">
                  {events.length > 0 ? (
                    events.map((event, index) => <EventDisplay key={index} event={event} />)
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mb-2 opacity-20" />
                      <p className="text-lg">No events yet</p>
                      <p className="text-sm">Connect to a TikTok live stream to see events</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">AI Response Settings</h3>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-ai" className="font-medium">
                        Enable AI Responses
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        AI will respond to stream events
                      </p>
                    </div>
                    <Switch
                      id="enable-ai"
                      checked={aiConfig.enableAIResponses}
                      onCheckedChange={checked => updateAIConfig({ enableAIResponses: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-3">
                    <h4 className="text-sm font-medium">Respond to Event Types</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="respond-comments">Comments</Label>
                        <Switch
                          id="respond-comments"
                          checked={aiConfig.respondToComments}
                          onCheckedChange={checked =>
                            updateAIConfig({ respondToComments: checked })
                          }
                          disabled={!aiConfig.enableAIResponses}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="respond-gifts">Gifts</Label>
                        <Switch
                          id="respond-gifts"
                          checked={aiConfig.respondToGifts}
                          onCheckedChange={checked => updateAIConfig({ respondToGifts: checked })}
                          disabled={!aiConfig.enableAIResponses}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="respond-follows">Follows</Label>
                        <Switch
                          id="respond-follows"
                          checked={aiConfig.respondToFollows}
                          onCheckedChange={checked => updateAIConfig({ respondToFollows: checked })}
                          disabled={!aiConfig.enableAIResponses}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="respond-likes">Likes</Label>
                        <Switch
                          id="respond-likes"
                          checked={aiConfig.respondToLikes}
                          onCheckedChange={checked => updateAIConfig({ respondToLikes: checked })}
                          disabled={!aiConfig.enableAIResponses}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="respond-shares">Shares</Label>
                        <Switch
                          id="respond-shares"
                          checked={aiConfig.respondToShares}
                          onCheckedChange={checked => updateAIConfig({ respondToShares: checked })}
                          disabled={!aiConfig.enableAIResponses}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="respond-joins">Joins</Label>
                        <Switch
                          id="respond-joins"
                          checked={aiConfig.respondToJoins}
                          onCheckedChange={checked => updateAIConfig({ respondToJoins: checked })}
                          disabled={!aiConfig.enableAIResponses}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Response Thresholds</h4>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="gift-threshold">Gift Diamond Threshold</Label>
                        <span className="text-sm text-muted-foreground">
                          {aiConfig.giftThreshold} 💎
                        </span>
                      </div>
                      <Slider
                        id="gift-threshold"
                        min={10}
                        max={1000}
                        step={10}
                        value={[aiConfig.giftThreshold]}
                        onValueChange={value => updateAIConfig({ giftThreshold: value[0] })}
                        disabled={!aiConfig.enableAIResponses || !aiConfig.respondToGifts}
                      />
                      <p className="text-xs text-muted-foreground">
                        Only respond to gifts worth at least this many diamonds
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="like-threshold">Like Count Threshold</Label>
                        <span className="text-sm text-muted-foreground">
                          {aiConfig.likeThreshold} ❤️
                        </span>
                      </div>
                      <Slider
                        id="like-threshold"
                        min={1}
                        max={20}
                        step={1}
                        value={[aiConfig.likeThreshold]}
                        onValueChange={value => updateAIConfig({ likeThreshold: value[0] })}
                        disabled={!aiConfig.enableAIResponses || !aiConfig.respondToLikes}
                      />
                      <p className="text-xs text-muted-foreground">
                        Only respond to like events with at least this many likes
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="join-rate">Join Response Rate</Label>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(aiConfig.joinResponseRate * 100)}%
                        </span>
                      </div>
                      <Slider
                        id="join-rate"
                        min={0}
                        max={1}
                        step={0.05}
                        value={[aiConfig.joinResponseRate]}
                        onValueChange={value => updateAIConfig({ joinResponseRate: value[0] })}
                        disabled={!aiConfig.enableAIResponses || !aiConfig.respondToJoins}
                      />
                      <p className="text-xs text-muted-foreground">
                        Percentage of join events that will receive a response
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Audio Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-audio" className="font-medium">
                        Enable Audio
                      </Label>
                      <p className="text-sm text-muted-foreground">Play sounds for events</p>
                    </div>
                    <Switch
                      id="enable-audio"
                      checked={isAudioEnabled}
                      onCheckedChange={setIsAudioEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="volume">Volume</Label>
                      <div className="flex items-center">
                        {isAudioEnabled ? (
                          <Volume2 className="h-4 w-4 mr-2" />
                        ) : (
                          <VolumeX className="h-4 w-4 mr-2" />
                        )}
                        <span className="text-sm text-muted-foreground">{volume}%</span>
                      </div>
                    </div>
                    <Slider
                      id="volume"
                      min={0}
                      max={100}
                      step={5}
                      value={[volume]}
                      onValueChange={value => setVolume(value[0])}
                      disabled={!isAudioEnabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Stream Statistics</h3>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="h-3 w-3" /> Refresh
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Total Viewers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{viewerCount.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Peak Viewers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {(viewerCount + Math.floor(Math.random() * 100)).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">New Follows</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {events.filter(e => e.type === 'follow').length}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Total Likes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {events
                        .filter(e => e.type === 'like')
                        .reduce((sum, event) => sum + ((event.data as any).likeCount || 0), 0)
                        .toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="col-span-2">
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Total Diamonds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {events
                        .filter(e => e.type === 'gift')
                        .reduce((sum, event) => {
                          const gift = event.data as any;
                          return sum + (gift.diamondValue * gift.repeatCount || 0);
                        }, 0)
                        .toLocaleString()}{' '}
                      💎
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-2">Top Gifters</h4>
                <div className="space-y-2">
                  {isConnected ? (
                    // Get unique gifters, sort by total diamond value, take top 5
                    Array.from(
                      events
                        .filter(e => e.type === 'gift')
                        .reduce((map, event) => {
                          const gift = event.data as any;
                          const userId = gift.userId;
                          const existingUser = map.get(userId) || {
                            userId,
                            nickname: gift.nickname,
                            profilePictureUrl: gift.profilePictureUrl,
                            totalDiamonds: 0,
                          };

                          existingUser.totalDiamonds += gift.diamondValue * gift.repeatCount;
                          map.set(userId, existingUser);
                          return map;
                        }, new Map())
                        .values()
                    )
                      .sort((a, b) => b.totalDiamonds - a.totalDiamonds)
                      .slice(0, 5)
                      .map((gifter, index) => (
                        <div
                          key={gifter.userId}
                          className="flex items-center justify-between p-2 bg-muted/40 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{index + 1}.</span>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={gifter.profilePictureUrl} alt={gifter.nickname} />
                              <AvatarFallback>{gifter.nickname.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{gifter.nickname}</span>
                          </div>
                          <Badge variant="outline" className="ml-auto font-mono">
                            {gifter.totalDiamonds.toLocaleString()} 💎
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Connect to a stream to see top gifters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" /> Advanced
        </Button>
        <div className="text-xs text-muted-foreground">Stream events: {events.length}</div>
      </CardFooter>
    </Card>
  );
}
