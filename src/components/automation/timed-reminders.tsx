'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Edit,
  Trash2,
  Plus,
  BellRing,
  AlarmClock,
  Calendar,
  Timer,
  RepeatClock,
  Bell,
  MessageSquare,
  Megaphone,
  Play,
  Settings,
  MoreHorizontal,
  CheckCircle,
  X,
  Hourglass,
  Repeat,
  Copy,
  BadgeAlert,
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
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimedRemindersProps {
  workflows: WorkflowItem[];
}

interface Reminder {
  id: string;
  title: string;
  message: string;
  type: 'interval' | 'timer' | 'duration' | 'scheduled';
  timing: string;
  displayType: 'notification' | 'overlay' | 'chat' | 'sound' | 'scene';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  repeat?: boolean;
  repeatCount?: number;
  lastTriggered?: string;
}

const reminders: Reminder[] = [
  {
    id: 'reminder-1',
    title: 'Hydration Reminder',
    message: 'Remember to drink water! Staying hydrated is important.',
    type: 'interval',
    timing: 'Every 30 minutes',
    displayType: 'overlay',
    priority: 'medium',
    isActive: true,
    repeat: true,
    lastTriggered: '2023-09-15T14:00:00Z',
  },
  {
    id: 'reminder-2',
    title: 'Stream Hashtag',
    message: "Don't forget to use #TikTokLive in your posts!",
    type: 'interval',
    timing: 'Every 15 minutes',
    displayType: 'chat',
    priority: 'low',
    isActive: true,
    repeat: true,
    lastTriggered: '2023-09-15T14:15:00Z',
  },
  {
    id: 'reminder-3',
    title: 'Q&A Session',
    message: "We'll be starting our Q&A session in 5 minutes!",
    type: 'timer',
    timing: 'After 25 minutes',
    displayType: 'notification',
    priority: 'high',
    isActive: true,
    repeat: false,
  },
  {
    id: 'reminder-4',
    title: 'Stream Ending Soon',
    message: 'Only 5 minutes left in our stream today!',
    type: 'duration',
    timing: '5 minutes before end',
    displayType: 'overlay',
    priority: 'high',
    isActive: true,
    repeat: false,
  },
  {
    id: 'reminder-5',
    title: 'Posture Check',
    message: 'Remember to sit up straight and check your posture!',
    type: 'interval',
    timing: 'Every 20 minutes',
    displayType: 'notification',
    priority: 'medium',
    isActive: false,
    repeat: true,
  },
  {
    id: 'reminder-6',
    title: 'Follow Reminder',
    message: 'If you enjoy the stream, hit that follow button!',
    type: 'interval',
    timing: 'Every 12 minutes',
    displayType: 'chat',
    priority: 'low',
    isActive: true,
    repeat: true,
    lastTriggered: '2023-09-15T14:12:00Z',
  },
];

export function TimedReminders({ workflows }: TimedRemindersProps) {
  const [reminderList, setReminderList] = useState<Reminder[]>(reminders);
  const [activeTab, setActiveTab] = useState('active');

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'interval':
        return <RepeatClock className="h-4 w-4 text-blue-500" />;
      case 'timer':
        return <Timer className="h-4 w-4 text-purple-500" />;
      case 'duration':
        return <Hourglass className="h-4 w-4 text-amber-500" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDisplayTypeIcon = (type: Reminder['displayType']) => {
    switch (type) {
      case 'notification':
        return <BellRing className="h-4 w-4 text-blue-500" />;
      case 'overlay':
        return <Megaphone className="h-4 w-4 text-purple-500" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'sound':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'scene':
        return <Play className="h-4 w-4 text-tiktok-pink" />;
      default:
        return <BellRing className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: Reminder['priority']) => {
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

  const toggleReminderActive = (id: string) => {
    setReminderList(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
      )
    );
  };

  const filteredReminders = (status: string) => {
    if (status === 'all') return reminderList;
    return reminderList.filter(reminder => {
      if (status === 'active') return reminder.isActive;
      return !reminder.isActive;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Timed Reminders
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Set up automated reminders for yourself and your viewers
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Reminder
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Active</span>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            <span>Inactive</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ReminderGrid
            reminders={filteredReminders('all')}
            getTypeIcon={getTypeIcon}
            getDisplayTypeIcon={getDisplayTypeIcon}
            getPriorityBadge={getPriorityBadge}
            toggleActive={toggleReminderActive}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <ReminderGrid
            reminders={filteredReminders('active')}
            getTypeIcon={getTypeIcon}
            getDisplayTypeIcon={getDisplayTypeIcon}
            getPriorityBadge={getPriorityBadge}
            toggleActive={toggleReminderActive}
          />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <ReminderGrid
            reminders={filteredReminders('inactive')}
            getTypeIcon={getTypeIcon}
            getDisplayTypeIcon={getDisplayTypeIcon}
            getPriorityBadge={getPriorityBadge}
            toggleActive={toggleReminderActive}
          />
        </TabsContent>
      </Tabs>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Workflow</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Trigger</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map(workflow => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">{workflow.title}</TableCell>
                <TableCell>{workflow.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{workflow.trigger}</span>
                  </div>
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

      <AddReminderDialog />
    </div>
  );
}

interface ReminderGridProps {
  reminders: Reminder[];
  getTypeIcon: (type: Reminder['type']) => React.ReactNode;
  getDisplayTypeIcon: (type: Reminder['displayType']) => React.ReactNode;
  getPriorityBadge: (priority: Reminder['priority']) => React.ReactNode;
  toggleActive: (id: string) => void;
}

function ReminderGrid({
  reminders,
  getTypeIcon,
  getDisplayTypeIcon,
  getPriorityBadge,
  toggleActive,
}: ReminderGridProps) {
  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
        <div className="rounded-full bg-primary/10 p-3">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No reminders found</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Create a new reminder to stay on track during your streams.
        </p>
        <AddReminderDialog buttonClassName="mt-4" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reminders.map(reminder => (
        <Card key={reminder.id} className={`${reminder.isActive ? '' : 'opacity-60'}`}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-1.5 ${
                    reminder.type === 'interval'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : reminder.type === 'timer'
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                        : reminder.type === 'duration'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}
                >
                  {getTypeIcon(reminder.type)}
                </div>
                <CardTitle className="text-base">{reminder.title}</CardTitle>
              </div>
              <Switch
                checked={reminder.isActive}
                onCheckedChange={() => toggleActive(reminder.id)}
              />
            </div>
            <CardDescription className="mt-1">{reminder.message}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Timing:</span>
                </div>
                <Badge variant="secondary">{reminder.timing}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {getDisplayTypeIcon(reminder.displayType)}
                    <span>Display as:</span>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {reminder.displayType}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BadgeAlert className="h-4 w-4" />
                  <span>Priority:</span>
                </div>
                {getPriorityBadge(reminder.priority)}
              </div>

              {reminder.lastTriggered && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlarmClock className="h-4 w-4" />
                    <span>Last triggered:</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(reminder.lastTriggered).toLocaleTimeString()}
                  </span>
                </div>
              )}
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
                    <Repeat className="h-4 w-4" />
                    <span>Trigger Now</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Copy className="h-4 w-4" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
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

      <Card className="flex flex-col items-center justify-center p-6 h-[272px]">
        <div className="rounded-full bg-primary/10 p-3">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 font-medium">Create New Reminder</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Add a reminder for yourself or your viewers
        </p>
        <AddReminderDialog />
      </Card>
    </div>
  );
}

function AddReminderDialog({ buttonClassName = 'mt-4 gap-1.5' }: { buttonClassName?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={buttonClassName}>
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Reminder</DialogTitle>
          <DialogDescription>Set up a reminder to display during your stream.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Reminder Title</Label>
            <Input id="title" placeholder="Hydration Reminder" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Reminder Message</Label>
            <Textarea
              id="message"
              placeholder="Remember to drink water! Staying hydrated is important."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reminder-type">Reminder Type</Label>
            <Select defaultValue="interval">
              <SelectTrigger>
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interval">Repeating Interval</SelectItem>
                <SelectItem value="timer">One-time Timer</SelectItem>
                <SelectItem value="duration">Stream Duration-based</SelectItem>
                <SelectItem value="scheduled">Scheduled Time</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How frequently or when this reminder should appear
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="interval">Time Interval</Label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="10">Every 10 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="20">Every 20 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                  <SelectItem value="custom">Custom interval</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display-type">Display Type</Label>
              <Select defaultValue="overlay">
                <SelectTrigger>
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="overlay">Stream Overlay</SelectItem>
                  <SelectItem value="chat">Chat Message</SelectItem>
                  <SelectItem value="sound">Sound Alert</SelectItem>
                  <SelectItem value="scene">Scene Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority Level</Label>
            <RadioGroup defaultValue="medium" className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="r1" className="peer sr-only" />
                <Label
                  htmlFor="r1"
                  className="flex items-center gap-1.5 rounded-md border p-2 peer-data-[state=checked]:border-primary hover:bg-accent peer-data-[state=checked]:bg-primary/5"
                >
                  <EnhancedBadge variant="outline">Low</EnhancedBadge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="r2" className="peer sr-only" />
                <Label
                  htmlFor="r2"
                  className="flex items-center gap-1.5 rounded-md border p-2 peer-data-[state=checked]:border-primary hover:bg-accent peer-data-[state=checked]:bg-primary/5"
                >
                  <EnhancedBadge type="info">Medium</EnhancedBadge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="r3" className="peer sr-only" />
                <Label
                  htmlFor="r3"
                  className="flex items-center gap-1.5 rounded-md border p-2 peer-data-[state=checked]:border-primary hover:bg-accent peer-data-[state=checked]:bg-primary/5"
                >
                  <EnhancedBadge type="warning">High</EnhancedBadge>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="repeat" defaultChecked />
            <Label htmlFor="repeat">Repeat reminder</Label>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Switch id="active" defaultChecked />
            <Label htmlFor="active">Enable this reminder immediately</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            <span>Advanced Options</span>
          </Button>
          <Button type="submit">Create Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
