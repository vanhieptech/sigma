'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Clock,
  Play,
  X,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  Zap,
  Wifi,
  Mic,
  Camera,
  MessageSquare,
  User,
  Lightbulb,
  Music,
  Layers,
  Battery,
  Smartphone,
  Text,
  Share2,
  Send,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  CheckCheck,
  RefreshCw,
  ArrowRight,
  Settings,
  ListChecks,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  isAutomatic: boolean;
  isCompleted: boolean;
  isRequired: boolean;
  category: 'technical' | 'content' | 'social' | 'personal' | 'custom';
  duration?: number; // in seconds
}

interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  items: ChecklistItem[];
  lastUsed?: string;
  isDefault?: boolean;
}

const defaultItems: ChecklistItem[] = [
  {
    id: 'net-speed',
    title: 'Check internet speed',
    description: 'Ensure upload speed is at least 10 Mbps',
    isAutomatic: true,
    isCompleted: false,
    isRequired: true,
    category: 'technical',
    duration: 5,
  },
  {
    id: 'mic-test',
    title: 'Test microphone',
    description: 'Make sure audio is clear and free of background noise',
    isAutomatic: true,
    isCompleted: false,
    isRequired: true,
    category: 'technical',
    duration: 10,
  },
  {
    id: 'camera-check',
    title: 'Check camera settings',
    description: 'Ensure lighting and framing are optimal',
    isAutomatic: false,
    isCompleted: false,
    isRequired: false,
    category: 'technical',
  },
  {
    id: 'battery',
    title: 'Charge devices',
    description: 'Ensure phone/tablet has at least 80% battery',
    isAutomatic: true,
    isCompleted: false,
    isRequired: true,
    category: 'technical',
  },
  {
    id: 'content-plan',
    title: 'Review content plan',
    description: 'Check your planned topics and activities',
    isAutomatic: false,
    isCompleted: false,
    isRequired: true,
    category: 'content',
  },
  {
    id: 'tags-title',
    title: 'Set stream title and tags',
    description: 'Optimize for discovery',
    isAutomatic: false,
    isCompleted: false,
    isRequired: true,
    category: 'content',
  },
  {
    id: 'social-notify',
    title: 'Social media notification',
    description: 'Post about going live on other platforms',
    isAutomatic: true,
    isCompleted: false,
    isRequired: false,
    category: 'social',
    duration: 15,
  },
  {
    id: 'water',
    title: 'Get water ready',
    description: 'Stay hydrated during your stream',
    isAutomatic: false,
    isCompleted: false,
    isRequired: false,
    category: 'personal',
  },
  {
    id: 'distraction-free',
    title: 'Create distraction-free environment',
    description: 'Put phone on silent, notify household members',
    isAutomatic: false,
    isCompleted: false,
    isRequired: false,
    category: 'personal',
  },
  {
    id: 'test-broadcast',
    title: 'Private test broadcast',
    description: 'Do a quick 30-second test to ensure everything works',
    isAutomatic: true,
    isCompleted: false,
    isRequired: true,
    category: 'technical',
    duration: 30,
  },
];

const templates: ChecklistTemplate[] = [
  {
    id: 'default',
    name: 'Standard Stream Checklist',
    description: 'The default preparation checklist for all streams',
    items: defaultItems,
    isDefault: true,
    lastUsed: '2023-10-24',
  },
  {
    id: 'music',
    name: 'Music Performance Stream',
    description: 'Specialized checklist for music performances',
    items: [
      ...defaultItems.filter(item => item.category === 'technical' || item.category === 'personal'),
      {
        id: 'audio-levels',
        title: 'Check audio levels',
        description: 'Set appropriate levels for voice and instruments',
        isAutomatic: true,
        isCompleted: false,
        isRequired: true,
        category: 'technical',
        duration: 5,
      },
      {
        id: 'music-rights',
        title: 'Verify music rights',
        description: 'Ensure all music is cleared for streaming',
        isAutomatic: false,
        isCompleted: false,
        isRequired: true,
        category: 'content',
      },
      {
        id: 'setlist',
        title: 'Finalize setlist',
        description: 'Organize your performance order',
        isAutomatic: false,
        isCompleted: false,
        isRequired: true,
        category: 'content',
      },
    ],
    lastUsed: '2023-10-15',
  },
  {
    id: 'collab',
    name: 'Collaboration Stream',
    description: 'Checklist for streams with guests or collaborators',
    items: [
      ...defaultItems.filter(item => item.category === 'technical' || item.category === 'personal'),
      {
        id: 'guest-connection',
        title: 'Test guest connection',
        description: 'Ensure collaborator has stable internet and clear audio',
        isAutomatic: true,
        isCompleted: false,
        isRequired: true,
        category: 'technical',
      },
      {
        id: 'topics-shared',
        title: 'Share planned topics with guest',
        description: 'Brief your collaborator on content plan',
        isAutomatic: false,
        isCompleted: false,
        isRequired: true,
        category: 'content',
      },
      {
        id: 'promote-collab',
        title: 'Cross-promotion',
        description: 'Coordinate promo posts with your guest',
        isAutomatic: false,
        isCompleted: false,
        isRequired: false,
        category: 'social',
      },
    ],
    lastUsed: '2023-09-30',
  },
];

interface PreStreamChecklistProps {
  onStreamStart?: () => void;
}

export function PreStreamChecklist({ onStreamStart }: PreStreamChecklistProps) {
  const [activeTemplate, setActiveTemplate] = useState<ChecklistTemplate>(templates[0]);
  const [items, setItems] = useState<ChecklistItem[]>(activeTemplate.items);
  const [activeTab, setActiveTab] = useState('current');
  const [progress, setProgress] = useState(0);
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [runningCheck, setRunningCheck] = useState<string | null>(null);
  const [isRunningChecklist, setIsRunningChecklist] = useState(false);
  const [checklistCompleted, setChecklistCompleted] = useState(false);

  // Calculate important items completion
  const importantItems = items.filter(item => item.isRequired);
  const completedImportantItems = importantItems.filter(item => item.isCompleted);
  const importantProgress =
    importantItems.length > 0
      ? Math.round((completedImportantItems.length / importantItems.length) * 100)
      : 100;

  const handleCheckItem = (id: string, checked: boolean) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, isCompleted: checked };
      }
      return item;
    });

    setItems(newItems);

    // Update progress
    const completed = newItems.filter(item => item.isCompleted).length;
    setProgress(Math.round((completed / newItems.length) * 100));
  };

  const handleSelectTemplate = (templateId: string) => {
    const selected = templates.find(t => t.id === templateId);
    if (selected) {
      setActiveTemplate(selected);
      setItems(selected.items);

      // Reset progress
      const completed = selected.items.filter(item => item.isCompleted).length;
      setProgress(Math.round((completed / selected.items.length) * 100));
    }
  };

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'technical':
        return <Wifi className="h-4 w-4 text-blue-500" />;
      case 'content':
        return <Layers className="h-4 w-4 text-purple-500" />;
      case 'social':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'personal':
        return <User className="h-4 w-4 text-amber-500" />;
      case 'custom':
        return <Zap className="h-4 w-4 text-tiktok-pink" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  const areAllImportantCompleted = importantItems.every(item => item.isCompleted);

  const filteredItems = showCompleted ? items : items.filter(item => !item.isCompleted);

  const groupedItems = filteredItems.reduce(
    (groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    },
    {} as Record<string, ChecklistItem[]>
  );

  const categories = Object.keys(groupedItems) as Array<ChecklistItem['category']>;

  const toggleItemCompletion = (id: string) => {
    setItems(
      items.map(item => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const runAutomaticCheck = (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item || !item.isAutomatic) return;

    setRunningCheck(id);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunningCheck(null);
          toggleItemCompletion(id);
          return 0;
        }
        return prev + 100 / (item.duration || 10);
      });
    }, 100);
  };

  const runAllAutomaticChecks = () => {
    setIsRunningChecklist(true);
    setChecklistCompleted(false);

    const automaticItems = items
      .filter(item => item.isAutomatic && !item.isCompleted)
      .map(item => item.id);

    let currentIndex = 0;

    const runNextCheck = () => {
      if (currentIndex >= automaticItems.length) {
        setIsRunningChecklist(false);

        const allRequiredCompleted = items.every(item => !item.isRequired || item.isCompleted);

        setChecklistCompleted(allRequiredCompleted);
        return;
      }

      const itemId = automaticItems[currentIndex];
      const item = items.find(item => item.id === itemId);

      setRunningCheck(itemId);
      setProgress(0);

      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 100 / (item?.duration || 10);

        if (progressValue >= 100) {
          clearInterval(interval);
          setRunningCheck(null);

          setItems(prev => prev.map(i => (i.id === itemId ? { ...i, isCompleted: true } : i)));

          currentIndex++;
          setTimeout(runNextCheck, 500);
        } else {
          setProgress(progressValue);
        }
      }, 100);
    };

    runNextCheck();
  };

  const addNewItem = () => {
    const newItem: ChecklistItem = {
      id: `check-${items.length + 1}`,
      title: 'New checklist item',
      isAutomatic: false,
      isCompleted: false,
      isRequired: false,
      category: 'custom',
    };

    setItems([...items, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getCompletedCount = () => {
    return items.filter(item => item.isCompleted).length;
  };

  const getRequiredCompletedCount = () => {
    const requiredItems = items.filter(item => item.isRequired);
    return requiredItems.filter(item => item.isCompleted).length;
  };

  const getRequiredCount = () => {
    return items.filter(item => item.isRequired).length;
  };

  const isStreamReady = () => {
    return items.every(item => !item.isRequired || item.isCompleted);
  };

  const filteredItemsByCategory =
    activeCategory === 'all'
      ? items
      : items.filter(item =>
          activeCategory === 'automatic'
            ? item.isAutomatic
            : activeCategory === 'manual'
              ? !item.isAutomatic
              : item.category === activeCategory
        );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Pre-Stream Checklist
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Complete these items before starting your stream
          </p>
        </div>

        {isStreamReady() ? (
          <Button className="gap-2" onClick={onStreamStart}>
            <Play className="h-4 w-4" />
            Start Stream
          </Button>
        ) : (
          <Button variant="outline" className="gap-2" onClick={runAllAutomaticChecks}>
            <RotateCw className="h-4 w-4" />
            Run Auto-Checks
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>Overall progress</div>
                    <div className="font-medium">
                      {getCompletedCount()}/{items.length}
                    </div>
                  </div>
                  <Progress value={(getCompletedCount() / items.length) * 100} />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>Required items</div>
                    <div className="font-medium">
                      {getRequiredCompletedCount()}/{getRequiredCount()}
                    </div>
                  </div>
                  <Progress
                    value={(getRequiredCompletedCount() / getRequiredCount()) * 100}
                    className={!isStreamReady() ? 'bg-red-100 dark:bg-red-900/20' : ''}
                  />
                </div>

                <Separator />

                <div className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Stream status</div>
                    {isStreamReady() ? (
                      <EnhancedBadge type="success" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Ready
                      </EnhancedBadge>
                    ) : (
                      <EnhancedBadge type="warning" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Not Ready
                      </EnhancedBadge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 font-normal',
                    activeCategory === 'all' && 'bg-accent'
                  )}
                  onClick={() => setActiveCategory('all')}
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>All Items</span>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 font-normal',
                    activeCategory === 'automatic' && 'bg-accent'
                  )}
                  onClick={() => setActiveCategory('automatic')}
                >
                  <RotateCw className="h-4 w-4 text-blue-500" />
                  <span>Automatic Checks</span>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 font-normal',
                    activeCategory === 'manual' && 'bg-accent'
                  )}
                  onClick={() => setActiveCategory('manual')}
                >
                  <CheckCheck className="h-4 w-4 text-green-500" />
                  <span>Manual Checks</span>
                </Button>

                <Separator className="my-2" />

                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 font-normal',
                    activeCategory === 'technical' && 'bg-accent'
                  )}
                  onClick={() => setActiveCategory('technical')}
                >
                  <Settings className="h-4 w-4 text-indigo-500" />
                  <span>Technical</span>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 font-normal',
                    activeCategory === 'content' && 'bg-accent'
                  )}
                  onClick={() => setActiveCategory('content')}
                >
                  <Layers className="h-4 w-4 text-purple-500" />
                  <span>Content</span>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 font-normal',
                    activeCategory === 'social' && 'bg-accent'
                  )}
                  onClick={() => setActiveCategory('social')}
                >
                  <MessageSquare className="h-4 w-4 text-tiktok-pink" />
                  <span>Social</span>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 font-normal',
                    activeCategory === 'personal' && 'bg-accent'
                  )}
                  onClick={() => setActiveCategory('personal')}
                >
                  <User className="h-4 w-4 text-amber-500" />
                  <span>Personal</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2" onClick={addNewItem}>
                <Plus className="h-4 w-4" />
                <span>Add Custom Item</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Checklist Items</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {getCompletedCount()} of {items.length} completed
                </div>
              </div>
              <CardDescription>
                Complete all required items before starting your stream
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                <div className="space-y-2">
                  {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-8">
                      <ListChecks className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No items in this category</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try selecting a different category or add a new item
                      </p>
                    </div>
                  ) : (
                    filteredItems.map(item => (
                      <Card
                        key={item.id}
                        className={cn(
                          'transition-all',
                          item.isCompleted && 'bg-accent/50 dark:bg-accent/20',
                          item.isRequired && !item.isCompleted && 'border-l-4 border-l-amber-500'
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="pt-0.5">
                                {item.isAutomatic ? (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className={cn(
                                      'h-5 w-5 rounded-full',
                                      item.isCompleted &&
                                        'bg-green-500 text-white border-green-500',
                                      runningCheck === item.id && 'animate-pulse'
                                    )}
                                    onClick={() => runAutomaticCheck(item.id)}
                                    disabled={runningCheck !== null || item.isCompleted}
                                  >
                                    {item.isCompleted ? (
                                      <CheckCircle className="h-3 w-3" />
                                    ) : (
                                      <RotateCw className="h-3 w-3" />
                                    )}
                                  </Button>
                                ) : (
                                  <Checkbox
                                    id={`check-${item.id}`}
                                    checked={item.isCompleted}
                                    onCheckedChange={() => toggleItemCompletion(item.id)}
                                  />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor={`check-${item.id}`}
                                    className={cn(
                                      'text-base font-medium',
                                      item.isCompleted && 'line-through text-muted-foreground'
                                    )}
                                  >
                                    {item.title}
                                  </Label>
                                  {item.isRequired && (
                                    <EnhancedBadge variant="outline" className="h-5 text-[10px]">
                                      Required
                                    </EnhancedBadge>
                                  )}
                                  <EnhancedBadge
                                    variant="outline"
                                    className="h-5 text-[10px] capitalize"
                                  >
                                    {item.category}
                                  </EnhancedBadge>
                                </div>
                                {item.description && (
                                  <p
                                    className={cn(
                                      'text-sm text-muted-foreground mt-1',
                                      item.isCompleted && 'line-through'
                                    )}
                                  >
                                    {item.description}
                                  </p>
                                )}

                                {runningCheck === item.id && (
                                  <div className="mt-2 w-full">
                                    <Progress value={progress} className="h-1" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2"
                                    onClick={() => {
                                      setItems(prev =>
                                        prev.map(i =>
                                          i.id === item.id ? { ...i, isRequired: !i.isRequired } : i
                                        )
                                      );
                                    }}
                                  >
                                    {item.isRequired ? (
                                      <>
                                        <X className="h-4 w-4" />
                                        <span>Make Optional</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Make Required</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2"
                                    onClick={() => {
                                      setItems(prev =>
                                        prev.map(i =>
                                          i.id === item.id
                                            ? { ...i, isAutomatic: !i.isAutomatic }
                                            : i
                                        )
                                      );
                                    }}
                                  >
                                    {item.isAutomatic ? (
                                      <>
                                        <Checkbox className="h-4 w-4" />
                                        <span>Make Manual</span>
                                      </>
                                    ) : (
                                      <>
                                        <RotateCw className="h-4 w-4" />
                                        <span>Make Automatic</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 text-red-600"
                                    onClick={() => deleteItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t flex justify-between px-6 py-4">
              <div className="text-xs text-muted-foreground">
                {checklistCompleted ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                    All required items completed! Ready to stream.
                  </span>
                ) : (
                  <span>Complete all required items to start your stream</span>
                )}
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  // Reset all items
                  setItems(prev => prev.map(item => ({ ...item, isCompleted: false })));
                  setChecklistCompleted(false);
                }}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset All</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
