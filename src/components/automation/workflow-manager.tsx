'use client';

import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  Code,
  PanelLeft,
  ScrollText,
  Settings,
  SlidersHorizontal,
  User,
  Users,
  Zap,
  Plus,
  X,
  Edit,
  Trash,
  Check,
  AlertCircle,
  PlusCircle,
  PlayCircle,
  PauseCircle,
  ArrowRight,
  ExternalLink,
  Timer,
  Calendar,
  ListChecks,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { EngagementAutomation } from './engagement-automation';
import { PreStreamChecklist } from './pre-stream-checklist';

export interface WorkflowItem {
  id: string;
  title: string;
  description?: string;
  trigger: string;
  status: 'active' | 'inactive' | 'scheduled' | 'disabled';
  category: 'engagement' | 'chat' | 'viewer' | 'stream' | 'custom';
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  icon?: React.ReactNode;
}

const workflows: WorkflowItem[] = [
  {
    id: 'workflow-1',
    title: 'Low Engagement Recovery',
    description: 'Automatically start a poll when engagement drops below threshold',
    trigger: 'Engagement Rate below 5% for 3 minutes',
    status: 'active',
    category: 'engagement',
    lastRun: '2023-10-22T14:30:00Z',
    createdAt: '2023-10-15T10:00:00Z',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: 'workflow-2',
    title: 'New Viewer Welcome',
    description: 'Highlight a message for first-time viewers in chat',
    trigger: 'First-time viewer sends chat message',
    status: 'active',
    category: 'viewer',
    lastRun: '2023-10-22T14:45:00Z',
    createdAt: '2023-10-16T11:20:00Z',
    icon: <User className="h-5 w-5" />,
  },
  {
    id: 'workflow-3',
    title: 'Stream Segment Transition',
    description: 'Change scenes based on schedule',
    trigger: 'Every 30 minutes or manually triggered',
    status: 'scheduled',
    category: 'stream',
    lastRun: '2023-10-22T14:00:00Z',
    nextRun: '2023-10-22T15:00:00Z',
    createdAt: '2023-10-17T09:15:00Z',
    icon: <Timer className="h-5 w-5" />,
  },
  {
    id: 'workflow-4',
    title: 'Chat Message Filter',
    description: 'Filter out spam and inappropriate messages',
    trigger: 'New chat message contains filtered words',
    status: 'active',
    category: 'chat',
    lastRun: '2023-10-22T14:48:00Z',
    createdAt: '2023-10-18T13:30:00Z',
    icon: <ScrollText className="h-5 w-5" />,
  },
  {
    id: 'workflow-5',
    title: 'Custom API Integration',
    description: 'Connect to external service for custom alerts',
    trigger: 'Webhook event or API callback',
    status: 'inactive',
    category: 'custom',
    createdAt: '2023-10-19T16:45:00Z',
    icon: <Code className="h-5 w-5" />,
  },
  {
    id: 'workflow-6',
    title: 'Viewer Milestone Celebration',
    description: 'Celebrate when hitting follower milestones',
    trigger: 'Follower count reaches milestone (100, 500, 1000)',
    status: 'active',
    category: 'viewer',
    createdAt: '2023-10-20T10:20:00Z',
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 'workflow-7',
    title: 'Scheduled Reminder',
    description: 'Display reminder message at specific times',
    trigger: 'Specific times during stream (hourly)',
    status: 'scheduled',
    category: 'stream',
    nextRun: '2023-10-22T15:00:00Z',
    createdAt: '2023-10-21T08:10:00Z',
    icon: <Calendar className="h-5 w-5" />,
  },
];

interface WorkflowManagerProps {}

export function WorkflowManager({}: WorkflowManagerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [items, setItems] = useState<WorkflowItem[]>(workflows);
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentTab, setCurrentTab] = useState('workflows');

  const filteredWorkflows =
    activeCategory === 'all' ? items : items.filter(item => item.category === activeCategory);

  const getCategoryIcon = (category: WorkflowItem['category']) => {
    switch (category) {
      case 'engagement':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'chat':
        return <ScrollText className="h-4 w-4 text-blue-500" />;
      case 'viewer':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'stream':
        return <Timer className="h-4 w-4 text-amber-500" />;
      case 'custom':
        return <Code className="h-4 w-4 text-tiktok-pink" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: WorkflowItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <EnhancedBadge type="success" className="flex items-center gap-1">
            <PlayCircle className="h-3 w-3" />
            Active
          </EnhancedBadge>
        );
      case 'inactive':
        return (
          <EnhancedBadge variant="outline" className="flex items-center gap-1">
            <PauseCircle className="h-3 w-3" />
            Inactive
          </EnhancedBadge>
        );
      case 'scheduled':
        return (
          <EnhancedBadge type="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Scheduled
          </EnhancedBadge>
        );
      case 'disabled':
        return (
          <EnhancedBadge type="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            Disabled
          </EnhancedBadge>
        );
      default:
        return <EnhancedBadge variant="outline">Unknown</EnhancedBadge>;
    }
  };

  const getCategoryName = (category: WorkflowItem['category']) => {
    switch (category) {
      case 'engagement':
        return 'Engagement';
      case 'chat':
        return 'Chat';
      case 'viewer':
        return 'Viewer';
      case 'stream':
        return 'Stream';
      case 'custom':
        return 'Custom';
      default:
        return 'Unknown';
    }
  };

  const deleteWorkflow = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleStatus = (id: string) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          const newStatus = item.status === 'active' ? 'inactive' : 'active';
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleStreamStart = () => {
    console.log('Starting stream...');
    // Add stream start logic here
  };

  return (
    <div className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Automation</h2>
            <p className="text-muted-foreground">Manage your stream automations and workflows</p>
          </div>
          <TabsList>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Engagement</span>
            </TabsTrigger>
            <TabsTrigger value="pre-stream" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span>Pre-Stream</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="workflows" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="md:w-[200px] lg:w-[250px]">
              <div className="rounded-lg border shadow-sm">
                <div className="p-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => setActiveCategory('all')}
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Workflow</span>
                  </Button>
                </div>
                <Separator className="my-2" />
                <div className="px-3 py-2">
                  <h3 className="mb-2 text-sm font-medium leading-none">Categories</h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-2 font-normal',
                        activeCategory === 'all' && 'bg-accent'
                      )}
                      onClick={() => setActiveCategory('all')}
                    >
                      <Settings className="h-4 w-4" />
                      <span>All Workflows</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-2 font-normal',
                        activeCategory === 'engagement' && 'bg-accent'
                      )}
                      onClick={() => setActiveCategory('engagement')}
                    >
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Engagement</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-2 font-normal',
                        activeCategory === 'chat' && 'bg-accent'
                      )}
                      onClick={() => setActiveCategory('chat')}
                    >
                      <ScrollText className="h-4 w-4 text-blue-500" />
                      <span>Chat</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-2 font-normal',
                        activeCategory === 'viewer' && 'bg-accent'
                      )}
                      onClick={() => setActiveCategory('viewer')}
                    >
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>Viewer</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-2 font-normal',
                        activeCategory === 'stream' && 'bg-accent'
                      )}
                      onClick={() => setActiveCategory('stream')}
                    >
                      <Timer className="h-4 w-4 text-amber-500" />
                      <span>Stream</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-2 font-normal',
                        activeCategory === 'custom' && 'bg-accent'
                      )}
                      onClick={() => setActiveCategory('custom')}
                    >
                      <Code className="h-4 w-4 text-tiktok-pink" />
                      <span>Custom</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {activeCategory === 'all'
                        ? 'All Workflows'
                        : getCategoryName(activeCategory as WorkflowItem['category'])}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">Show inactive</label>
                        <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
                      </div>
                      <Select defaultValue="modified">
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modified">Last Modified</SelectItem>
                          <SelectItem value="created">Date Created</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <CardDescription>
                    {activeCategory === 'all'
                      ? 'Manage all your automated workflows'
                      : `Manage your ${getCategoryName(activeCategory as WorkflowItem['category']).toLowerCase()} automation workflows`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                    <div className="space-y-2">
                      {filteredWorkflows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
                          <h3 className="mt-4 text-lg font-medium">No workflows found</h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Get started by creating a new automation workflow
                          </p>
                          <Button className="mt-4 gap-2">
                            <Plus className="h-4 w-4" />
                            New Workflow
                          </Button>
                        </div>
                      ) : (
                        filteredWorkflows.map(workflow => (
                          <ContextMenu key={workflow.id}>
                            <ContextMenuTrigger>
                              <Card
                                className={cn(
                                  'transition-all hover:shadow-md',
                                  workflow.status === 'active'
                                    ? 'border-l-4 border-l-green-500'
                                    : ''
                                )}
                              >
                                <CardHeader className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={cn(
                                          'rounded-full p-2',
                                          workflow.category === 'engagement' &&
                                            'bg-green-100 dark:bg-green-900/20',
                                          workflow.category === 'chat' &&
                                            'bg-blue-100 dark:bg-blue-900/20',
                                          workflow.category === 'viewer' &&
                                            'bg-purple-100 dark:bg-purple-900/20',
                                          workflow.category === 'stream' &&
                                            'bg-amber-100 dark:bg-amber-900/20',
                                          workflow.category === 'custom' &&
                                            'bg-pink-100 dark:bg-pink-900/20'
                                        )}
                                      >
                                        {workflow.icon || getCategoryIcon(workflow.category)}
                                      </div>
                                      <div>
                                        <CardTitle className="text-base">
                                          {workflow.title}
                                        </CardTitle>
                                        <CardDescription className="mt-1 text-xs">
                                          {workflow.description}
                                        </CardDescription>
                                      </div>
                                    </div>
                                    <div>{getStatusBadge(workflow.status)}</div>
                                  </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-0">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Trigger: </span>
                                      <span>{workflow.trigger}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={workflow.status === 'active'}
                                        onCheckedChange={() => toggleStatus(workflow.id)}
                                      />
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => deleteWorkflow(workflow.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-64">
                              <ContextMenuItem className="flex items-center gap-2 text-green-600">
                                <PlayCircle className="h-4 w-4" />
                                <span>Run Now</span>
                              </ContextMenuItem>
                              <ContextMenuItem className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </ContextMenuItem>
                              <ContextMenuItem className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                <span>Duplicate</span>
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Advanced Configuration</span>
                                <ArrowRight className="ml-auto h-4 w-4" />
                              </ContextMenuItem>
                              <ContextMenuItem className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                <span>View Logs</span>
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                className="flex items-center gap-2 text-red-600"
                                onClick={() => deleteWorkflow(workflow.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span>Delete</span>
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <div className="text-xs text-muted-foreground">
                    Showing {filteredWorkflows.length} workflows
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Check className="h-4 w-4" />
                    <span>Run Selected</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <EngagementAutomation workflows={items.filter(item => item.category === 'engagement')} />
        </TabsContent>

        <TabsContent value="pre-stream">
          <PreStreamChecklist onStreamStart={handleStreamStart} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
