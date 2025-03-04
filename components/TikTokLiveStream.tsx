"use client";

import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ReactAudioPlayer from 'react-audio-player';
import { io, Socket } from 'socket.io-client';
import { 
  TikTokComment, 
  TikTokGift, 
  TikTokLike,
  TikTokShare,
  TikTokFollow,
  TikTokMember,
  TikTokViewerCount,
  TikTokConnectionState
} from '@/lib/tiktok-live';
import { 
  MessageSquare, 
  Gift, 
  Heart,
  Share,
  UserPlus,
  Users,
  UserPlus2,
  AlertCircle, 
  Loader2, 
  Send,
  Volume2,
  VolumeX,
  Settings,
  BrainCircuit
} from 'lucide-react';

interface AIResponse {
  event: string;
  text: string;
  audioUrl?: string;
  userData: {
    userId: string;
    uniqueId: string;
    nickname: string;
  };
  timestamp: number;
}

interface AIConfig {
  enableAIResponses: boolean;
  respondToComments: boolean;
  respondToGifts: boolean;
  respondToLikes: boolean;
  respondToFollows: boolean;
  respondToShares: boolean;
  respondToJoins: boolean;
  respondToPurchases: boolean;
  giftThreshold: number;
  likeThreshold: number;
  joinResponseRate: number;
}

let socket: Socket | null = null;

export default function TikTokLiveStream() {
  const [username, setUsername] = useState('');
  const [connectionState, setConnectionState] = useState<TikTokConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null
  });

  // Event states
  const [comments, setComments] = useState<TikTokComment[]>([]);
  const [gifts, setGifts] = useState<TikTokGift[]>([]);
  const [likes, setLikes] = useState<TikTokLike[]>([]);
  const [shares, setShares] = useState<TikTokShare[]>([]);
  const [follows, setFollows] = useState<TikTokFollow[]>([]);
  const [members, setMembers] = useState<TikTokMember[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  
  // AI states
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    enableAIResponses: true,
    respondToComments: true,
    respondToGifts: true,
    respondToLikes: true,
    respondToFollows: true,
    respondToShares: true,
    respondToJoins: true,
    respondToPurchases: true,
    giftThreshold: 10,
    likeThreshold: 5,
    joinResponseRate: 20
  });
  const [audioVolume, setAudioVolume] = useState<number>(80);
  const [showAISettings, setShowAISettings] = useState<boolean>(false);

  const { toast } = useToast();
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const aiResponsesEndRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<ReactAudioPlayer>(null);

  useEffect(() => {
    if (!socket) {
      socket = io({
        path: '/api/socket/io',
        addTrailingSlash: false,
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socket.on('connect', () => {
        console.log('Socket connected:', socket?.id);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnectionState({
          isConnected: false,
          isConnecting: false,
          error: 'Failed to connect to server'
        });
        toast({
          title: "Connection Error",
          description: "Failed to connect to server",
          variant: "destructive"
        });
      });

      socket.on('error', (state: TikTokConnectionState) => {
        console.error('TikTok connection error:', state.error);
        setConnectionState(state);
        if (state.error) {
          toast({
            title: "Connection Error",
            description: state.error,
            variant: "destructive"
          });
        }
      });

      socket.on('connected', (state: TikTokConnectionState) => {
        console.log('TikTok connected:', state);
        setConnectionState(state);
        if (state.isConnected) {
          toast({
            title: "Connected!",
            description: `Successfully connected to @${username}'s live stream`
          });
          
          // Send AI configuration
          if (socket) {
            socket.emit('updateAIConfig', aiConfig);
          }
        }
      });

      socket.on('disconnected', (state: TikTokConnectionState) => {
        console.log('TikTok disconnected:', state);
        setConnectionState(state);
        toast({
          title: "Disconnected",
          description: `Disconnected from @${username}'s live stream`
        });
      });

      // Handle AI responses
      socket.on('aiResponse', (response: AIResponse) => {
        console.log('AI response:', response);
        setAiResponses(prev => [...prev, response].slice(-50)); // Keep last 50 responses
        
        // Play audio if available
        if (response.audioUrl && !isAudioPlaying) {
          setCurrentAudio(response.audioUrl);
          setIsAudioPlaying(true);
        }
      });

      // Handle chat messages
      socket.on('chat', (data: TikTokComment) => {
        setComments(prev => [...prev, data].slice(-100)); // Keep last 100 comments
      });

      // Handle gifts
      socket.on('gift', (data: TikTokGift) => {
        if (data.diamondCount > 0) { // Only track gifts that cost diamonds
          setGifts(prev => [...prev, data].slice(-50)); // Keep last 50 gifts
        }
      });

      // Handle likes
      socket.on('like', (data: TikTokLike) => {
        setLikes(prev => [...prev, data].slice(-50)); // Keep last 50 likes
        setTotalLikes(data.totalLikeCount);
      });

      // Handle shares
      socket.on('share', (data: TikTokShare) => {
        setShares(prev => [...prev, data].slice(-50)); // Keep last 50 shares
      });

      // Handle follows
      socket.on('follow', (data: TikTokFollow) => {
        setFollows(prev => [...prev, data].slice(-50)); // Keep last 50 follows
      });

      // Handle member joins
      socket.on('member', (data: TikTokMember) => {
        setMembers(prev => [...prev, data].slice(-50)); // Keep last 50 member joins
      });

      // Handle viewer count updates
      socket.on('roomUser', (data: TikTokViewerCount) => {
        setViewerCount(data.viewerCount);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('connect_error');
        socket.off('error');
        socket.off('connected');
        socket.off('disconnected');
        socket.off('aiResponse');
        socket.off('chat');
        socket.off('gift');
        socket.off('like');
        socket.off('share');
        socket.off('follow');
        socket.off('member');
        socket.off('roomUser');
        socket.disconnect();
        socket = null;
      }
    };
  }, [toast, aiConfig]);

  // Auto-scroll comments
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  // Auto-scroll AI responses
  useEffect(() => {
    if (aiResponsesEndRef.current) {
      aiResponsesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponses]);

  // Handle audio playback
  useEffect(() => {
    if (audioPlayerRef.current && currentAudio) {
      const audioEl = audioPlayerRef.current.audioEl.current;
      if (audioEl) {
        audioEl.volume = audioVolume / 100;
        
        // Set up event listeners
        const handleEnded = () => {
          setIsAudioPlaying(false);
          setCurrentAudio(null);
        };
        audioEl.addEventListener('ended', handleEnded);
        
        // Clean up
        return () => {
          audioEl.removeEventListener('ended', handleEnded);
        };
      }
    }
  }, [currentAudio, audioVolume]);

  const connectToUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !socket) return;

    // Reset all states
    setComments([]);
    setGifts([]);
    setLikes([]);
    setShares([]);
    setFollows([]);
    setMembers([]);
    setViewerCount(0);
    setTotalLikes(0);
    setAiResponses([]);
    
    setConnectionState({
      isConnected: false,
      isConnecting: true,
      error: null
    });

    // Emit connectToUser event with username
    socket.emit('connectToUser', { username });
  };

  const disconnectFromLiveStream = () => {
    if (!socket) return;

    // Emit disconnect event with current username
    socket.emit('disconnect', { username });
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      error: null
    });

    // Reset all states
    setComments([]);
    setGifts([]);
    setLikes([]);
    setShares([]);
    setFollows([]);
    setMembers([]);
    setViewerCount(0);
    setTotalLikes(0);
    setAiResponses([]);
    setCurrentAudio(null);
    setIsAudioPlaying(false);

    toast({
      title: "Disconnected",
      description: "You've disconnected from the live stream"
    });
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const updateAIConfig = (newConfig: Partial<AIConfig>) => {
    const updatedConfig = { ...aiConfig, ...newConfig };
    setAiConfig(updatedConfig);
    
    if (socket && connectionState.isConnected) {
      socket.emit('updateAIConfig', updatedConfig);
      
      toast({
        title: "AI Settings Updated",
        description: "Your AI response settings have been updated"
      });
    }
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'question':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'gift':
        return <Gift className="h-4 w-4 text-purple-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'share':
        return <Share className="h-4 w-4 text-green-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-indigo-500" />;
      case 'join':
        return <UserPlus2 className="h-4 w-4 text-teal-500" />;
      case 'purchase':
        return <Gift className="h-4 w-4 text-amber-500" />;
      default:
        return <BrainCircuit className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI voice player (hidden but functional) */}
      {currentAudio && (
        <ReactAudioPlayer
          src={currentAudio}
          autoPlay
          ref={audioPlayerRef}
          onEnded={() => {
            setIsAudioPlaying(false);
            setCurrentAudio(null);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Connect to TikTok Live</CardTitle>
          <CardDescription>
            Enter a TikTok username to connect to their live stream
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="TikTok username (without @)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={connectionState.isConnected || connectionState.isConnecting}
              />
            </div>
            {!connectionState.isConnected ? (
              <Button 
                onClick={connectToUser} 
                disabled={connectionState.isConnecting || !username}
              >
                {connectionState.isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Connecting</span>
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    <span>Connect</span>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={disconnectFromLiveStream}
              >
                Disconnect
              </Button>
            )}
          </div>
          
          {connectionState.error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Connection Error</p>
                <p className="text-sm">{connectionState.error}</p>
              </div>
            </div>
          )}
          
          {connectionState.isConnected && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                  Connected to @{username}
                </Badge>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{viewerCount.toLocaleString()} viewers</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-pink-500" />
                  <span className="text-sm text-muted-foreground">{totalLikes.toLocaleString()} likes</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isAudioPlaying ? (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Slider
                    value={[audioVolume]}
                    max={100}
                    step={1}
                    className="w-24"
                    onValueChange={(value) => setAudioVolume(value[0])}
                  />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAISettings(!showAISettings)}
                >
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  AI Settings
                </Button>
              </div>
            </div>
          )}
          
          {/* AI Settings Panel */}
          {showAISettings && connectionState.isConnected && (
            <div className="mt-4 p-4 border rounded-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">AI Voice Response Settings</h3>
                </div>
                <Switch
                  checked={aiConfig.enableAIResponses}
                  onCheckedChange={(checked) => updateAIConfig({ enableAIResponses: checked })}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments">Respond to Questions</Label>
                    <Switch
                      id="comments"
                      checked={aiConfig.respondToComments}
                      onCheckedChange={(checked) => updateAIConfig({ respondToComments: checked })}
                      disabled={!aiConfig.enableAIResponses}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gifts">Respond to Gifts</Label>
                    <Switch
                      id="gifts"
                      checked={aiConfig.respondToGifts}
                      onCheckedChange={(checked) => updateAIConfig({ respondToGifts: checked })}
                      disabled={!aiConfig.enableAIResponses}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="likes">Respond to Likes</Label>
                    <Switch
                      id="likes"
                      checked={aiConfig.respondToLikes}
                      onCheckedChange={(checked) => updateAIConfig({ respondToLikes: checked })}
                      disabled={!aiConfig.enableAIResponses}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="follows">Respond to Follows</Label>
                    <Switch
                      id="follows"
                      checked={aiConfig.respondToFollows}
                      onCheckedChange={(checked) => updateAIConfig({ respondToFollows: checked })}
                      disabled={!aiConfig.enableAIResponses}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shares">Respond to Shares</Label>
                    <Switch
                      id="shares"
                      checked={aiConfig.respondToShares}
                      onCheckedChange={(checked) => updateAIConfig({ respondToShares: checked })}
                      disabled={!aiConfig.enableAIResponses}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="joins">Respond to Joins</Label>
                    <Switch
                      id="joins"
                      checked={aiConfig.respondToJoins}
                      onCheckedChange={(checked) => updateAIConfig({ respondToJoins: checked })}
                      disabled={!aiConfig.enableAIResponses}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="purchases">Respond to Purchases</Label>
                    <Switch
                      id="purchases"
                      checked={aiConfig.respondToPurchases}
                      onCheckedChange={(checked) => updateAIConfig({ respondToPurchases: checked })}
                      disabled={!aiConfig.enableAIResponses}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="giftThreshold">
                    Minimum Gift Value (diamonds)
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="giftThreshold"
                      value={[aiConfig.giftThreshold]}
                      max={100}
                      step={1}
                      disabled={!aiConfig.enableAIResponses || !aiConfig.respondToGifts}
                      onValueChange={(value) => updateAIConfig({ giftThreshold: value[0] })}
                    />
                    <span className="w-12 text-center">{aiConfig.giftThreshold}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="likeThreshold">
                    Minimum Like Count
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="likeThreshold"
                      value={[aiConfig.likeThreshold]}
                      max={20}
                      step={1}
                      disabled={!aiConfig.enableAIResponses || !aiConfig.respondToLikes}
                      onValueChange={(value) => updateAIConfig({ likeThreshold: value[0] })}
                    />
                    <span className="w-12 text-center">{aiConfig.likeThreshold}</span>
                  </div>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="joinResponseRate">
                    Join Response Rate (%)
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="joinResponseRate"
                      value={[aiConfig.joinResponseRate]}
                      max={100}
                      step={5}
                      disabled={!aiConfig.enableAIResponses || !aiConfig.respondToJoins}
                      onValueChange={(value) => updateAIConfig({ joinResponseRate: value[0] })}
                    />
                    <span className="w-12 text-center">{aiConfig.joinResponseRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {connectionState.isConnected && (
        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="comments" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Comments</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center">
              <Gift className="h-4 w-4 mr-2" />
              <span>Gifts</span>
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              <span>Likes</span>
            </TabsTrigger>
            <TabsTrigger value="shares" className="flex items-center">
              <Share className="h-4 w-4 mr-2" />
              <span>Shares</span>
            </TabsTrigger>
            <TabsTrigger value="follows" className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              <span>Follows</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center">
              <UserPlus2 className="h-4 w-4 mr-2" />
              <span>Joins</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center">
              <BrainCircuit className="h-4 w-4 mr-2" />
              <span>AI Responses</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <span>Live Comments</span>
                </CardTitle>
                <CardDescription>
                  Real-time comments from viewers in the live stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                      <p>No comments yet</p>
                      <p className="text-sm">Comments will appear here when viewers chat</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.profilePictureUrl} alt={comment.nickname} />
                            <AvatarFallback>{comment.nickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <p className="font-medium text-sm">{comment.nickname}</p>
                              <span className="text-xs text-muted-foreground ml-2">@{comment.uniqueId}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{formatTimestamp(comment.timestamp)}</span>
                            </div>
                            <p>{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={commentsEndRef} />
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Showing the most recent {comments.length} of {comments.length} comments
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="gifts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  <span>Gifts</span>
                </CardTitle>
                <CardDescription>
                  Gifts sent by viewers during the live stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {gifts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Gift className="h-12 w-12 mb-2 opacity-20" />
                      <p>No gifts yet</p>
                      <p className="text-sm">Gifts will appear here when viewers send them</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {gifts.map((gift, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={gift.profilePictureUrl} alt={gift.nickname} />
                            <AvatarFallback>{gift.nickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <p className="font-medium text-sm">{gift.nickname}</p>
                              <span className="text-xs text-muted-foreground ml-2">@{gift.uniqueId}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{formatTimestamp(gift.timestamp)}</span>
                            </div>
                            <div className="flex items-center">
                              <p>Sent <span className="font-medium">{gift.giftName}</span></p>
                              {gift.repeatCount > 1 && (
                                <Badge variant="outline" className="ml-2">
                                  x{gift.repeatCount}
                                </Badge>
                              )}
                              <Badge className="ml-auto bg-amber-500/20 text-amber-700 hover:bg-amber-500/20 border-amber-200">
                                {gift.diamondCount} diamonds
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Showing the most recent {gifts.length} of {gifts.length} gifts
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="likes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  <span>Likes</span>
                </CardTitle>
                <CardDescription>
                  Likes received during the live stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {likes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Heart className="h-12 w-12 mb-2 opacity-20" />
                      <p>No likes yet</p>
                      <p className="text-sm">Likes will appear here when viewers like the stream</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {likes.map((like, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={like.profilePictureUrl} alt={like.nickname} />
                            <AvatarFallback>{like.nickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <p className="font-medium text-sm">{like.nickname}</p>
                              <span className="text-xs text-muted-foreground ml-2">@{like.uniqueId}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{formatTimestamp(like.timestamp)}</span>
                            </div>
                            <div className="flex items-center">
                              <p>Sent <span className="font-medium">{like.likeCount}</span> {like.likeCount === 1 ? 'like' : 'likes'}</p>
                              <Heart className="h-4 w-4 ml-2 text-pink-500 fill-pink-500" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Showing the most recent {likes.length} of {likes.length} likes
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="shares">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share className="h-5 w-5 mr-2" />
                  <span>Shares</span>
                </CardTitle>
                <CardDescription>
                  Users who shared the live stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {shares.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Share className="h-12 w-12 mb-2 opacity-20" />
                      <p>No shares yet</p>
                      <p className="text-sm">Shares will appear here when viewers share the stream</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shares.map((share, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={share.profilePictureUrl} alt={share.nickname} />
                            <AvatarFallback>{share.nickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <p className="font-medium text-sm">{share.nickname}</p>
                              <span className="text-xs text-muted-foreground ml-2">@{share.uniqueId}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{formatTimestamp(share.timestamp)}</span>
                            </div>
                            <p>Shared the stream</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Showing the most recent {shares.length} of {shares.length} shares
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="follows">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  <span>Follows</span>
                </CardTitle>
                <CardDescription>
                  New followers during the live stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {follows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <UserPlus className="h-12 w-12 mb-2 opacity-20" />
                      <p>No new follows yet</p>
                      <p className="text-sm">New follows will appear here when viewers follow</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {follows.map((follow, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={follow.profilePictureUrl} alt={follow.nickname} />
                            <AvatarFallback>{follow.nickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <p className="font-medium text-sm">{follow.nickname}</p>
                              <span className="text-xs text-muted-foreground ml-2">@{follow.uniqueId}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{formatTimestamp(follow.timestamp)}</span>
                            </div>
                            <p>Started following</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Showing the most recent {follows.length} of {follows.length} follows
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus2 className="h-5 w-5 mr-2" />
                  <span>Member Joins</span>
                </CardTitle>
                <CardDescription>
                  Users who joined the live stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <UserPlus2 className="h-12 w-12 mb-2 opacity-20" />
                      <p>No member joins yet</p>
                      <p className="text-sm">Member joins will appear here when viewers join</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {members.map((member, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.profilePictureUrl} alt={member.nickname} />
                            <AvatarFallback>{member.nickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <p className="font-medium text-sm">{member.nickname}</p>
                              <span className="text-xs text-muted-foreground ml-2">@{member.uniqueId}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{formatTimestamp(member.timestamp)}</span>
                            </div>
                            <p>Joined the stream</p>
                            {member.joinType && (
                              <Badge variant="outline" className="mt-1">
                                {member.joinType}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Showing the most recent {members.length} of {members.length} member joins
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="h-5 w-5 mr-2" />
                  <span>AI Voice Responses</span>
                </CardTitle>
                <CardDescription>
                  AI-generated voice responses to live stream events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {aiResponses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <BrainCircuit className="h-12 w-12 mb-2 opacity-20" />
                      <p>No AI responses yet</p>
                      <p className="text-sm">AI responses will appear here when the assistant responds to events</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {aiResponses.map((response, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <p className="font-medium text-sm">AI Assistant</p>
                              <Badge variant="outline" className="ml-2 flex items-center space-x-1">
                                {getEventIcon(response.event)}
                                <span className="capitalize text-xs">{response.event}</span>
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-auto">{formatTimestamp(response.timestamp)}</span>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg">
                              <p>{response.text}</p>
                              {response.userData && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  In response to @{response.userData.uniqueId} ({response.userData.nickname})
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={aiResponsesEndRef} />
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Showing the most recent {aiResponses.length} of {aiResponses.length} AI responses
                </span>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableAI"
                    checked={aiConfig.enableAIResponses}
                    onCheckedChange={(checked) => updateAIConfig({ enableAIResponses: checked })}
                  />
                  <Label htmlFor="enableAI">Enable AI Responses</Label>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}