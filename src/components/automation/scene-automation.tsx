'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Film,
  Edit,
  Trash2,
  Plus,
  Layout,
  Grid,
  Laptop,
  Camera,
  Sparkles,
  SplitSquareVertical,
  Share2,
  Image,
  Music,
  Video,
  Eye,
  EyeOff,
  Copy,
  Layers,
  Sliders,
  Settings,
  MoreHorizontal,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { WorkflowItem } from './workflow-manager';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SceneAutomationProps {
  workflows: WorkflowItem[];
}

interface Scene {
  id: string;
  name: string;
  description: string;
  layout: 'single' | 'split' | 'pip' | 'triple' | 'quad' | 'custom';
  elements: SceneElement[];
  isActive: boolean;
  thumbnail?: string;
}

interface SceneElement {
  id: string;
  type: 'camera' | 'media' | 'text' | 'browser' | 'overlay' | 'background';
  name: string;
  isVisible: boolean;
  settings?: Record<string, any>;
}

const sceneData: Scene[] = [
  {
    id: 'scene-1',
    name: 'Intro Scene',
    description: 'Starting scene with branding and camera',
    layout: 'single',
    isActive: true,
    elements: [
      {
        id: 'element-1',
        type: 'camera',
        name: 'Main Camera',
        isVisible: true,
        settings: { position: 'center', size: 'large' },
      },
      {
        id: 'element-2',
        type: 'overlay',
        name: 'Intro Overlay',
        isVisible: true,
        settings: { position: 'bottom', opacity: 0.8 },
      },
      {
        id: 'element-3',
        type: 'text',
        name: 'Stream Title',
        isVisible: true,
        settings: { position: 'top', fontSize: 24, color: '#FFFFFF' },
      },
    ],
    thumbnail: 'https://placekitten.com/100/60',
  },
  {
    id: 'scene-2',
    name: 'Dance Challenge',
    description: 'Split view with reference video and camera',
    layout: 'split',
    isActive: false,
    elements: [
      {
        id: 'element-4',
        type: 'camera',
        name: 'Main Camera',
        isVisible: true,
        settings: { position: 'right', size: 'medium' },
      },
      {
        id: 'element-5',
        type: 'media',
        name: 'Reference Video',
        isVisible: true,
        settings: { position: 'left', size: 'medium', loop: true },
      },
      {
        id: 'element-6',
        type: 'text',
        name: 'Challenge Name',
        isVisible: true,
        settings: { position: 'top', fontSize: 20, color: '#FFFFFF' },
      },
    ],
    thumbnail: 'https://placekitten.com/100/61',
  },
  {
    id: 'scene-3',
    name: 'Q&A Mode',
    description: 'Camera with comment highlight overlay',
    layout: 'pip',
    isActive: false,
    elements: [
      {
        id: 'element-7',
        type: 'camera',
        name: 'Main Camera',
        isVisible: true,
        settings: { position: 'center', size: 'large' },
      },
      {
        id: 'element-8',
        type: 'browser',
        name: 'Comment Display',
        isVisible: true,
        settings: { position: 'right-bottom', size: 'small', opacity: 0.9 },
      },
    ],
    thumbnail: 'https://placekitten.com/100/62',
  },
  {
    id: 'scene-4',
    name: 'Product Showcase',
    description: 'Focus on product with branding',
    layout: 'single',
    isActive: false,
    elements: [
      {
        id: 'element-9',
        type: 'camera',
        name: 'Product Camera',
        isVisible: true,
        settings: { position: 'center', size: 'large' },
      },
      {
        id: 'element-10',
        type: 'overlay',
        name: 'Product Info',
        isVisible: true,
        settings: { position: 'right', opacity: 0.8 },
      },
    ],
    thumbnail: 'https://placekitten.com/100/63',
  },
  {
    id: 'scene-5',
    name: 'Multi-View',
    description: 'Quad layout for multiple sources',
    layout: 'quad',
    isActive: false,
    elements: [
      {
        id: 'element-11',
        type: 'camera',
        name: 'Main Camera',
        isVisible: true,
        settings: { position: 'top-left', size: 'small' },
      },
      {
        id: 'element-12',
        type: 'camera',
        name: 'Second Camera',
        isVisible: true,
        settings: { position: 'top-right', size: 'small' },
      },
      {
        id: 'element-13',
        type: 'media',
        name: 'Background Video',
        isVisible: true,
        settings: { position: 'bottom-left', size: 'small' },
      },
      {
        id: 'element-14',
        type: 'browser',
        name: 'Comments Feed',
        isVisible: true,
        settings: { position: 'bottom-right', size: 'small' },
      },
    ],
    thumbnail: 'https://placekitten.com/100/64',
  },
];

export function SceneAutomation({ workflows }: SceneAutomationProps) {
  const [scenes, setScenes] = useState<Scene[]>(sceneData);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('scenes');

  const getLayoutIcon = (layout: Scene['layout']) => {
    switch (layout) {
      case 'single':
        return <Layout className="h-4 w-4 text-blue-500" />;
      case 'split':
        return <SplitSquareVertical className="h-4 w-4 text-green-500" />;
      case 'pip':
        return <Layers className="h-4 w-4 text-amber-500" />;
      case 'triple':
        return <Grid className="h-4 w-4 text-purple-500" />;
      case 'quad':
        return <Grid className="h-4 w-4 text-tiktok-pink" />;
      case 'custom':
        return <Sparkles className="h-4 w-4 text-indigo-500" />;
      default:
        return <Layout className="h-4 w-4" />;
    }
  };

  const getElementIcon = (type: SceneElement['type']) => {
    switch (type) {
      case 'camera':
        return <Camera className="h-4 w-4 text-blue-500" />;
      case 'media':
        return <Video className="h-4 w-4 text-green-500" />;
      case 'text':
        return <Edit className="h-4 w-4 text-amber-500" />;
      case 'browser':
        return <Laptop className="h-4 w-4 text-purple-500" />;
      case 'overlay':
        return <Layers className="h-4 w-4 text-tiktok-pink" />;
      case 'background':
        return <Image className="h-4 w-4 text-indigo-500" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };

  const handleToggleSceneActive = (id: string) => {
    setScenes(
      scenes.map(scene => {
        if (scene.id === id) {
          return { ...scene, isActive: !scene.isActive };
        }
        return scene;
      })
    );
  };

  const handleToggleElementVisibility = (sceneId: string, elementId: string) => {
    setScenes(
      scenes.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            elements: scene.elements.map(element =>
              element.id === elementId ? { ...element, isVisible: !element.isVisible } : element
            ),
          };
        }
        return scene;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            Scene Automation
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage scene transitions based on various triggers
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenes" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>Scenes</span>
          </TabsTrigger>
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Automations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scenes.map(scene => (
              <Card
                key={scene.id}
                className={`${
                  selectedScene === scene.id
                    ? 'ring-2 ring-primary'
                    : scene.isActive
                      ? 'border-green-200 dark:border-green-800'
                      : ''
                }`}
                onClick={() => setSelectedScene(scene.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full p-1.5 ${
                          scene.layout === 'single'
                            ? 'bg-blue-100 text-blue-500 dark:bg-blue-900/30'
                            : scene.layout === 'split'
                              ? 'bg-green-100 text-green-500 dark:bg-green-900/30'
                              : scene.layout === 'pip'
                                ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/30'
                                : scene.layout === 'quad'
                                  ? 'bg-tiktok-pink/20 text-tiktok-pink dark:bg-tiktok-pink/10'
                                  : 'bg-purple-100 text-purple-500 dark:bg-purple-900/30'
                        }`}
                      >
                        {getLayoutIcon(scene.layout)}
                      </div>
                      <CardTitle className="text-base">{scene.name}</CardTitle>
                    </div>
                    <Switch
                      checked={scene.isActive}
                      onCheckedChange={() => handleToggleSceneActive(scene.id)}
                    />
                  </div>
                  <CardDescription>{scene.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="aspect-video bg-background/50 rounded-md mb-2 overflow-hidden border">
                    {scene.thumbnail ? (
                      <img
                        src={scene.thumbnail}
                        alt={scene.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Film className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium mb-1">Elements:</div>
                    <div className="flex flex-wrap gap-1">
                      {scene.elements.map(element => (
                        <TooltipProvider key={element.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className={`${
                                  !element.isVisible ? 'opacity-50' : ''
                                } cursor-pointer`}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleToggleElementVisibility(scene.id, element.id);
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  {getElementIcon(element.type)}
                                  <span>{element.name}</span>
                                  {!element.isVisible && <EyeOff className="h-3 w-3 ml-1" />}
                                </div>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {element.isVisible ? 'Click to hide' : 'Click to show'}{' '}
                                {element.name}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between w-full">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Copy className="h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Share2 className="h-4 w-4" />
                          <span>Export</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-red-500">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            ))}

            <Card className="flex flex-col items-center justify-center p-6 h-[300px]">
              <div className="rounded-full bg-primary/10 p-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Create New Scene</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Add a new scene to use in your stream
              </p>
              <CreateSceneDialog />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Scene Automation
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Workflow</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[140px]">Trigger</TableHead>
                  <TableHead className="w-[140px]">Target Scene</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map(workflow => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.title}</TableCell>
                    <TableCell>{workflow.description}</TableCell>
                    <TableCell>{workflow.trigger}</TableCell>
                    <TableCell>
                      {workflow.title.includes('Q&A') ? (
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-amber-100 p-1 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <Layers className="h-3 w-3" />
                          </div>
                          <span>Q&A Mode</span>
                        </div>
                      ) : workflow.title.includes('Dance') ? (
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <SplitSquareVertical className="h-3 w-3" />
                          </div>
                          <span>Dance Challenge</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Layout className="h-3 w-3" />
                          </div>
                          <span>Main Scene</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {workflow.status === 'active' ? (
                        <EnhancedBadge type="success">Active</EnhancedBadge>
                      ) : workflow.status === 'scheduled' ? (
                        <EnhancedBadge type="warning">Scheduled</EnhancedBadge>
                      ) : (
                        <EnhancedBadge variant="outline">Inactive</EnhancedBadge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateSceneDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4 gap-1.5">
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Scene</DialogTitle>
          <DialogDescription>Set up a new scene for your stream.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="scene-name">Scene Name</Label>
            <Input id="scene-name" placeholder="Interview Layout" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="scene-description">Description</Label>
            <Textarea id="scene-description" placeholder="Layout optimized for guest interviews" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="scene-layout">Layout Type</Label>
            <Select defaultValue="split">
              <SelectTrigger id="scene-layout">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single View</SelectItem>
                <SelectItem value="split">Split Screen</SelectItem>
                <SelectItem value="pip">Picture-in-Picture</SelectItem>
                <SelectItem value="triple">Triple View</SelectItem>
                <SelectItem value="quad">Quad View</SelectItem>
                <SelectItem value="custom">Custom Layout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Elements</Label>
            <ScrollArea className="h-[180px] rounded-md border p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-500" />
                    <span>Main Camera</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="camera-visibility" className="sr-only">
                      Toggle visibility
                    </Label>
                    <Switch id="camera-visibility" defaultChecked />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-green-500" />
                    <span>Background Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bg-visibility" className="sr-only">
                      Toggle visibility
                    </Label>
                    <Switch id="bg-visibility" defaultChecked />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-amber-500" />
                    <span>Stream Info Text</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="text-visibility" className="sr-only">
                      Toggle visibility
                    </Label>
                    <Switch id="text-visibility" defaultChecked />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-tiktok-pink" />
                    <span>Lower Third Overlay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="overlay-visibility" className="sr-only">
                      Toggle visibility
                    </Label>
                    <Switch id="overlay-visibility" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Element</span>
                </Button>
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="scene-active" defaultChecked />
            <Label htmlFor="scene-active">Make this scene active</Label>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" type="button">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </div>
          </Button>
          <Button type="submit">Create Scene</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
