import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Clock, AlertCircle, CalendarClock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';

export const metadata: Metadata = {
  title: 'Content Transitions - TikTok Streaming',
  description: 'Automate content transitions for your TikTok streams',
};

export default function ContentTransitionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Content Transitions</h2>
        <p className="text-muted-foreground">
          Schedule and automate content transitions during your stream
        </p>
      </div>

      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Scheduled</span>
          </TabsTrigger>
          <TabsTrigger value="conditional" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Conditional</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Scheduled Transitions</CardTitle>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  <span>New Transition</span>
                </Button>
              </div>
              <CardDescription>
                Create time-based content transitions that automatically activate during your stream
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Example scheduled transition cards */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Intro to Main Content</CardTitle>
                          <CardDescription className="text-xs">
                            Switch from intro scene to main content
                          </CardDescription>
                        </div>
                      </div>
                      <EnhancedBadge type="info" className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        Scheduled
                      </EnhancedBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Trigger: </span>
                        <span>5 minutes after stream start</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={true} />
                        <Select defaultValue="fade">
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Transition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fade">Fade</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                            <SelectItem value="dissolve">Dissolve</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                          <Clock className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Q&A Session</CardTitle>
                          <CardDescription className="text-xs">
                            Switch to Q&A layout after main content
                          </CardDescription>
                        </div>
                      </div>
                      <EnhancedBadge type="info" className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        Scheduled
                      </EnhancedBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Trigger: </span>
                        <span>25 minutes after stream start</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={true} />
                        <Select defaultValue="slide">
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Transition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fade">Fade</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                            <SelectItem value="dissolve">Dissolve</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add more transition cards as needed */}
                <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
                  <Button variant="outline" className="gap-2">
                    <Play className="h-4 w-4" />
                    <span>Add New Transition</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditional" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conditional Transitions</CardTitle>
                <Button className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>New Condition</span>
                </Button>
              </div>
              <CardDescription>
                Create transitions that trigger based on stream metrics and viewer engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/20">
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Engagement Booster</CardTitle>
                          <CardDescription className="text-xs">
                            Switch to interactive content when engagement drops
                          </CardDescription>
                        </div>
                      </div>
                      <EnhancedBadge type="warning" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Conditional
                      </EnhancedBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Trigger: </span>
                        <span>Comment rate below 5 per minute for 3 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={true} />
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ArrowRight className="h-4 w-4" />
                          <span>Edit Rule</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transition Templates</CardTitle>
              <CardDescription>
                Pre-configured transition templates you can apply to your streams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  'Gaming Stream',
                  'Talk Show',
                  'Tutorial',
                  'Music Performance',
                  'Product Review',
                ].map(template => (
                  <Card key={template} className="cursor-pointer transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template}</CardTitle>
                      <Separator className="my-2" />
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">
                        {template === 'Gaming Stream' && 'Optimized transitions for gaming content'}
                        {template === 'Talk Show' && 'Perfect for interview and discussion formats'}
                        {template === 'Tutorial' &&
                          'Step-by-step transitions for instructional content'}
                        {template === 'Music Performance' &&
                          'Smooth transitions for musical performances'}
                        {template === 'Product Review' && 'Product showcase transition sequence'}
                      </p>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        Apply Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
