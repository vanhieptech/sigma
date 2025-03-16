'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Edit,
  Trash2,
  Plus,
  Heart,
  Gift,
  Users,
  Trophy,
  Star,
  PlayCircle,
  MessageSquare,
  BellRing,
  Settings,
  Code,
  MessagesSquare,
  Sparkles,
  Filter,
  Clock,
  Settings2,
  Braces,
  DollarSign,
  Medal,
  Lightbulb,
  ShieldCheck,
  Send,
  X,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AutoResponsesProps {
  workflows: WorkflowItem[];
}

interface ResponseTemplate {
  id: string;
  name: string;
  triggerType: 'follow' | 'gift' | 'comment' | 'join' | 'milestone' | 'question';
  triggerCondition: string;
  responseType: 'chat' | 'overlay' | 'scene' | 'custom';
  responseContent: string;
  isActive: boolean;
  variables?: string[];
}

const responseTemplates: ResponseTemplate[] = [
  {
    id: 'response-1',
    name: 'New Follower Thank You',
    triggerType: 'follow',
    triggerCondition: 'Any new follower',
    responseType: 'chat',
    responseContent: 'Thanks for following, {username}! Welcome to the community! 👋',
    isActive: true,
    variables: ['{username}', '{follower_count}'],
  },
  {
    id: 'response-2',
    name: 'Gift Appreciation',
    triggerType: 'gift',
    triggerCondition: 'Gift value > 500 coins',
    responseType: 'overlay',
    responseContent: 'Huge thanks to {username} for the amazing gift! 🎁',
    isActive: true,
    variables: ['{username}', '{gift_name}', '{gift_value}'],
  },
  {
    id: 'response-3',
    name: 'Question Response',
    triggerType: 'question',
    triggerCondition: 'Comment starts with "How" or "What"',
    responseType: 'chat',
    responseContent: 'Great question, {username}! Let me answer that for you.',
    isActive: true,
    variables: ['{username}', '{question}'],
  },
  {
    id: 'response-4',
    name: 'Follower Milestone',
    triggerType: 'milestone',
    triggerCondition: 'Follower count multiple of 1000',
    responseType: 'scene',
    responseContent: 'celebration',
    isActive: true,
    variables: ['{follower_count}', '{milestone}'],
  },
  {
    id: 'response-5',
    name: 'Regular Viewer Welcome',
    triggerType: 'join',
    triggerCondition: 'Previously seen > 5 times',
    responseType: 'chat',
    responseContent: 'Welcome back, {username}! Great to see you again! 😊',
    isActive: false,
    variables: ['{username}', '{visit_count}'],
  },
  {
    id: 'response-6',
    name: 'Comment Trend Detection',
    triggerType: 'comment',
    triggerCondition: 'Similar comments > 5 in 1 minute',
    responseType: 'custom',
    responseContent: 'I notice many of you are commenting about {topic}. Let me address that!',
    isActive: false,
    variables: ['{topic}', '{comment_count}'],
  },
];

const variableList = [
  '{username}',
  '{follower_count}',
  '{gift_name}',
  '{gift_value}',
  '{question}',
  '{milestone}',
  '{visit_count}',
  '{topic}',
  '{comment_count}',
  '{stream_title}',
  '{stream_duration}',
  '{current_time}',
];

export function AutoResponses({ workflows }: AutoResponsesProps) {
  const [templates, setTemplates] = useState<ResponseTemplate[]>(responseTemplates);
  const [activeTab, setActiveTab] = useState('templates');

  const getTriggerIcon = (type: ResponseTemplate['triggerType']) => {
    switch (type) {
      case 'follow':
        return <Heart className="h-4 w-4 text-tiktok-pink" />;
      case 'gift':
        return <Gift className="h-4 w-4 text-tiktok-cyan" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'join':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'milestone':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'question':
        return <MessagesSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getResponseTypeIcon = (type: ResponseTemplate['responseType']) => {
    switch (type) {
      case 'chat':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'overlay':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'scene':
        return <PlayCircle className="h-4 w-4 text-tiktok-pink" />;
      case 'custom':
        return <Braces className="h-4 w-4 text-amber-500" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getResponseTypeLabel = (type: ResponseTemplate['responseType']) => {
    switch (type) {
      case 'chat':
        return 'Chat Message';
      case 'overlay':
        return 'Overlay Alert';
      case 'scene':
        return 'Scene Change';
      case 'custom':
        return 'Custom Action';
      default:
        return 'Response';
    }
  };

  const insertVariable = (variable: string) => {
    // This function would be used to insert variables into the response content editor
    console.log(`Inserting variable: ${variable}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Auto-Response Workflows
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automate responses to viewer actions to increase engagement
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Response Templates</span>
          </TabsTrigger>
          <TabsTrigger value="variables" className="flex items-center gap-2">
            <Braces className="h-4 w-4" />
            <span>Variables</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Moderation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map(template => (
              <Card key={template.id} className={!template.isActive ? 'opacity-70' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-full ${
                          template.triggerType === 'follow'
                            ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                            : template.triggerType === 'gift'
                              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
                              : template.triggerType === 'comment'
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                : template.triggerType === 'join'
                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                  : template.triggerType === 'milestone'
                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}
                      >
                        {getTriggerIcon(template.triggerType)}
                      </div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <Switch checked={template.isActive} />
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Filter className="h-3 w-3 text-muted-foreground" />
                    <span>{template.triggerCondition}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border p-3 bg-muted/30 text-sm">
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {getResponseTypeIcon(template.responseType)}
                      <span>{getResponseTypeLabel(template.responseType)}</span>
                    </div>
                    <div className="font-medium">{template.responseContent}</div>
                    {template.variables && template.variables.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {template.variables.map(variable => (
                          <Badge
                            key={variable}
                            variant="outline"
                            className="text-xs bg-background/70"
                          >
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="flex flex-col items-center justify-center p-6 h-[264px]">
              <div className="rounded-full bg-primary/10 p-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Create Template</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Add a new auto-response template
              </p>
              <AddResponseDialog variables={variableList} />
            </Card>
          </div>

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
                        {workflow.trigger.includes('Follower') ? (
                          <Heart className="h-4 w-4 text-tiktok-pink" />
                        ) : workflow.trigger.includes('Gift') ? (
                          <Gift className="h-4 w-4 text-tiktok-cyan" />
                        ) : workflow.trigger.includes('Question') ? (
                          <MessagesSquare className="h-4 w-4 text-purple-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">{workflow.trigger}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {workflow.status === 'active' ? (
                        <EnhancedBadge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </EnhancedBadge>
                      ) : workflow.status === 'scheduled' ? (
                        <EnhancedBadge className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                          Scheduled
                        </EnhancedBadge>
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

        <TabsContent value="variables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Variables</CardTitle>
              <CardDescription>
                Use these variables in your responses to personalize them for each viewer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Viewer Variables</span>
                  </h4>
                  <div className="rounded-md border divide-y">
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{username}'}</div>
                      <Badge variant="outline">Username</Badge>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{visit_count}'}</div>
                      <Badge variant="outline">Visit Count</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Engagement Variables</span>
                  </h4>
                  <div className="rounded-md border divide-y">
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{follower_count}'}</div>
                      <Badge variant="outline">Followers</Badge>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{milestone}'}</div>
                      <Badge variant="outline">Milestone</Badge>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{gift_name}'}</div>
                      <Badge variant="outline">Gift Name</Badge>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{gift_value}'}</div>
                      <Badge variant="outline">Gift Value</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span>Content Variables</span>
                  </h4>
                  <div className="rounded-md border divide-y">
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{question}'}</div>
                      <Badge variant="outline">Question</Badge>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{topic}'}</div>
                      <Badge variant="outline">Topic</Badge>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{comment_count}'}</div>
                      <Badge variant="outline">Comment Count</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-tiktok-pink" />
                    <span>Stream Variables</span>
                  </h4>
                  <div className="rounded-md border divide-y">
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{stream_title}'}</div>
                      <Badge variant="outline">Stream Title</Badge>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{stream_duration}'}</div>
                      <Badge variant="outline">Duration</Badge>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <div className="font-mono text-sm">{'{current_time}'}</div>
                      <Badge variant="outline">Current Time</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Code className="h-4 w-4 text-purple-500" />
                    <span>Custom Variables</span>
                  </h4>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">
                      Create custom variables to use in your responses
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Custom Variable</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variables Usage</CardTitle>
              <CardDescription>How to use variables in your auto-responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h4 className="font-medium mb-2">Example:</h4>
                  <p className="text-sm">
                    "Thanks for the {'{gift_name}'}, {'{username}'}! That's really generous of you!"
                  </p>
                  <p className="text-sm mt-3">
                    Would appear as: "Thanks for the Rose, TikTokUser123! That's really generous of
                    you!"
                  </p>
                </div>

                <div className="rounded-md border p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Tips for using variables</h4>
                      <ul className="text-sm mt-1 space-y-1.5 list-disc list-inside text-muted-foreground">
                        <li>Surround variable names with curly braces: {'{variable_name}'}</li>
                        <li>
                          Variables will be replaced with actual values when response is triggered
                        </li>
                        <li>
                          If a variable is not available, it will be replaced with a sensible
                          default
                        </li>
                        <li>You can combine multiple variables in a single response</li>
                        <li>Custom variables must be defined before they can be used</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span>View Documentation</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Moderation Settings</CardTitle>
              <CardDescription>
                Configure how automation handles potential moderation issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="spam-detection">Spam Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Detect and handle repeated messages and spam
                    </p>
                  </div>
                  <Switch id="spam-detection" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="keyword-filter">Keyword Filtering</Label>
                    <p className="text-sm text-muted-foreground">
                      Filter responses for sensitive or inappropriate content
                    </p>
                  </div>
                  <Switch id="keyword-filter" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profanity-filter">Profanity Filter</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent responses that contain profanity
                    </p>
                  </div>
                  <Switch id="profanity-filter" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ai-filter">AI Content Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Identify AI-generated spam or harmful content
                    </p>
                  </div>
                  <Switch id="ai-filter" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="moderation-action">Moderation Action</Label>
                <Select defaultValue="remove">
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flag">Flag for review</SelectItem>
                    <SelectItem value="remove">Remove automatically</SelectItem>
                    <SelectItem value="replace">Replace with safe version</SelectItem>
                    <SelectItem value="block">Block user temporarily</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  What to do when problematic content is detected
                </p>
              </div>

              <div className="space-y-2">
                <Label>Custom Keywords</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-12">
                  <Badge variant="secondary" className="gap-1">
                    <span>badword</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <span>inappropriate</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <span>spam</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Input
                    placeholder="Add keyword..."
                    className="flex-1 min-w-[100px] border-none h-7 px-2 py-1 focus-visible:ring-0 shadow-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Add custom keywords to filter from responses
                </p>
              </div>

              <div className="rounded-md border p-4 bg-amber-50 dark:bg-amber-950/20">
                <div className="flex gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">
                      Moderation Notice
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Auto-responses are still subject to TikTok's Community Guidelines. Even with
                      moderation filters, ensure all responses comply with platform rules.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Auto-Response
        </Button>
      </div>
    </div>
  );
}

function AddResponseDialog({ variables }: { variables: string[] }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = (variable: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = before + variable + after;
    textarea.value = newText;

    // Set cursor position after the inserted variable
    const newPosition = start + variable.length;
    textarea.selectionStart = newPosition;
    textarea.selectionEnd = newPosition;
    textarea.focus();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4 gap-1.5">
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Auto-Response</DialogTitle>
          <DialogDescription>Set up a new automated response to viewer actions.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Response Name</Label>
            <Input id="name" placeholder="New Follower Thank You" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select defaultValue="follow">
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow">New Follower</SelectItem>
                  <SelectItem value="gift">Gift Received</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="join">Viewer Join</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="response-type">Response Type</Label>
              <Select defaultValue="chat">
                <SelectTrigger>
                  <SelectValue placeholder="Select response type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chat">Chat Message</SelectItem>
                  <SelectItem value="overlay">Overlay Alert</SelectItem>
                  <SelectItem value="scene">Scene Change</SelectItem>
                  <SelectItem value="custom">Custom Action</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="trigger-condition">Trigger Condition</Label>
            <Input id="trigger-condition" placeholder="Any new follower" />
            <p className="text-xs text-muted-foreground">
              Specific condition that will trigger this response
            </p>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="response-content">Response Content</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    <Braces className="h-3.5 w-3.5" />
                    <span>Insert Variable</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search variables..." />
                    <CommandList>
                      <CommandEmpty>No variables found</CommandEmpty>
                      <CommandGroup heading="Variables">
                        <ScrollArea className="h-60">
                          {variables.map(variable => (
                            <CommandItem
                              key={variable}
                              onSelect={() => insertVariable(variable)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Braces className="h-3.5 w-3.5" />
                              <span className="font-mono text-sm">{variable}</span>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Textarea
              id="response-content"
              placeholder="Thanks for following, {username}! Welcome to the community! 👋"
              className="min-h-[100px]"
              ref={textareaRef}
            />
            <p className="text-xs text-muted-foreground">
              Use variables like {'{username}'} to personalize your response
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="active" defaultChecked />
            <Label htmlFor="active">Enable this auto-response immediately</Label>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Create Auto-Response</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
