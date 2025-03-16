'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentStrategyRecommendation } from '@/types/analytics';
import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

// Mock data for content strategy
const mockContentStrategy: ContentStrategyRecommendation = {
  contentTypes: [
    { type: 'Tutorial', engagementRate: 18.5, recommendedFrequency: 2 },
    { type: 'Day in the Life', engagementRate: 15.2, recommendedFrequency: 1 },
    { type: 'Trend Reaction', engagementRate: 22.7, recommendedFrequency: 3 },
    { type: 'Product Review', engagementRate: 12.8, recommendedFrequency: 1 },
  ],
  optimaVideoLength: {
    min: 20,
    max: 60,
    ideal: 35,
  },
  recommendedPostingFrequency: 7,
  recommendedPostingTimes: [
    { weekday: 'Monday', times: ['18:00', '21:00'] },
    { weekday: 'Wednesday', times: ['17:30', '20:00'] },
    { weekday: 'Friday', times: ['16:00', '19:30', '22:00'] },
    { weekday: 'Saturday', times: ['12:00', '20:00'] },
    { weekday: 'Sunday', times: ['14:00', '19:00'] },
  ],
};

interface ContentTypeCardProps {
  type: string;
  engagementRate: number;
  recommendedFrequency: number;
  onAddToCalendar: (type: string) => void;
}

const ContentTypeCard = ({
  type,
  engagementRate,
  recommendedFrequency,
  onAddToCalendar,
}: ContentTypeCardProps) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{type}</h3>
            <div className="flex items-center mt-1">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm">{engagementRate}% engagement</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {recommendedFrequency}x per week
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={() => onAddToCalendar(type)}
        >
          <PlusIcon className="h-3 w-3 mr-1" />
          Add to Calendar
        </Button>
      </CardContent>
    </Card>
  );
};

interface PostingTimeCardProps {
  weekday: string;
  times: string[];
}

const PostingTimeCard = ({ weekday, times }: PostingTimeCardProps) => {
  return (
    <div className="flex items-center mb-3 bg-slate-50 p-3 rounded-md">
      <div className="w-24 font-medium">{weekday}</div>
      <div className="flex flex-wrap gap-1 flex-1">
        {times.map((time, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            <ClockIcon className="h-3 w-3 mr-1" />
            {time}
          </Badge>
        ))}
      </div>
    </div>
  );
};

interface AiStrategyPanelProps {
  onAddToCalendar?: (contentType: string, time: string) => void;
}

export function AiStrategyPanel({ onAddToCalendar }: AiStrategyPanelProps) {
  const [contentStrategy] = useState<ContentStrategyRecommendation>(mockContentStrategy);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleAddToCalendar = (contentType: string) => {
    if (onAddToCalendar) {
      // Default to first recommended time if none selected
      const defaultTime = contentStrategy.recommendedPostingTimes[0].times[0];
      onAddToCalendar(contentType, defaultTime);
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border shadow-sm">
      <Tabs defaultValue="strategy" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="strategy" className="flex items-center gap-1">
              <DocumentTextIcon className="h-4 w-4" />
              <span>Content Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Optimal Schedule</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="strategy" className="p-4 pt-2">
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-700">AI Strategy Recommendation</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Post {contentStrategy.recommendedPostingFrequency}x per week with a mix of
                    content types for maximum engagement. Ideal video length:{' '}
                    {contentStrategy.optimaVideoLength.ideal} seconds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-sm font-medium mb-3">Recommended Content Types</h3>
          <div className="space-y-2">
            {contentStrategy.contentTypes
              .sort((a, b) => b.engagementRate - a.engagementRate)
              .map((contentType, index) => (
                <ContentTypeCard
                  key={index}
                  type={contentType.type}
                  engagementRate={contentType.engagementRate}
                  recommendedFrequency={contentType.recommendedFrequency}
                  onAddToCalendar={handleAddToCalendar}
                />
              ))}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Optimal Video Length</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Min</span>
                  <span className="text-sm text-muted-foreground">Ideal</span>
                  <span className="text-sm text-muted-foreground">Max</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-2 bg-blue-500 rounded-full"
                    style={{
                      left: `${(contentStrategy.optimaVideoLength.min / contentStrategy.optimaVideoLength.max) * 100}%`,
                      width: `${((contentStrategy.optimaVideoLength.max - contentStrategy.optimaVideoLength.min) / contentStrategy.optimaVideoLength.max) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="absolute w-4 h-4 bg-blue-600 rounded-full -mt-1 border-2 border-white"
                    style={{
                      left: `calc(${(contentStrategy.optimaVideoLength.ideal / contentStrategy.optimaVideoLength.max) * 100}% - 8px)`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs">{contentStrategy.optimaVideoLength.min}s</span>
                  <span className="text-xs font-medium">
                    {contentStrategy.optimaVideoLength.ideal}s
                  </span>
                  <span className="text-xs">{contentStrategy.optimaVideoLength.max}s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="p-4 pt-2">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Posting Schedule</CardTitle>
              <CardDescription>
                Post {contentStrategy.recommendedPostingFrequency}x per week at these optimal times
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mt-2">
                {contentStrategy.recommendedPostingTimes.map((daySchedule, index) => (
                  <PostingTimeCard
                    key={index}
                    weekday={daySchedule.weekday}
                    times={daySchedule.times}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <h3 className="text-sm font-medium mb-3">Content Calendar</h3>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => {
                  const isRecommended = [1, 3, 5, 6, 7, 10, 14].includes(i);
                  const contentType = isRecommended
                    ? contentStrategy.contentTypes[i % contentStrategy.contentTypes.length].type
                    : null;

                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square rounded-md flex flex-col items-center justify-center p-1
                        ${isRecommended ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'}
                        cursor-pointer hover:bg-slate-100 transition-colors
                      `}
                    >
                      <span className="text-xs">{i + 1}</span>
                      {isRecommended && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] mt-1 px-1 truncate max-w-full"
                          title={contentType || ''}
                        >
                          {contentType}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
