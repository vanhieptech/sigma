'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
} from 'recharts';
import { UsersIcon, MapPin, Globe, LucideUsers, Sparkles } from 'lucide-react';

// Sample data for age demographics
const ageData = [
  { age: '13-17', percentage: 8, growth: 12 },
  { age: '18-24', percentage: 42, growth: 15 },
  { age: '25-34', percentage: 28, growth: 8 },
  { age: '35-44', percentage: 12, growth: 5 },
  { age: '45-54', percentage: 6, growth: 2 },
  { age: '55+', percentage: 4, growth: 1 },
];

// Sample data for gender demographics
const genderData = [
  { name: 'Female', value: 64, color: '#ff6b81' },
  { name: 'Male', value: 34, color: '#5352ed' },
  { name: 'Other', value: 2, color: '#2ed573' },
];

// Sample data for top countries
const countryData = [
  { country: 'United States', percentage: 32, code: 'US' },
  { country: 'United Kingdom', percentage: 14, code: 'UK' },
  { country: 'Canada', percentage: 10, code: 'CA' },
  { country: 'Australia', percentage: 8, code: 'AU' },
  { country: 'Germany', percentage: 7, code: 'DE' },
  { country: 'France', percentage: 6, code: 'FR' },
  { country: 'Japan', percentage: 5, code: 'JP' },
  { country: 'Brazil', percentage: 4, code: 'BR' },
  { country: 'India', percentage: 3, code: 'IN' },
  { country: 'Other', percentage: 11, code: 'OT' },
];

// Sample data for audience interests
const interestData = [
  { category: 'Entertainment', percentage: 68, engagement: 7.8 },
  { category: 'Education', percentage: 54, engagement: 6.9 },
  { category: 'Lifestyle', percentage: 48, engagement: 6.5 },
  { category: 'Technology', percentage: 42, engagement: 6.2 },
  { category: 'Fashion', percentage: 38, engagement: 5.8 },
  { category: 'Food', percentage: 35, engagement: 5.5 },
  { category: 'Travel', percentage: 32, engagement: 5.2 },
  { category: 'Gaming', percentage: 28, engagement: 4.8 },
];

export function DemographicInsights() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Demographic Insights</CardTitle>
            <CardDescription>Understand your audience demographics and interests</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Last 30 days</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="age" className="space-y-4">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="age" className="text-xs">
              Age
            </TabsTrigger>
            <TabsTrigger value="gender" className="text-xs">
              Gender
            </TabsTrigger>
            <TabsTrigger value="location" className="text-xs">
              Location
            </TabsTrigger>
            <TabsTrigger value="interests" className="text-xs">
              Interests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="age">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ageData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="percentage"
                    name="Percentage (%)"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="growth"
                    name="Growth (%)"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-sm flex justify-between">
              <div>
                <span className="font-medium">Primary Age Group:</span> 18-24 years (42%)
              </div>
              <div>
                <span className="font-medium">Fastest Growing:</span> 18-24 years (+15%)
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gender">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/2 space-y-6">
                {genderData.map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </div>
                    <Progress
                      value={item.value}
                      className="h-2"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </Progress>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Growth: +{item.name === 'Female' ? 8 : item.name === 'Male' ? 5 : 12}%
                      </span>
                      <span>
                        Engagement:{' '}
                        {item.name === 'Female' ? 6.8 : item.name === 'Male' ? 5.9 : 7.2}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Top Countries</h4>
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  10 Countries
                </Badge>
              </div>

              <div className="space-y-3">
                {countryData.map(country => (
                  <div key={country.country} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{country.country}</span>
                        {country.code !== 'OT' && (
                          <span className="text-xs text-muted-foreground">{country.code}</span>
                        )}
                      </div>
                      <span className="text-sm">{country.percentage}%</span>
                    </div>
                    <Progress value={country.percentage} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Geographic reach:</span>
                  <span className="font-medium">72 countries</span>
                </div>
                <div className="flex items-center gap-1">
                  <LucideUsers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Global audience:</span>
                  <span className="font-medium">86%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interests">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={interestData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="percentage"
                    name="Audience (%)"
                    fill="#8884d8"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <Card className="p-3">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground">Top Interest</span>
                  <span className="text-lg font-bold">Entertainment</span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground">Most Engaged</span>
                  <span className="text-lg font-bold">Entertainment</span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground">Growing Interest</span>
                  <span className="text-lg font-bold">Technology</span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground">Recommendation</span>
                  <span className="text-lg font-bold">Lifestyle</span>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
