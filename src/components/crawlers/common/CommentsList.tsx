'use client';

import { useState } from 'react';
import { SocialMediaComment } from '@/types/crawler';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ThumbsUp, MessageSquare, CalendarIcon, Search } from 'lucide-react';

interface CommentsListProps {
  comments: SocialMediaComment[];
  loading?: boolean;
}

export function CommentsList({ comments, loading = false }: CommentsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'replies'>('newest');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-gray-500">No comments found.</p>
      </div>
    );
  }

  // Filter comments based on search
  const filteredComments = comments.filter(comment => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      comment.content.toLowerCase().includes(searchLower) ||
      comment.authorName.toLowerCase().includes(searchLower) ||
      comment.hashtags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      comment.mentions.some(mention => mention.toLowerCase().includes(searchLower))
    );
  });

  // Sort comments
  const sortedComments = [...filteredComments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.publishedAt.getTime() - a.publishedAt.getTime();
      case 'likes':
        return b.metrics.likes - a.metrics.likes;
      case 'replies':
        return b.metrics.replies - a.metrics.replies;
      default:
        return 0;
    }
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search comments..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Badge 
            variant={sortBy === 'newest' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setSortBy('newest')}
          >
            <CalendarIcon className="h-3 w-3 mr-1" /> Newest
          </Badge>
          <Badge 
            variant={sortBy === 'likes' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setSortBy('likes')}
          >
            <ThumbsUp className="h-3 w-3 mr-1" /> Most Likes
          </Badge>
          <Badge 
            variant={sortBy === 'replies' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setSortBy('replies')}
          >
            <MessageSquare className="h-3 w-3 mr-1" /> Most Replies
          </Badge>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead className="w-[50%]">Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Replies</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedComments.map((comment) => (
              <TableRow 
                key={comment.id} 
                className={comment.parentCommentId ? "bg-gray-50" : ""}
              >
                <TableCell className="font-medium">
                  {comment.parentCommentId && (
                    <span className="text-gray-400 mr-1">↪</span>
                  )}
                  {comment.authorName}
                </TableCell>
                <TableCell>
                  <div className="whitespace-pre-wrap break-words">
                    {comment.content}
                  </div>
                  {(comment.hashtags.length > 0 || comment.mentions.length > 0) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {comment.hashtags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-blue-500">
                          #{tag}
                        </Badge>
                      ))}
                      {comment.mentions.map(mention => (
                        <Badge key={mention} variant="secondary" className="text-purple-500">
                          @{mention}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {formatDate(comment.publishedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <ThumbsUp className="h-3 w-3 mr-1 text-gray-400" />
                    {comment.metrics.likes}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <MessageSquare className="h-3 w-3 mr-1 text-gray-400" />
                    {comment.metrics.replies}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-gray-500 text-right">
        Showing {sortedComments.length} of {comments.length} comments
      </div>
    </div>
  );
} 