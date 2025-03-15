export interface TikTokBaseEvent {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  timestamp: number;
}

export interface TikTokComment extends TikTokBaseEvent {
  comment: string;
  followRole: number; // 0 = not following, 1 = following
  isModerator: boolean;
  isSubscriber: boolean;
}

export interface TikTokGift extends TikTokBaseEvent {
  giftId: number;
  giftName: string;
  diamondValue: number;
  giftPictureUrl: string;
  repeatCount: number;
  repeatEnd: boolean;
}

export interface TikTokLike extends TikTokBaseEvent {
  likeCount: number;
}

export interface TikTokShare extends TikTokBaseEvent {
  // No additional properties for share events
}

export interface TikTokFollow extends TikTokBaseEvent {
  followRole: number;
}

export interface TikTokMember extends TikTokBaseEvent {
  joinType: number; // 1 = join, 2 = rejoin
}

export interface TikTokViewerCount {
  viewerCount: number;
  timestamp: number;
}

export interface TikTokConnectionState {
  state: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'FAILED';
  // Add platform-specific state info here
  targetUniqueId?: string;
  roomId?: string;
  serverError?: string;
}

export interface TikTokUserProfile {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  bio: string;
  followingCount: number;
  followerCount: number;
  heartCount: number;
  videoCount: number;
  diggCount: number;
  verified: boolean;
}

export interface TikTokHashtag {
  name: string;
  videos: number;
  trending: boolean;
}

export interface TikTokSound {
  id: string;
  name: string;
  authorName: string;
  usageCount: number;
  durationSec: number;
  trending: boolean;
  previewUrl: string;
}

export interface TikTokAnalytics {
  followerGrowth: Array<{
    date: string;
    followers: number;
    growth: number;
    lost: number;
  }>;
  viewsPerVideo: Array<{
    date: string;
    videoId: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>;
  engagementRate: Array<{
    date: string;
    rate: number;
  }>;
  topPerformingVideos: Array<{
    videoId: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  }>;
  audienceDemo: {
    age: Array<{
      group: string;
      percentage: number;
    }>;
    gender: Array<{
      group: string;
      percentage: number;
    }>;
    topCountries: Array<{
      country: string;
      percentage: number;
    }>;
  };
}

export interface AIConfig {
  enableAIResponses: boolean;
  respondToComments: boolean;
  respondToGifts: boolean;
  respondToLikes: boolean;
  respondToFollows: boolean;
  respondToShares: boolean;
  respondToJoins: boolean;
  respondToPurchases: boolean;
  giftThreshold: number;
  likeThreshold: number;
  joinResponseRate: number;
}

export interface AIResponse {
  event: string;
  text: string;
  audioUrl?: string;
  userData: {
    userId: string;
    uniqueId: string;
    nickname: string;
  };
  timestamp: number;
}

export type TikTokEventType = 
  | 'comment' 
  | 'gift' 
  | 'like' 
  | 'share' 
  | 'follow' 
  | 'member' 
  | 'viewerCount'
  | 'connection'
  | 'aiResponse';

export interface TikTokEvent {
  type: TikTokEventType;
  data: TikTokComment | TikTokGift | TikTokLike | TikTokShare | TikTokFollow | TikTokMember | TikTokViewerCount | TikTokConnectionState | AIResponse;
}

export interface TikTokContentIdea {
  id: string;
  title: string;
  description: string;
  trending: boolean;
  estimatedViews: number;
  estimatedEngagement: number;
  suggestedHashtags: string[];
  suggestedSoundId?: string;
  trend?: {
    type: 'hashtag' | 'sound' | 'challenge';
    name: string;
    growthRate: number; // percentage growth in the last 7 days
  };
  createdAt: string;
  category: string;
} 