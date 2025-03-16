export interface VideoAnalytics {
  videoId: string;
  title?: string;
  description?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate?: number;
  watchTimeAvg?: number;
  completionRate?: number;
  retentionRate?: number;
  thumbnail?: string;
  createdAt: string;
  publishedAt: string;
  audienceDemographics?: AudienceDemographics;
  performanceByRegion?: RegionPerformance[];
  topReferrers?: { source: string; percentage: number }[];
}

export interface RegionPerformance {
  region: string;
  views: number;
  engagement: number;
  watchTimeAvg?: number;
}

export interface AudienceDemographics {
  ageGroups: { ageGroup: string; percentage: number }[];
  genders: { gender: string; percentage: number }[];
  interests: { interest: string; percentage: number }[];
  languages: { language: string; percentage: number }[];
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: string;
  likeCount: number;
  replyCount?: number;
  verified?: boolean;
  createdAt?: string;
  likes?: number;
  replies?: number;
}

/**
 * Sentiment analysis result
 */
export interface SentimentAnalysis {
  overallSentiment: string;
  sentimentScore: number;
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  themes: {
    positive: string[];
    negative: string[];
  };
  commonPhrases: string[];
  emotionalTone: string;
  engagementLevel: string;
}

/**
 * Trending item data
 */
export interface TrendingItem {
  id: string;
  name: string;
  category: string;
  viewCount: number;
  growth: number;
  count?: number;
  creatorCount?: number;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  format?: string; // 'short', 'regular', 'live', etc.
  estimatedEngagement: number; // percentage
  suggestedHashtags: string[];
  suggestedSounds?: string[];
  videoLength: number; // in seconds
  difficulty?: string; // 'easy', 'medium', 'hard'
  estimatedViews?: {
    min: number;
    max: number;
  };
  relevance?: number; // 0-100 scale
}

export interface TrendRecommendation {
  id: string;
  name: string;
  type: string;
  description?: string;
  relevanceScore?: number;
  currentViews?: number;
  predictedViews?: number;
  growth: number; // percentage
  growthPrediction?: number;
  confidence?: number;
  peakTime?: string; // ISO date string
}

export interface ContentStrategyRecommendation {
  contentTypes: {
    type: string;
    engagementRate: number;
    recommendedFrequency: number; // per week
  }[];
  optimaVideoLength: {
    min: number; // in seconds
    max: number; // in seconds
    ideal: number; // in seconds
  };
  recommendedPostingFrequency: number; // per week
  recommendedPostingTimes: {
    weekday: string;
    times: string[]; // format: "HH:MM"
  }[];
}

export interface AudienceTimingMetrics {
  bestPostingTimes: {
    weekday: string;
    hour: number;
    engagementRate: number;
  }[];
  audienceActiveHours: {
    hour: number;
    activity: number; // 0-1 scale
  }[];
  audienceActiveWeekdays: {
    weekday: string;
    activity: number; // 0-1 scale
  }[];
  timezone: {
    name: string;
    percentage: number;
  }[];
}

export interface TrendData {
  id: string;
  name: string;
  category: 'hashtag' | 'sound' | 'effect' | 'challenge';
  growthRate: number;
  totalViews: number;
  totalPosts: number;
  sentiment: number;
  relevanceScore: number;
  examples: {
    videoId: string;
    thumbnailUrl: string;
    engagementRate: number;
  }[];
}

/**
 * Analytics metrics for historical comparison
 */
export interface AnalyticsMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  engagement: number;
  diamonds?: number;
  timeInterval: TimeInterval;
}

/**
 * Time interval for analytics
 */
export type TimeInterval =
  | {
      start: string; // ISO date string
      end: string; // ISO date string
      duration: number; // in days
      label: string; // e.g., "Last 7 days", "Last 30 days"
    }
  | '24h'
  | '7d'
  | '30d'
  | 'custom';

/**
 * Historical comparison data
 */
export interface HistoricalComparison {
  metrics: {
    current: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
      followers: number;
      engagement: number;
    };
    previous: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
      followers: number;
      engagement: number;
    };
    growth: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
      followers: number;
      engagement: number;
    };
    timeInterval: TimeInterval;
  };
  topPerforming: {
    videos: VideoAnalytics[];
    hashtags: TrendingItem[];
    sounds: TrendingItem[];
  };
  growthTrend: {
    date: string;
    views: number;
    followers: number;
    engagement: number;
  }[];
}
