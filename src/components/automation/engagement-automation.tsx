'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  Gift,
  Users,
  UserPlus,
  Sparkles,
  Edit,
  Trash2,
  Plus,
  Bell,
  Clock,
  ThumbsUp,
  Award,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Play,
  MoreHorizontal,
  X,
  RotateCcw,
  Save,
  Download,
  Filter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EngagementAutomationProps {
  workflows: WorkflowItem[];
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'comment' | 'follow' | 'like' | 'gift' | 'share' | 'views' | 'multi';
  triggerValue?: string;
  action: 'message' | 'overlay' | 'notification' | 'sound' | 'scene' | 'command' | 'multi';
  actionValue: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  cooldown: number;
  condition?: string;
  executionCount: number;
  lastExecuted?: string;
}

const automationRules: AutomationRule[] = [
  {
    id: 'auto-1',
    name: 'New Follower Notification',
    description: 'Display an overlay when someone follows the channel',
    trigger: 'follow',
    action: 'overlay',
    actionValue: 'Thanks for following, {username}!',
    isActive: true,
    priority: 'medium',
    cooldown: 5,
    executionCount: 342,
    lastExecuted: '2023-10-22T14:32:10Z',
  },
  {
    id: 'auto-2',
    name: 'Gift Thank You',
    description: 'Thank users for sending gifts and display their username',
    trigger: 'gift',
    triggerValue: 'any gift',
    action: 'message',
    actionValue: 'Thank you @{username} for the {gift_name}! 🎁',
    isActive: true,
    priority: 'high',
    cooldown: 0,
    executionCount: 156,
    lastExecuted: '2023-10-22T14:45:22Z',
  },
  {
    id: 'auto-3',
    name: 'View Count Milestone',
    description: 'Celebrate when viewer count crosses a threshold',
    trigger: 'views',
    triggerValue: '1000 viewers',
    action: 'sound',
    actionValue: 'celebration.mp3',
    isActive: true,
    priority: 'high',
    cooldown: 3600,
    condition: 'viewerCount >= 1000',
    executionCount: 12,
    lastExecuted: '2023-10-21T20:15:45Z',
  },
  {
    id: 'auto-4',
    name: 'Comment Response',
    description: 'Auto-respond to comments containing specific keywords',
    trigger: 'comment',
    triggerValue: 'keywords: help, how to, tutorial',
    action: 'message',
    actionValue: '@{username} Check out my tutorial highlights in my profile!',
    isActive: false,
    priority: 'low',
    cooldown: 60,
    condition: 'messageContains("help", "how to", "tutorial")',
    executionCount: 78,
    lastExecuted: '2023-10-20T18:22:30Z',
  },
  {
    id: 'auto-5',
    name: 'Welcome Back Message',
    description: 'Welcome returning viewers who comment',
    trigger: 'comment',
    triggerValue: 'from returning viewer',
    action: 'message',
    actionValue: 'Welcome back, @{username}! Thanks for returning to the stream!',
    isActive: true,
    priority: 'medium',
    cooldown: 120,
    condition: 'isReturningViewer && isFirstCommentInStream',
    executionCount: 210,
    lastExecuted: '2023-10-22T14:50:15Z',
  },
];

export function EngagementAutomation({ workflows }: EngagementAutomationProps) {
  const [rules, setRules] = useState<AutomationRule[]>(automationRules);
  const [activeTab, setActiveTab] = useState('all');

  const getTriggerIcon = (trigger: AutomationRule['trigger']) => {
    switch (trigger) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-tiktok-pink" />;
      case 'gift':
        return <Gift className="h-4 w-4 text-amber-500" />;
      case 'share':
        return <Users className="h-4 w-4 text-indigo-500" />;
      case 'views':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'multi':
        return <Sparkles className="h-4 w-4 text-tiktok-pink" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: AutomationRule['action']) => {
    switch (action) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'overlay':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'notification':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'sound':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'scene':
        return <Play className="h-4 w-4 text-red-500" />;
      case 'command':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'multi':
        return <Settings className="h-4 w-4 text-tiktok-pink" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: AutomationRule['priority']) => {
    switch (priority) {
      case 'high':
        return <EnhancedBadge type="warning">High</EnhancedBadge>;
      case 'medium':
        return <EnhancedBadge type="info">Medium</EnhancedBadge>;
      case 'low':
        return <EnhancedBadge variant="outline">Low</EnhancedBadge>;
      default:
        return <EnhancedBadge variant="outline">Normal</EnhancedBadge>;
    }
  };

  const toggleRuleActive = (id: string) => {
    setRules(prev =>
      prev.map(rule => (rule.id === id ? { ...rule, isActive: !rule.isActive } : rule))
    );
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  const filteredRules = (status: string) => {
    if (status === 'all') return rules;
    return rules.filter(rule => {
      if (status === 'active') return rule.isActive;
      return !rule.isActive;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Engagement Automation
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create automated responses to viewer actions and engagement
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Automation
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>All Rules</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Active</span>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            <span>Inactive</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="all-triggers">
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Filter by trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-triggers">All Triggers</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
                <SelectItem value="follow">Follows</SelectItem>
                <SelectItem value="like">Likes</SelectItem>
                <SelectItem value="gift">Gifts</SelectItem>
                <SelectItem value="views">View Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Automation Rule</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Uses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules('all').map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      <div>
                        <span>{rule.name}</span>
                        <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex gap-1 items-center font-normal capitalize"
                        >
                          {getTriggerIcon(rule.trigger)}
                          <span>{rule.trigger}</span>
                        </Badge>
                        {rule.triggerValue && (
                          <span className="text-xs text-muted-foreground">{rule.triggerValue}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex gap-1 items-center font-normal capitalize"
                        >
                          {getActionIcon(rule.action)}
                          <span>{rule.action}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getPriorityBadge(rule.priority)}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleRuleActive(rule.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center">{rule.executionCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Play className="h-4 w-4" />
                              <span>Test</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              <span>Export</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <RotateCcw className="h-4 w-4" />
                              <span>Reset Stats</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-red-500"
                              onClick={() => deleteRule(rule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Automation Rule</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Uses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules('active').map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      <div>
                        <span>{rule.name}</span>
                        <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex gap-1 items-center font-normal capitalize"
                        >
                          {getTriggerIcon(rule.trigger)}
                          <span>{rule.trigger}</span>
                        </Badge>
                        {rule.triggerValue && (
                          <span className="text-xs text-muted-foreground">{rule.triggerValue}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex gap-1 items-center font-normal capitalize"
                        >
                          {getActionIcon(rule.action)}
                          <span>{rule.action}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getPriorityBadge(rule.priority)}</TableCell>
                    <TableCell className="text-center">{rule.executionCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRuleActive(rule.id)}
                        />
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Automation Rule</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Uses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules('inactive').map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      <div>
                        <span>{rule.name}</span>
                        <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex gap-1 items-center font-normal capitalize"
                        >
                          {getTriggerIcon(rule.trigger)}
                          <span>{rule.trigger}</span>
                        </Badge>
                        {rule.triggerValue && (
                          <span className="text-xs text-muted-foreground">{rule.triggerValue}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex gap-1 items-center font-normal capitalize"
                        >
                          {getActionIcon(rule.action)}
                          <span>{rule.action}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getPriorityBadge(rule.priority)}</TableCell>
                    <TableCell className="text-center">{rule.executionCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRuleActive(rule.id)}
                        />
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create New Automation</CardTitle>
          <CardDescription>
            Set up an automated response to a specific trigger or event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input id="rule-name" placeholder="e.g., New Follower Thank You" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger-type">Trigger Type</Label>
                <Select>
                  <SelectTrigger id="trigger-type">
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comment">Comment</SelectItem>
                    <SelectItem value="follow">Follow</SelectItem>
                    <SelectItem value="like">Like</SelectItem>
                    <SelectItem value="gift">Gift</SelectItem>
                    <SelectItem value="share">Share</SelectItem>
                    <SelectItem value="views">View Count</SelectItem>
                    <SelectItem value="multi">Multiple Conditions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Higher priority rules execute first when multiple rules match
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cooldown">Cooldown (seconds)</Label>
                  <span className="text-sm">10s</span>
                </div>
                <Slider defaultValue={[10]} min={0} max={300} step={5} />
                <p className="text-xs text-muted-foreground">
                  Minimum time between consecutive activations of this rule
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="action-type">Action Type</Label>
                <Select>
                  <SelectTrigger id="action-type">
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="message">Send Message</SelectItem>
                    <SelectItem value="overlay">Show Overlay</SelectItem>
                    <SelectItem value="notification">Show Notification</SelectItem>
                    <SelectItem value="sound">Play Sound</SelectItem>
                    <SelectItem value="scene">Change Scene</SelectItem>
                    <SelectItem value="command">Run Command</SelectItem>
                    <SelectItem value="multi">Multiple Actions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action-value">Action Content</Label>
                <Textarea
                  id="action-value"
                  placeholder="e.g., Thanks for following, {username}!"
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {'{username}'}, {'{gift_name}'}, {'{amount}'},{' '}
                  {'{timestamp}'}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="active" defaultChecked />
                <Label htmlFor="active">Enable this rule immediately</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Load Template</span>
            </div>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span>Test</span>
              </div>
            </Button>
            <Button>
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Create Automation</span>
              </div>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Workflow</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map(workflow => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">{workflow.title}</TableCell>
                <TableCell>{workflow.description}</TableCell>
                <TableCell>{workflow.trigger}</TableCell>
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
    </div>
  );
}
