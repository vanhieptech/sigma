'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart2,
  Calendar,
  Clapperboard,
  Download,
  Edit,
  Eye,
  Heart,
  MessageCircle,
  Play,
  Plus,
  Settings,
  Share2,
  Sparkles,
  ThumbsUp,
  Trash2,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import { WorkflowItem } from './workflow-manager';

interface PostStreamHighlightsProps {
  workflows: WorkflowItem[];
}

interface Highlight {
  id: string;
  title: string;
  timestamp: string;
  duration: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  streamId: string;
  streamTitle: string;
  date: string;
  status: 'processing' | 'ready' | 'published' | 'draft';
  tags: string[];
}

interface Stream {
  id: string;
  title: string;
  date: string;
  duration: string;
  views: number;
  thumbnailUrl: string;
  highlightsGenerated: boolean;
}

const highlights: Highlight[] = [
  {
    id: 'highlight-1',
    title: 'Amazing Dance Combo',
    timestamp: '00:15:42',
    duration: '0:45',
    thumbnailUrl: 'https://placekitten.com/300/169',
    views: 12420,
    likes: 1840,
    streamId: 'stream-1',
    streamTitle: 'Sunday Dance Session',
    date: '2023-10-15',
    status: 'published',
    tags: ['dance', 'viral', 'trending'],
  },
  {
    id: 'highlight-2',
    title: 'Q&A About My Journey',
    timestamp: '01:23:15',
    duration: '2:12',
    thumbnailUrl: 'https://placekitten.com/301/169',
    views: 8760,
    likes: 954,
    streamId: 'stream-1',
    streamTitle: 'Sunday Dance Session',
    date: '2023-10-15',
    status: 'published',
    tags: ['qa', 'advice'],
  },
  {
    id: 'highlight-3',
    title: 'Tutorial Breakdown',
    timestamp: '00:45:30',
    duration: '3:25',
    thumbnailUrl: 'https://placekitten.com/302/169',
    views: 5310,
    likes: 612,
    streamId: 'stream-2',
    streamTitle: 'Tutorial Tuesday',
    date: '2023-10-17',
    status: 'ready',
    tags: ['tutorial', 'howto', 'technique'],
  },
  {
    id: 'highlight-4',
    title: 'Reacting to Comments',
    timestamp: '01:05:22',
    duration: '1:15',
    thumbnailUrl: 'https://placekitten.com/303/169',
    views: 0,
    likes: 0,
    streamId: 'stream-2',
    streamTitle: 'Tutorial Tuesday',
    date: '2023-10-17',
    status: 'processing',
    tags: ['reaction', 'funny'],
  },
];

const recentStreams: Stream[] = [
  {
    id: 'stream-1',
    title: 'Sunday Dance Session',
    date: '2023-10-15',
    duration: '1:32:45',
    views: 34500,
    thumbnailUrl: 'https://placekitten.com/300/169',
    highlightsGenerated: true,
  },
  {
    id: 'stream-2',
    title: 'Tutorial Tuesday',
    date: '2023-10-17',
    duration: '1:15:20',
    views: 28900,
    thumbnailUrl: 'https://placekitten.com/301/169',
    highlightsGenerated: true,
  },
  {
    id: 'stream-3',
    title: 'Collab with @dancer123',
    date: '2023-10-19',
    duration: '1:45:10',
    views: 42300,
    thumbnailUrl: 'https://placekitten.com/302/169',
    highlightsGenerated: false,
  },
];

export function PostStreamHighlights({ workflows }: PostStreamHighlightsProps) {
  const [streamHighlights, setStreamHighlights] = useState<Highlight[]>(highlights);
  const [streams, setStreams] = useState<Stream[]>(recentStreams);
  const [activeTab, setActiveTab] = useState('highlights');

  const getStatusBadge = (status: Highlight['status']) => {
    switch (status) {
      case 'published':
        return <EnhancedBadge type="success">Published</EnhancedBadge>;
      case 'ready':
        return <EnhancedBadge type="info">Ready</EnhancedBadge>;
      case 'processing':
        return (
          <EnhancedBadge type="warning" className="animate-pulse">
            Processing
          </EnhancedBadge>
        );
      case 'draft':
        return <EnhancedBadge variant="outline">Draft</EnhancedBadge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clapperboard className="h-5 w-5 text-primary" />
            Post-Stream Highlights
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automatically generate and manage highlight clips from your streams
          </p>
        </div>

        {activeTab === 'highlights' ? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Manual Highlight
          </Button>
        ) : (
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Highlights
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="highlights" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Generated Highlights</span>
          </TabsTrigger>
          <TabsTrigger value="streams" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span>Recent Streams</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Highlight Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="highlights" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {streamHighlights.map(highlight => (
              <Card key={highlight.id} className="overflow-hidden">
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <div className="absolute inset-0 bg-accent flex items-center justify-center">
                      <Clapperboard className="h-10 w-10 text-muted-foreground" />
                    </div>
                    {highlight.thumbnailUrl && (
                      <img
                        src={highlight.thumbnailUrl}
                        alt={highlight.title}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </AspectRatio>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {getStatusBadge(highlight.status)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-background/80 backdrop-blur-sm"
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                    {highlight.duration}
                  </div>
                </div>

                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-base truncate">{highlight.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    {highlight.date}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-3 pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {highlight.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {highlight.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clapperboard className="h-3 w-3" />
                      {highlight.timestamp}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-3 pt-0 flex justify-between">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {highlight.status === 'ready' && (
                    <Button size="sm" className="h-8">
                      Publish
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Stream</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Highlights</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {streams.map(stream => (
                  <TableRow key={stream.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-9 bg-accent rounded flex items-center justify-center overflow-hidden">
                          {stream.thumbnailUrl ? (
                            <img
                              src={stream.thumbnailUrl}
                              alt={stream.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Clapperboard className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="font-medium">{stream.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>{stream.date}</TableCell>
                    <TableCell>{stream.duration}</TableCell>
                    <TableCell>{stream.views.toLocaleString()}</TableCell>
                    <TableCell>
                      {stream.highlightsGenerated ? (
                        <EnhancedBadge type="success">Generated</EnhancedBadge>
                      ) : (
                        <EnhancedBadge variant="outline">Not Generated</EnhancedBadge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!stream.highlightsGenerated}
                          className="text-xs"
                        >
                          View Highlights
                        </Button>
                        <Button
                          size="sm"
                          disabled={stream.highlightsGenerated}
                          className="text-xs gap-1"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Generate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Generation Settings</CardTitle>
                <CardDescription>
                  Configure how highlights are automatically generated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Clip Length</Label>
                    <span className="text-sm">30 seconds</span>
                  </div>
                  <Slider defaultValue={[30]} min={10} max={120} step={5} />
                  <p className="text-xs text-muted-foreground">
                    Length of automatically generated highlight clips
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Auto-Generate Highlights</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically create highlights after each stream
                    </p>
                  </div>
                  <Switch id="auto-generate" defaultChecked />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Auto-Publish Highlights</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically publish generated highlights
                    </p>
                  </div>
                  <Switch id="auto-publish" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Exclude Sensitive Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Skip parts of stream that might contain sensitive content
                    </p>
                  </div>
                  <Switch id="exclude-sensitive" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detection Settings</CardTitle>
                <CardDescription>
                  Configure what types of moments to include in highlights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="high-engagement" className="font-medium">
                        High Engagement
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="high-engagement-threshold" className="text-xs">
                        Threshold:
                      </Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="w-24 h-7">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      <Label htmlFor="comment-spikes" className="font-medium">
                        Comment Spikes
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="comment-threshold" className="text-xs">
                        Threshold:
                      </Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="w-24 h-7">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-tiktok-pink" />
                      <Label htmlFor="like-spikes" className="font-medium">
                        Like/Gift Spikes
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="like-threshold" className="text-xs">
                        Threshold:
                      </Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="w-24 h-7">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-purple-500" />
                      <Label htmlFor="custom-markers" className="font-medium">
                        Custom Markers
                      </Label>
                    </div>
                    <Switch id="custom-markers" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Title & Metadata Settings</CardTitle>
                <CardDescription>
                  Configure how titles and metadata are generated for highlights
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title Format</Label>
                  <Input defaultValue="{streamer} - {description} | {date}" />
                  <p className="text-xs text-muted-foreground">
                    Available variables: {'{streamer}'}, {'{description}'}, {'{date}'}, {'{type}'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Description Template</Label>
                  <Textarea
                    defaultValue="Highlight from {streamer}'s stream on {date}. Watch the full stream: {url}"
                    className="h-[76px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Tags</Label>
                  <Input defaultValue="highlight, tiktok, livestream" />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated tags to add to all highlights
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Output Platform</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="platform-tiktok" defaultChecked />
                      <Label htmlFor="platform-tiktok" className="text-sm">
                        TikTok
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="platform-youtube" defaultChecked />
                      <Label htmlFor="platform-youtube" className="text-sm">
                        YouTube
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="platform-instagram" />
                      <Label htmlFor="platform-instagram" className="text-sm">
                        Instagram
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="platform-twitter" />
                      <Label htmlFor="platform-twitter" className="text-sm">
                        Twitter
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
