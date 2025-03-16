import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Layout,
  Settings,
  Plus,
  Play,
  EyeOff,
  Eye,
  Layers,
  ArrowRight,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
export const metadata: Metadata = {
  title: 'Scene Switching - TikTok Streaming',
  description: 'Configure trigger-based scene switching for your TikTok streams',
};

interface Scene {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  thumbnail?: string;
}

interface SceneTransition {
  id: string;
  trigger: string;
  triggerType: 'engagement' | 'time' | 'action' | 'custom';
  fromScene: string;
  toScene: string;
  isEnabled: boolean;
}

const scenes: Scene[] = [
  {
    id: 'scene-1',
    name: 'Intro',
    description: 'Starting scene with intro graphics',
    isActive: true,
    thumbnail: 'https://placekitten.com/100/60',
  },
  {
    id: 'scene-2',
    name: 'Main Content',
    description: 'Primary streaming layout',
    isActive: false,
    thumbnail: 'https://placekitten.com/100/60',
  },
  {
    id: 'scene-3',
    name: 'Q&A Layout',
    description: 'Layout for Q&A sessions with comments displayed',
    isActive: false,
    thumbnail: 'https://placekitten.com/100/60',
  },
  {
    id: 'scene-4',
    name: 'Break Screen',
    description: 'Screen to display during short breaks',
    isActive: false,
    thumbnail: 'https://placekitten.com/100/60',
  },
  {
    id: 'scene-5',
    name: 'Outro',
    description: 'End of stream with call to action',
    isActive: false,
    thumbnail: 'https://placekitten.com/100/60',
  },
];

const transitions: SceneTransition[] = [
  {
    id: 'transition-1',
    trigger: 'Stream Start',
    triggerType: 'action',
    fromScene: 'scene-1',
    toScene: 'scene-2',
    isEnabled: true,
  },
  {
    id: 'transition-2',
    trigger: 'Comment rate > 30/min for 2 minutes',
    triggerType: 'engagement',
    fromScene: 'scene-2',
    toScene: 'scene-3',
    isEnabled: true,
  },
  {
    id: 'transition-3',
    trigger: 'After 25 minutes of streaming',
    triggerType: 'time',
    fromScene: 'scene-2',
    toScene: 'scene-4',
    isEnabled: true,
  },
  {
    id: 'transition-4',
    trigger: 'Manual "End Stream" button pressed',
    triggerType: 'action',
    fromScene: 'any',
    toScene: 'scene-5',
    isEnabled: true,
  },
];

export default function SceneSwitchingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Scene Switching</h2>
        <p className="text-muted-foreground">
          Configure automated scene switching based on triggers and conditions
        </p>
      </div>

      <Tabs defaultValue="scenes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenes" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Scenes</span>
          </TabsTrigger>
          <TabsTrigger value="transitions" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>Transitions</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenes" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Stream Scenes</CardTitle>
                  <CardDescription>Configure your stream scenes and layouts</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Scene
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {scenes.map(scene => (
                  <Card
                    key={scene.id}
                    className={scene.isActive ? 'border-l-4 border-l-green-500' : ''}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{scene.name}</CardTitle>
                        {scene.isActive && (
                          <EnhancedBadge type="success" className="text-xs">
                            Active
                          </EnhancedBadge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="aspect-video rounded-md border bg-muted/50 mb-3">
                        {scene.thumbnail ? (
                          <Image
                            src={scene.thumbnail}
                            alt={scene.name}
                            className="h-full w-full rounded-md object-cover"
                            width={100}
                            height={60}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Layers className="h-8 w-8 text-muted-foreground/70" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{scene.description}</p>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 gap-1"
                          size="sm"
                          variant={scene.isActive ? 'secondary' : 'default'}
                        >
                          <Play className="h-3 w-3" />
                          {scene.isActive ? 'Active' : 'Activate'}
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          {scene.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transitions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scene Transitions</CardTitle>
                  <CardDescription>Configure trigger-based scene transitions</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Transition
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {transitions.map(transition => (
                    <Card key={transition.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {scenes.find(s => s.id === transition.fromScene)?.name ||
                                    transition.fromScene}
                                  <ArrowRight className="h-4 w-4 mx-2 inline-block" />
                                  {scenes.find(s => s.id === transition.toScene)?.name ||
                                    transition.toScene}
                                </h4>
                                <EnhancedBadge
                                  type={
                                    transition.triggerType === 'engagement'
                                      ? 'success'
                                      : transition.triggerType === 'time'
                                        ? 'info'
                                        : transition.triggerType === 'action'
                                          ? 'warning'
                                          : 'default'
                                  }
                                  className="text-xs"
                                >
                                  {transition.triggerType}
                                </EnhancedBadge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                <span className="font-medium">Trigger: </span>
                                {transition.trigger}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={transition.isEnabled} />
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scene Switching Settings</CardTitle>
              <CardDescription>
                Configure global settings for scene switching automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">Enable automated switching</span>
                  <span className="text-xs text-muted-foreground">
                    Allow scenes to change automatically based on triggers
                  </span>
                </div>
                <Switch checked={true} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">Transition effect</span>
                  <span className="text-xs text-muted-foreground">
                    Visual effect used when switching between scenes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Fade (0.5s)</span>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">Announce scene changes</span>
                  <span className="text-xs text-muted-foreground">
                    Display a notification when scenes change automatically
                  </span>
                </div>
                <Switch checked={false} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">Cooldown period</span>
                  <span className="text-xs text-muted-foreground">
                    Minimum time between automatic scene changes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">30 seconds</span>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
