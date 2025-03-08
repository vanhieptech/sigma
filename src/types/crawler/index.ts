// Common platform types
export type SocialPlatform = 'facebook' | 'tiktok' | 'twitter' | 'linkedin';

// Base types for social media content
export interface SocialMediaPost {
  id: string;
  platform: SocialPlatform;
  originalUrl: string;
  title?: string;
  content?: string;
  authorName: string;
  authorId: string;
  publishedAt: Date;
  crawledAt: Date;
  metrics: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
}

export interface SocialMediaComment {
  id: string;
  postId: string;
  platform: SocialPlatform;
  content: string;
  authorName: string;
  authorId: string;
  publishedAt: Date;
  parentCommentId?: string;
  metrics: {
    likes: number;
    replies: number;
  };
  hashtags: string[];
  mentions: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// Crawler job status and configuration
export interface CrawlJob {
  id: string;
  userId: string;
  platform: SocialPlatform;
  targetUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  stats: {
    commentsCollected: number;
    uniqueUsers: number;
    hashtagsFound: number;
    totalExpectedComments?: number;
  };
  error?: string;
}

export interface CrawlOptions {
  includeReplies: boolean;
  includeReactions: boolean;
  maxComments?: number;
  maxDepth?: number;
}

// Platform-specific options
export interface FacebookCrawlOptions extends CrawlOptions {
  postUrl: string;
}

export interface TikTokCrawlOptions extends CrawlOptions {
  videoUrl: string;
}

export interface TwitterCrawlOptions extends CrawlOptions {
  tweetUrl: string;
}

export interface LinkedInCrawlOptions extends CrawlOptions {
  postUrl: string;
}

// Analysis results
export interface EngagementAnalysis {
  engagementRate: number;
  topInfluencers: Array<{
    authorId: string;
    authorName: string;
    commentCount: number;
    totalLikes: number;
  }>;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  hashtagAnalysis: Array<{
    hashtag: string;
    count: number;
  }>;
  activityTimeline: Array<{
    date: Date;
    commentCount: number;
  }>;
} 