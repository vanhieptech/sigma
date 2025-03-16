'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PlusCircle,
  Search,
  ArrowDownUp,
  TrendingUp,
  Users,
  MessageSquare,
  Share2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

// Sample competitor data
const competitorsData = [
  {
    id: 1,
    username: '@trendingcreator',
    displayName: 'Trending Creator',
    avatarUrl: 'https://placekitten.com/100/100',
    followers: 820000,
    followersGrowth: '+12.8%',
    engagementRate: 4.2,
    contentFrequency: 5.8,
    avgViews: 245000,
    relevance: 'Very High',
  },
  {
    id: 2,
    username: '@contentqueen',
    displayName: 'Content Queen',
    avatarUrl: 'https://placekitten.com/101/101',
    followers: 1200000,
    followersGrowth: '+8.2%',
    engagementRate: 3.8,
    contentFrequency: 4.5,
    avgViews: 390000,
    relevance: 'High',
  },
  {
    id: 3,
    username: '@videowizard',
    displayName: 'Video Wizard',
    avatarUrl: 'https://placekitten.com/102/102',
    followers: 620000,
    followersGrowth: '+15.3%',
    engagementRate: 5.2,
    contentFrequency: 3.2,
    avgViews: 186000,
    relevance: 'High',
  },
  {
    id: 4,
    username: '@techinfluencer',
    displayName: 'Tech Influencer',
    avatarUrl: 'https://placekitten.com/103/103',
    followers: 560000,
    followersGrowth: '+6.7%',
    engagementRate: 4.0,
    contentFrequency: 2.8,
    avgViews: 124000,
    relevance: 'Medium',
  },
  {
    id: 5,
    username: '@contentcreator',
    displayName: 'Content Creator',
    avatarUrl: 'https://placekitten.com/104/104',
    followers: 430000,
    followersGrowth: '+9.4%',
    engagementRate: 4.8,
    contentFrequency: 7.2,
    avgViews: 98000,
    relevance: 'Medium',
  },
];

// Radar chart data for competitor comparison
const competitorComparisonData = [
  {
    subject: 'Engagement',
    you: 68,
    competitor1: 85,
    competitor2: 72,
    fullMark: 100,
  },
  {
    subject: 'Content Quality',
    you: 82,
    competitor1: 80,
    competitor2: 78,
    fullMark: 100,
  },
  {
    subject: 'Followers',
    you: 45,
    competitor1: 90,
    competitor2: 75,
    fullMark: 100,
  },
  {
    subject: 'Post Frequency',
    you: 58,
    competitor1: 73,
    competitor2: 65,
    fullMark: 100,
  },
  {
    subject: 'Growth Rate',
    you: 72,
    competitor1: 64,
    competitor2: 80,
    fullMark: 100,
  },
  {
    subject: 'Live Streams',
    you: 78,
    competitor1: 58,
    competitor2: 62,
    fullMark: 100,
  },
];

export function CompetitorAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter competitors based on search query
  const filteredCompetitors = competitorsData.filter(
    competitor =>
      competitor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Competitor Analysis</CardTitle>
            <CardDescription>Compare your performance with similar creators</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search competitors..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="sm" variant="ghost">
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead className="text-right">Followers</TableHead>
                <TableHead className="text-right">Growth</TableHead>
                <TableHead className="text-right">Eng. Rate</TableHead>
                <TableHead className="text-right">Avg. Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompetitors.map(competitor => (
                <TableRow key={competitor.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={competitor.avatarUrl} alt={competitor.displayName} />
                        <AvatarFallback>{competitor.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{competitor.displayName}</span>
                        <span className="text-xs text-muted-foreground">{competitor.username}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {(competitor.followers / 1000).toFixed(1)}K
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {competitor.followersGrowth}
                  </TableCell>
                  <TableCell className="text-right">{competitor.engagementRate}%</TableCell>
                  <TableCell className="text-right">
                    {(competitor.avgViews / 1000).toFixed(1)}K
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="pt-4">
          <h4 className="text-sm font-medium mb-4">Performance Comparison</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competitorComparisonData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="You" dataKey="you" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar
                  name="Trending Creator"
                  dataKey="competitor1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Content Queen"
                  dataKey="competitor2"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3">
          <Card className="p-3">
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Growth Opportunity</span>
              <span className="font-bold text-sm">Very High</span>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex flex-col items-center gap-1">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-xs text-muted-foreground">Audience Overlap</span>
              <span className="font-bold text-sm">42%</span>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex flex-col items-center gap-1">
              <Share2 className="h-5 w-5 text-purple-500" />
              <span className="text-xs text-muted-foreground">Collab Potential</span>
              <span className="font-bold text-sm">High</span>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
