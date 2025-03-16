'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Clock, Calendar, Download, Zap } from 'lucide-react';

// Sample data for engagement by hour for each day of the week
const hourlyEngagementData = [
  { hour: '00:00', engagement: 2.1, viewers: 450 },
  { hour: '01:00', engagement: 1.6, viewers: 320 },
  { hour: '02:00', engagement: 1.2, viewers: 280 },
  { hour: '03:00', engagement: 0.9, viewers: 210 },
  { hour: '04:00', engagement: 0.7, viewers: 180 },
  { hour: '05:00', engagement: 0.8, viewers: 220 },
  { hour: '06:00', engagement: 1.2, viewers: 350 },
  { hour: '07:00', engagement: 1.8, viewers: 480 },
  { hour: '08:00', engagement: 2.4, viewers: 620 },
  { hour: '09:00', engagement: 3.1, viewers: 780 },
  { hour: '10:00', engagement: 3.8, viewers: 920 },
  { hour: '11:00', engagement: 4.2, viewers: 1050 },
  { hour: '12:00', engagement: 4.8, viewers: 1180 },
  { hour: '13:00', engagement: 5.1, viewers: 1230 },
  { hour: '14:00', engagement: 5.4, viewers: 1280 },
  { hour: '15:00', engagement: 5.6, viewers: 1320 },
  { hour: '16:00', engagement: 6.2, viewers: 1420 },
  { hour: '17:00', engagement: 6.8, viewers: 1580 },
  { hour: '18:00', engagement: 7.4, viewers: 1680 },
  { hour: '19:00', engagement: 8.2, viewers: 1820 },
  { hour: '20:00', engagement: 7.8, viewers: 1760 },
  { hour: '21:00', engagement: 6.9, viewers: 1620 },
  { hour: '22:00', engagement: 5.2, viewers: 1380 },
  { hour: '23:00', engagement: 3.4, viewers: 920 },
];

// Weekly data showing optimal times for each day
const weeklyData = [
  { day: 'Monday', morning: 45, afternoon: 68, evening: 82, night: 56 },
  { day: 'Tuesday', morning: 52, afternoon: 72, evening: 88, night: 63 },
  { day: 'Wednesday', morning: 48, afternoon: 75, evening: 85, night: 60 },
  { day: 'Thursday', morning: 51, afternoon: 70, evening: 86, night: 65 },
  { day: 'Friday', morning: 55, afternoon: 78, evening: 92, night: 72 },
  { day: 'Saturday', morning: 62, afternoon: 85, evening: 95, night: 78 },
  { day: 'Sunday', morning: 58, afternoon: 82, evening: 90, night: 75 },
];

// Time periods for the day
const timePeriods = [
  'Morning (6AM-12PM)',
  'Afternoon (12PM-6PM)',
  'Evening (6PM-10PM)',
  'Night (10PM-6AM)',
];

// Optimal posting times for each day
const optimalTimes = [
  { day: 'Monday', time: '7:00 PM', engagement: 8.2, confidence: 'High' },
  { day: 'Tuesday', time: '8:00 PM', engagement: 8.4, confidence: 'Very High' },
  { day: 'Wednesday', time: '7:30 PM', engagement: 8.1, confidence: 'High' },
  { day: 'Thursday', time: '8:30 PM', engagement: 8.3, confidence: 'High' },
  { day: 'Friday', time: '9:00 PM', engagement: 8.8, confidence: 'Very High' },
  { day: 'Saturday', time: '8:00 PM', engagement: 9.1, confidence: 'Very High' },
  { day: 'Sunday', time: '7:00 PM', engagement: 8.6, confidence: 'High' },
];

export function PeakTimeAnalysis() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Peak Time Analysis</CardTitle>
            <CardDescription>Identify optimal posting times for maximum engagement</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Daily</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Weekly</span>
            </TabsTrigger>
            <TabsTrigger value="optimal" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>Optimal Times</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hourlyEngagementData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="engagement"
                    name="Engagement Rate (%)"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="viewers"
                    name="Avg. Viewers"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <Card className="p-3">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground">Peak Time</span>
                  <span className="text-xl font-bold">7:00 PM</span>
                  <span className="text-xs text-muted-foreground">Highest engagement time</span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground">Off-Peak</span>
                  <span className="text-xl font-bold">4:00 AM</span>
                  <span className="text-xs text-muted-foreground">Lowest engagement time</span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground">Rising Window</span>
                  <span className="text-xl font-bold">4-7 PM</span>
                  <span className="text-xs text-muted-foreground">
                    Rapidly increasing engagement
                  </span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground">Best Duration</span>
                  <span className="text-xl font-bold">6-9 PM</span>
                  <span className="text-xs text-muted-foreground">Sustained high engagement</span>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={100} data={weeklyData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="day" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Morning"
                    dataKey="morning"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Afternoon"
                    dataKey="afternoon"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Evening"
                    dataKey="evening"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Night"
                    dataKey="night"
                    stroke="#ff8042"
                    fill="#ff8042"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {timePeriods.map((period, index) => (
                <Badge key={index} variant="outline" className="text-xs py-1">
                  {period}
                </Badge>
              ))}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Analysis shows that evening hours (6PM-10PM) consistently have the highest
                engagement across all days of the week.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="optimal">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Day</th>
                    <th className="text-left p-3 text-sm font-medium">Optimal Time</th>
                    <th className="text-right p-3 text-sm font-medium">Engagement Rate</th>
                    <th className="text-right p-3 text-sm font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {optimalTimes.map((day, index) => (
                    <tr key={day.day} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                      <td className="p-3 font-medium">{day.day}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{day.time}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">{day.engagement.toFixed(1)}%</td>
                      <td className="p-3 text-right">
                        <Badge variant={day.confidence === 'Very High' ? 'default' : 'outline'}>
                          {day.confidence}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <Button size="sm" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>Schedule at Optimal Times</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
