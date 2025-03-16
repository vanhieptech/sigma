'use client';

import { EngagementAnalysis as EngagementAnalysisType } from '@/types/crawler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface EngagementAnalysisProps {
  analysis: EngagementAnalysisType;
  loading?: boolean;
}

export function EngagementAnalysis({ analysis, loading = false }: EngagementAnalysisProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Prepare data for visualization
  const hashtags = analysis.hashtagAnalysis.slice(0, 10).map(h => ({
    name: `#${h.hashtag}`,
    value: h.count,
  }));

  const timeline = analysis.activityTimeline.map(t => ({
    date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(t.date),
    comments: t.commentCount,
  }));

  const influencers = analysis.topInfluencers.slice(0, 5).map(i => ({
    name: i.authorName,
    comments: i.commentCount,
    likes: i.totalLikes,
  }));

  const sentimentData = [
    { name: 'Positive', value: analysis.sentimentBreakdown.positive, color: '#4ade80' },
    { name: 'Neutral', value: analysis.sentimentBreakdown.neutral, color: '#a3a3a3' },
    { name: 'Negative', value: analysis.sentimentBreakdown.negative, color: '#f87171' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Hashtags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hashtags}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comment Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="comments" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Influencers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={influencers} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="comments" fill="#3b82f6" name="Comments" />
                <Bar dataKey="likes" fill="#10b981" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between mt-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-500">
                {analysis.sentimentBreakdown.positive}
              </div>
              <div className="text-gray-500">Positive</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-500">
                {analysis.sentimentBreakdown.neutral}
              </div>
              <div className="text-gray-500">Neutral</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-500">
                {analysis.sentimentBreakdown.negative}
              </div>
              <div className="text-gray-500">Negative</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
