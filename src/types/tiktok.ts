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
  sentiment?: 'positive' | 'negative' | 'neutral'; // Added for sentiment analysis
  priority?: number; // Added for comment prioritization
  isQuestion?: boolean; // Added to identify questions
  translated?: string; // Added for translation
  category?: string; // Added for comment categorization
}

export interface TikTokGift extends TikTokBaseEvent {
  giftId: number;
  giftName: string;
  diamondValue: number;
  giftPictureUrl: string;
  repeatCount: number;
  repeatEnd: boolean;
  streakId?: string; // For tracking multi-gift streaks
  totalValue?: number; // Total diamond value including streak
}

export interface TikTokLike extends TikTokBaseEvent {
  likeCount: number;
}

export interface TikTokShare extends TikTokBaseEvent {
  // No additional properties for share events
  platform?: string; // Platform where shared (if known)
}

export interface TikTokFollow extends TikTokBaseEvent {
  followRole: number;
}

export interface TikTokMember extends TikTokBaseEvent {
  joinType: number; // 1 = join, 2 = rejoin
  membershipLevel?: string; // Added for membership level tracking
}

export interface TikTokPurchase extends TikTokBaseEvent {
  purchaseId: string;
  purchaseType: string;
  purchaseValue: number;
  purchaseStatus: string;
}

export interface TikTokViewerCount {
  viewerCount: number;
  timestamp: number;
  peakViewers?: number; // Track peak viewer count
  averageViewTime?: number; // Average view time in seconds
}

export interface TikTokConnectionState {
  state: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'FAILED';
  // Add platform-specific state info here
  targetUniqueId?: string;
  roomId?: string;
  serverError?: string;
  connectionQuality?: 'good' | 'poor' | 'unstable'; // Added for connection quality monitoring
  reconnectAttempts?: number; // Track reconnection attempts
}

export interface TikTokUserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  followingCount: number;
  followerCount: number;
  likeCount: number;
  videoCount: number;
  verified: boolean;
  privateAccount: boolean;
  createdAt: string;
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
  profile: {
    followerCount: number;
    followingCount: number;
    likeCount: number;
    videoCount: number;
    profileViews: number;
  };
  videos: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    averageWatchTime: number;
    completionRate: number;
    engagementRate: number;
  };
  followers: {
    growth: number;
    demographics: {
      age: { range: string; percentage: number }[];
      gender: { type: string; percentage: number }[];
      topCountries: { country: string; percentage: number }[];
      topCities: { city: string; percentage: number }[];
    };
    activeHours: { hour: number; percentage: number }[];
    activeDays: { day: string; percentage: number }[];
  };
  timeRange: {
    start: string;
    end: string;
    days: number;
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
  // Added new configuration options
  commentPrioritization: boolean; // Prioritize certain comments
  autoTranslation: boolean; // Auto-translate non-native language comments
  voiceSettings: VoiceSettings; // Voice settings for TTS
  autoModeration: boolean; // Auto-moderate inappropriate comments
  sentimentAnalysis: boolean; // Analyze comment sentiment
  contextualResponses: boolean; // Use context-aware responses
  responseDelay: number; // Delay between responses in ms
}

export interface VoiceSettings {
  voice: string; // Voice ID
  model: string; // TTS model
  speed: number; // Speech rate
  language: string; // Voice language
  pitch: number; // Voice pitch
  stability: number; // Voice stability
  style: number; // Voice style factor
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
  // Added new fields
  sentiment?: 'positive' | 'negative' | 'neutral';
  isQueued?: boolean; // If response is queued for later delivery
  priority?: number; // Response priority
  responseType?: 'direct' | 'general' | 'announcement'; // Type of response
}

export type TikTokEventType = (typeof TikTokEventEnum)[keyof typeof TikTokEventEnum];

export enum TikTokEventEnum {
  Comment = 'comment',
  Gift = 'gift',
  Like = 'like',
  Share = 'share',
  Follow = 'follow',
  Member = 'member',
  ViewerCount = 'viewerCount',
  Connection = 'connection',
  AIResponse = 'aiResponse',
  Poll = 'poll',
  Question = 'question',
  Milestone = 'milestone',
  Purchase = 'purchase',
}

export interface TikTokEvent {
  type: TikTokEventType;
  data:
    | TikTokComment
    | TikTokGift
    | TikTokLike
    | TikTokShare
    | TikTokFollow
    | TikTokMember
    | TikTokPurchase
    | TikTokViewerCount
    | TikTokConnectionState
    | AIResponse
    | Poll
    | Question
    | Milestone;
}

// Added new interfaces for enhanced functionality

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  createdAt: number;
  endsAt: number;
  isActive: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  askedBy: string;
  askedById: string;
  askedAt: number;
  isAnswered: boolean;
  answeredAt?: number;
  answerText?: string;
}

export interface Milestone {
  type: 'followers' | 'likes' | 'shares' | 'gifts';
  value: number;
  timestamp: number;
  goalValue?: number; // For tracking progress towards a goal
}

export interface VirtualAvatar {
  id: string;
  name: string;
  imageUrl: string;
  model: string; // 3D model reference
  animations: string[]; // Available animations
  expressions: string[]; // Available facial expressions
  isActive: boolean;
  style?: string; // Avatar style (realistic, anime, etc.)
  expressiveness?: number; // How expressive the avatar is (0-100)
  voiceSyncAccuracy?: number; // Voice sync accuracy (0-100)
  lastGenerated?: string; // Timestamp of last generation
  enabled?: boolean; // Whether the avatar is enabled
}

export interface StreamSettings {
  title: string;
  description: string;
  tags: string[];
  allowComments: boolean;
  allowDuets: boolean;
  allowStitches: boolean;
  isPrivate: boolean;
  scheduledStartTime?: string;
  autoRecord: boolean;
  virtualBackgroundUrl?: string;
  layoutTemplate: string;
  overlayUrls: string[];
  liveGoals: {
    type: 'followers' | 'likes' | 'shares' | 'gifts';
    target: number;
    title: string;
  }[];
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  keywords: string[];
  talkingPoints: string[];
  estimatedDuration: number;
  suggestedVisuals?: string[];
  category: string;
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
