import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, BellRing, Plus, Edit, Trash2, Play, Pause, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';

export const metadata: Metadata = {
  title: 'Timed Reminders - TikTok Streaming',
  description: 'Set up automated reminders for your TikTok streams',
};

interface Reminder {
  id: string;
  title: string;
  message: string;
  interval: number; // in minutes
  active: boolean;
  type: 'call-to-action' | 'engagement' | 'info' | 'promotion' | 'custom';
}

const reminderGroups: Record<string, Reminder[]> = {
  'Call to Action': [
    {
      id: 'reminder-1',
      title: 'Follow Reminder',
      message: "If you're enjoying the stream, don't forget to follow!",
      interval: 15,
      active: true,
      type: 'call-to-action',
    },
    {
      id: 'reminder-2',
      title: 'Like Reminder',
      message: "Tap the heart button if you're enjoying the content!",
      interval: 10,
      active: true,
      type: 'call-to-action',
    },
  ],
  Engagement: [
    {
      id: 'reminder-3',
      title: 'Ask Questions',
      message: 'Got questions? Drop them in the comments!',
      interval: 12,
      active: true,
      type: 'engagement',
    },
    {
      id: 'reminder-4',
      title: 'Comment Topics',
      message: 'What topics would you like to see next? Let me know in the comments!',
      interval: 25,
      active: false,
      type: 'engagement',
    },
  ],
  Promotional: [
    {
      id: 'reminder-5',
      title: 'Product Mention',
      message: "Check out the link in my bio for the products I'm using today!",
      interval: 20,
      active: true,
      type: 'promotion',
    },
  ],
  Informational: [
    {
      id: 'reminder-6',
      title: 'Stream Schedule',
      message: 'I stream every Tuesday and Thursday at 7 PM!',
      interval: 30,
      active: true,
      type: 'info',
    },
  ],
};

export default function TimedRemindersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Timed Reminders</h2>
        <p className="text-muted-foreground">
          Schedule automated reminders to keep your audience engaged
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Reminder Settings</CardTitle>
            <CardDescription>Configure global reminder settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">Enable all reminders</span>
                <span className="text-xs text-muted-foreground">
                  Toggle all reminders on or off
                </span>
              </div>
              <Switch checked={true} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">Display notification</span>
                <span className="text-xs text-muted-foreground">
                  Show notification when reminders are triggered
                </span>
              </div>
              <Switch checked={true} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">Auto-pause during high activity</span>
                <span className="text-xs text-muted-foreground">
                  Pause reminders when chat is very active
                </span>
              </div>
              <Switch checked={true} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">Display duration</span>
                <span className="text-xs text-muted-foreground">
                  How long reminders appear on screen
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">10 seconds</span>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2">
              <BellRing className="h-4 w-4" />
              <span>Run Test Reminder</span>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Reminders</CardTitle>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>New Reminder</span>
              </Button>
            </div>
            <CardDescription>Manage your automated stream reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-6">
                {Object.entries(reminderGroups).map(([group, reminders]) => (
                  <div key={group} className="space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-medium">
                      {group === 'Call to Action' && <Check className="h-4 w-4 text-green-500" />}
                      {group === 'Engagement' && <BellRing className="h-4 w-4 text-blue-500" />}
                      {group === 'Promotional' && <Play className="h-4 w-4 text-tiktok-pink" />}
                      {group === 'Informational' && <Clock className="h-4 w-4 text-amber-500" />}
                      {group}
                    </h3>
                    <div className="space-y-2">
                      {reminders.map(reminder => (
                        <Card key={reminder.id} className="transition-all hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{reminder.title}</h4>
                                  <EnhancedBadge variant="outline" className="h-5 text-[10px]">
                                    Every {reminder.interval} min
                                  </EnhancedBadge>
                                </div>
                                <p className="text-sm text-muted-foreground">{reminder.message}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch checked={reminder.active} />
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
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
