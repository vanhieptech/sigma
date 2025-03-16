'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
import { Download, Search, Filter, RefreshCw } from 'lucide-react';

interface FacebookResultsProps {
  jobId: string;
}

interface Comment {
  id: string;
  message: string;
  authorName: string;
  authorId: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface PostData {
  id: string;
  message: string;
  authorName: string;
  authorId: string;
  timestamp: string;
  likes: number;
  shares: number;
  commentCount: number;
  comments: Comment[];
}

export function FacebookResults({ jobId }: FacebookResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postData, setPostData] = useState<PostData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);

  // Sentiment data for charts
  const [sentimentData, setSentimentData] = useState([
    { name: 'Positive', value: 0, color: '#10b981' },
    { name: 'Neutral', value: 0, color: '#6b7280' },
    { name: 'Negative', value: 0, color: '#ef4444' },
  ]);

  // Engagement data for charts
  const [engagementData, setEngagementData] = useState([
    { name: 'Comments', value: 0 },
    { name: 'Likes', value: 0 },
    { name: 'Shares', value: 0 },
  ]);

  useEffect(() => {
    if (!jobId) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/crawlers/facebook/results/${jobId}`);
        const data = await response.json();

        if (data.success && data.post) {
          setPostData(data.post);
          setFilteredComments(data.post.comments || []);

          // Update sentiment data based on analysis results
          if (data.analysis && data.analysis.sentiment) {
            setSentimentData([
              { name: 'Positive', value: data.analysis.sentiment.positive || 0, color: '#10b981' },
              { name: 'Neutral', value: data.analysis.sentiment.neutral || 0, color: '#6b7280' },
              { name: 'Negative', value: data.analysis.sentiment.negative || 0, color: '#ef4444' },
            ]);
          }

          // Update engagement data
          setEngagementData([
            { name: 'Comments', value: data.post.commentCount || 0 },
            { name: 'Likes', value: data.post.likes || 0 },
            { name: 'Shares', value: data.post.shares || 0 },
          ]);
        } else {
          setError(data.error || 'Failed to load results');
        }
      } catch (err) {
        setError('An error occurred while loading results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [jobId]);

  useEffect(() => {
    if (!postData) return;

    // Filter comments based on search term
    if (searchTerm.trim() === '') {
      setFilteredComments(postData.comments || []);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = postData.comments.filter(
        comment =>
          comment.message.toLowerCase().includes(term) ||
          comment.authorName.toLowerCase().includes(term)
      );
      setFilteredComments(filtered);
    }
  }, [searchTerm, postData]);

  const handleExportCSV = () => {
    if (!postData) return;

    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Comment ID,Author Name,Author ID,Message,Timestamp,Likes\n';

    // Add each comment as a row
    postData.comments.forEach(comment => {
      const row = [
        comment.id,
        `"${comment.authorName.replace(/"/g, '""')}"`,
        comment.authorId,
        `"${comment.message.replace(/"/g, '""')}"`,
        comment.timestamp,
        comment.likes,
      ].join(',');
      csvContent += row + '\n';
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `facebook_comments_${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading Results...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error Loading Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!postData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Results Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No data available for this job ID. Please start a new crawl.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Facebook Post Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Post Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">Post Summary</h3>
            <p className="text-sm mb-4">{postData.message}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Author</span>
                <span className="font-medium">{postData.authorName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Posted</span>
                <span className="font-medium">{new Date(postData.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <div className="flex space-x-2">
                  <Badge variant="secondary">{postData.likes} Likes</Badge>
                  <Badge variant="secondary">{postData.shares} Shares</Badge>
                  <Badge variant="secondary">{postData.commentCount} Comments</Badge>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="comments">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search comments..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={handleExportCSV}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead className="w-[50%]">Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Likes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No comments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredComments.map(comment => (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium">{comment.authorName}</TableCell>
                          <TableCell>{comment.message}</TableCell>
                          <TableCell>{new Date(comment.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell>{comment.likes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="sentiment">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sentiment Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sentiment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sentimentData.map(item => (
                        <div key={item.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {item.value} comments (
                              {((item.value / postData.commentCount) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(item.value / postData.commentCount) * 100}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
