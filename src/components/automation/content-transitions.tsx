'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
  ArrowLeft,
  FolderOpen,
  Clock,
  Settings,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Wand2,
  Video,
  Timer,
  Sparkles,
  Pause,
  Film,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface ContentTransitionsProps {
  workflows: WorkflowItem[];
}

interface TransitionItem {
  id: string;
  title: string;
  duration: number;
  transitionType: 'fade' | 'slide' | 'zoom' | 'flip' | 'custom';
  triggerType: 'timer' | 'manual' | 'engagement' | 'comment';
  triggerValue?: string;
  isActive: boolean;
}

const transitionItems: TransitionItem[] = [
  {
    id: 'transition-1',
    title: 'Intro to Main Content',
    duration: 2000,
    transitionType: 'fade',
    triggerType: 'timer',
    triggerValue: 'After 30 seconds',
    isActive: true,
  },
  {
    id: 'transition-2',
    title: 'Main to Q&A Section',
    duration: 1500,
    transitionType: 'slide',
    triggerType: 'engagement',
    triggerValue: 'High engagement',
    isActive: true,
  },
  {
    id: 'transition-3',
    title: 'Dance Challenge Segment',
    duration: 1000,
    transitionType: 'zoom',
    triggerType: 'manual',
    isActive: true,
  },
  {
    id: 'transition-4',
    title: 'Product Showcase',
    duration: 2500,
    transitionType: 'flip',
    triggerType: 'timer',
    triggerValue: 'After 15 minutes',
    isActive: false,
  },
  {
    id: 'transition-5',
    title: 'Closing Segment',
    duration: 3000,
    transitionType: 'custom',
    triggerType: 'comment',
    triggerValue: 'When viewers ask to wrap up',
    isActive: true,
  },
];

export function ContentTransitions({ workflows }: ContentTransitionsProps) {
  const [transitions, setTransitions] = useState<TransitionItem[]>(transitionItems);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(transitions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTransitions(items);
  };

  const getTransitionIcon = (type: TransitionItem['transitionType']) => {
    switch (type) {
      case 'fade':
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case 'slide':
        return <ArrowRight className="h-4 w-4 text-green-500" />;
      case 'zoom':
        return <Play className="h-4 w-4 text-amber-500" />;
      case 'flip':
        return <Film className="h-4 w-4 text-purple-500" />;
      case 'custom':
        return <Wand2 className="h-4 w-4 text-tiktok-pink" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  const getTriggerIcon = (type: TransitionItem['triggerType']) => {
    switch (type) {
      case 'timer':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'manual':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'engagement':
        return <ChevronUp className="h-4 w-4 text-tiktok-pink" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Content Transitions
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create seamless transitions between different content segments
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Transition
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Sequence</CardTitle>
          <CardDescription>Drag and drop to rearrange your content flow</CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="transitions">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {transitions.map((transition, index) => (
                    <Draggable key={transition.id} draggableId={transition.id} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`rounded-md border p-3 ${
                            transition.isActive ? '' : 'opacity-70'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">{transition.title}</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {getTransitionIcon(transition.transitionType)}
                                  <span className="capitalize">{transition.transitionType}</span>
                                  <span>•</span>
                                  {getTriggerIcon(transition.triggerType)}
                                  <span>{transition.triggerValue || 'Manual trigger'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch checked={transition.isActive} />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Play className="mr-2 h-4 w-4" />
                                    <span>Preview</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Transition
            </Button>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced">
          <AccordionTrigger className="text-sm font-medium">
            Advanced Configuration
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 p-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-duration">Default Duration (ms)</Label>
                  <Input id="default-duration" defaultValue="2000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-type">Default Transition Type</Label>
                  <Select defaultValue="fade">
                    <SelectTrigger id="default-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="flip">Flip</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="easing">Easing Function</Label>
                  <span className="text-sm">ease-in-out</span>
                </div>
                <Select defaultValue="ease-in-out">
                  <SelectTrigger id="easing">
                    <SelectValue placeholder="Select easing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ease">Ease</SelectItem>
                    <SelectItem value="ease-in">Ease In</SelectItem>
                    <SelectItem value="ease-out">Ease Out</SelectItem>
                    <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-continue" defaultChecked />
                <Label htmlFor="auto-continue">Auto-continue to next segment</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="preload" defaultChecked />
                <Label htmlFor="preload">Preload next segment assets</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow</TableHead>
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
                  <EnhancedBadge
                    variant={workflow.status === 'inactive' ? 'outline' : 'default'}
                    type={
                      workflow.status === 'active'
                        ? 'success'
                        : workflow.status === 'scheduled'
                          ? 'warning'
                          : undefined
                    }
                  >
                    {workflow.status}
                  </EnhancedBadge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

function MessageSquare(props: React.ComponentProps<typeof Play>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
