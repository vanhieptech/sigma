import { v4 as uuidv4 } from 'uuid';
import { 
  TikTokComment, 
  TikTokGift, 
  TikTokLike,
  TikTokShare,
  TikTokFollow,
  TikTokMember,
  TikTokViewerCount
} from '@/types/tiktok';

// Generate realistic TikTok usernames
const generateUsername = (): string => {
  const prefixes = ['tiktoker', 'creator', 'user', 'viral', 'trend', 'dancing', 'funny'];
  const suffixes = ['official', 'real', 'original', 'tiktok', ''];
  const numbers = Math.floor(Math.random() * 1000).toString();
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix}${suffix}${numbers}`;
};

// Generate realistic TikTok display names
const generateDisplayName = (): string => {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Jamie', 'Avery'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};

// Generate random avatar URLs
const generateAvatarUrl = (): string => {
  const random = Math.floor(Math.random() * 1000);
  return `https://placekitten.com/100/100?random=${random}`;
};

// Generate common TikTok comments
const generateComment = (): string => {
  const comments = [
    'Love this content! 🔥',
    "You're so talented!",
    'Can you do a tutorial?',
    'First time watching your live!',
    'Hello from California!',
    'Please notice me!',
    'Do you post everyday?',
    'What song is this?',
    'This is amazing! 😍',
    "I've been following you for months!",
    'How long have you been on TikTok?',
    "What's your favorite trend?",
    'Can we collab?',
    'Your content is so entertaining!',
    'Just followed you!',
    'How do you come up with these ideas?',
    'Loving the vibe 💯',
    'You deserve more followers!',
    'This popped up on my FYP!',
    'Trying this trend tomorrow!'
  ];
  
  return comments[Math.floor(Math.random() * comments.length)];
};

// Generate TikTok gift names
const generateGift = (): { giftName: string, diamondValue: number, repeatCount: number } => {
  const gifts = [
    { giftName: 'Rose', diamondValue: 5, repeatCount: 1 },
    { giftName: 'TikTok', diamondValue: 10, repeatCount: 1 },
    { giftName: 'Ice Cream', diamondValue: 30, repeatCount: 1 },
    { giftName: 'Lollipop', diamondValue: 10, repeatCount: 1 },
    { giftName: 'Hand Wave', diamondValue: 5, repeatCount: 1 },
    { giftName: 'Mic', diamondValue: 50, repeatCount: 1 },
    { giftName: 'Crown', diamondValue: 100, repeatCount: 1 },
    { giftName: 'Lion', diamondValue: 400, repeatCount: 1 },
    { giftName: 'Universe', diamondValue: 1000, repeatCount: 1 },
    { giftName: 'Drama Queen', diamondValue: 5000, repeatCount: 1 }
  ];
  
  const gift = gifts[Math.floor(Math.random() * gifts.length)];
  
  // For higher valued gifts, sometimes add a repeat count for gift combos
  if (gift.diamondValue >= 100 && Math.random() > 0.7) {
    gift.repeatCount = Math.floor(Math.random() * 5) + 2;
  }
  
  return gift;
};

// Create a mock comment event
export const createMockComment = (): TikTokComment => {
  const userId = uuidv4();
  const uniqueId = generateUsername();
  const nickname = generateDisplayName();
  
  return {
    userId,
    uniqueId,
    nickname,
    profilePictureUrl: generateAvatarUrl(),
    comment: generateComment(),
    followRole: Math.random() > 0.8 ? 1 : 0, // 20% chance of follower badge
    isModerator: Math.random() > 0.95, // 5% chance of being moderator
    isSubscriber: Math.random() > 0.9, // 10% chance of being subscriber
    timestamp: Date.now()
  };
};

// Create a mock gift event
export const createMockGift = (): TikTokGift => {
  const userId = uuidv4();
  const uniqueId = generateUsername();
  const nickname = generateDisplayName();
  const gift = generateGift();
  
  return {
    userId,
    uniqueId,
    nickname,
    profilePictureUrl: generateAvatarUrl(),
    giftId: Math.floor(Math.random() * 1000),
    giftName: gift.giftName,
    diamondValue: gift.diamondValue,
    giftPictureUrl: `https://placekitten.com/200/200?gift=${gift.giftName}`,
    repeatCount: gift.repeatCount,
    repeatEnd: true,
    timestamp: Date.now()
  };
};

// Create a mock like event
export const createMockLike = (): TikTokLike => {
  const userId = uuidv4();
  const uniqueId = generateUsername();
  const nickname = generateDisplayName();
  
  return {
    userId,
    uniqueId,
    nickname,
    profilePictureUrl: generateAvatarUrl(),
    likeCount: Math.floor(Math.random() * 10) + 1, // 1-10 likes
    timestamp: Date.now()
  };
};

// Create a mock share event
export const createMockShare = (): TikTokShare => {
  const userId = uuidv4();
  const uniqueId = generateUsername();
  const nickname = generateDisplayName();
  
  return {
    userId,
    uniqueId,
    nickname,
    profilePictureUrl: generateAvatarUrl(),
    timestamp: Date.now()
  };
};

// Create a mock follow event
export const createMockFollow = (): TikTokFollow => {
  const userId = uuidv4();
  const uniqueId = generateUsername();
  const nickname = generateDisplayName();
  
  return {
    userId,
    uniqueId,
    nickname,
    profilePictureUrl: generateAvatarUrl(),
    followRole: 0,
    timestamp: Date.now()
  };
};

// Create a mock member join event
export const createMockMember = (): TikTokMember => {
  const userId = uuidv4();
  const uniqueId = generateUsername();
  const nickname = generateDisplayName();
  
  return {
    userId,
    uniqueId,
    nickname,
    profilePictureUrl: generateAvatarUrl(),
    joinType: Math.random() > 0.5 ? 1 : 2, // 1 = join, 2 = rejoin
    timestamp: Date.now()
  };
};

// Create a mock viewer count update
export const createMockViewerCount = (previousCount?: number): TikTokViewerCount => {
  let viewerCount = previousCount || Math.floor(Math.random() * 500) + 50;
  
  // Apply a random change to the viewer count
  const change = Math.floor(Math.random() * 20) - 10; // -10 to +10
  viewerCount = Math.max(50, viewerCount + change); // Keep minimum at 50
  
  return {
    viewerCount,
    timestamp: Date.now()
  };
};

// Generate a series of mock events for testing
export const generateMockStreamData = (duration: number = 60000, frequency: number = 2000) => {
  const events: Array<TikTokComment | TikTokGift | TikTokLike | TikTokShare | TikTokFollow | TikTokMember | TikTokViewerCount> = [];
  let viewerCount = 100;
  
  const startTime = Date.now();
  let currentTime = startTime;
  
  while (currentTime < startTime + duration) {
    // Determine which event to generate based on probabilities
    const rand = Math.random();
    
    if (rand < 0.4) {
      // 40% chance of comment
      events.push(createMockComment());
    } else if (rand < 0.55) {
      // 15% chance of like
      events.push(createMockLike());
    } else if (rand < 0.65) {
      // 10% chance of follow
      events.push(createMockFollow());
    } else if (rand < 0.75) {
      // 10% chance of join
      events.push(createMockMember());
    } else if (rand < 0.85) {
      // 10% chance of share
      events.push(createMockShare());
    } else if (rand < 0.95) {
      // 10% chance of gift
      events.push(createMockGift());
    } else {
      // 5% chance of viewer count update
      const viewCountEvent = createMockViewerCount(viewerCount);
      viewerCount = viewCountEvent.viewerCount;
      events.push(viewCountEvent);
    }
    
    currentTime += Math.floor(Math.random() * frequency); // Randomize intervals
  }
  
  // Sort events by timestamp
  return events.sort((a, b) => a.timestamp - b.timestamp);
};

// Get a random user profile for testing
export const getRandomUserProfile = () => {
  return {
    userId: uuidv4(),
    uniqueId: generateUsername(),
    nickname: generateDisplayName(),
    profilePictureUrl: generateAvatarUrl(),
    bio: "TikTok creator making awesome content!",
    followingCount: Math.floor(Math.random() * 1000),
    followerCount: Math.floor(Math.random() * 100000),
    heartCount: Math.floor(Math.random() * 1000000),
    videoCount: Math.floor(Math.random() * 100),
    diggCount: Math.floor(Math.random() * 1000),
    verified: Math.random() > 0.95 // 5% chance of being verified
  };
};

// Get trending hashtags
export const getTrendingHashtags = () => {
  const hashtags = [
    { name: 'fyp', videos: 2000000000, trending: true },
    { name: 'foryoupage', videos: 1500000000, trending: true },
    { name: 'viral', videos: 1000000000, trending: true },
    { name: 'trending', videos: 750000000, trending: true },
    { name: 'dance', videos: 500000000, trending: true },
    { name: 'comedy', videos: 400000000, trending: true },
    { name: 'music', videos: 350000000, trending: true },
    { name: 'tutorial', videos: 300000000, trending: false },
    { name: 'food', videos: 250000000, trending: false },
    { name: 'pets', videos: 200000000, trending: false },
    { name: 'fashion', videos: 180000000, trending: false },
    { name: 'travel', videos: 150000000, trending: true },
    { name: 'fitness', videos: 130000000, trending: false },
    { name: 'makeup', videos: 120000000, trending: false },
    { name: 'gamer', videos: 100000000, trending: true }
  ];
  
  return hashtags;
};

// Get trending sounds
export const getTrendingSounds = () => {
  const sounds = [
    { id: 'sound1', name: 'Original Sound - Popular Creator', authorName: 'popular_creator123', usageCount: 500000, durationSec: 15, trending: true, previewUrl: 'https://example.com/sound1.mp3' },
    { id: 'sound2', name: 'Hit Song Remix', authorName: 'dj_remix', usageCount: 450000, durationSec: 30, trending: true, previewUrl: 'https://example.com/sound2.mp3' },
    { id: 'sound3', name: 'Funny Voice Effect', authorName: 'comedian45', usageCount: 400000, durationSec: 10, trending: true, previewUrl: 'https://example.com/sound3.mp3' },
    { id: 'sound4', name: 'Dance Challenge Music', authorName: 'dance_guru', usageCount: 350000, durationSec: 20, trending: true, previewUrl: 'https://example.com/sound4.mp3' },
    { id: 'sound5', name: 'Trending Song Clip', authorName: 'music_clips', usageCount: 300000, durationSec: 15, trending: true, previewUrl: 'https://example.com/sound5.mp3' },
    { id: 'sound6', name: 'Cinematic Background', authorName: 'movie_sounds', usageCount: 250000, durationSec: 25, trending: false, previewUrl: 'https://example.com/sound6.mp3' },
    { id: 'sound7', name: 'Viral Quote', authorName: 'quotable', usageCount: 200000, durationSec: 5, trending: true, previewUrl: 'https://example.com/sound7.mp3' },
    { id: 'sound8', name: 'ASMR Special', authorName: 'asmr_artist', usageCount: 150000, durationSec: 30, trending: false, previewUrl: 'https://example.com/sound8.mp3' },
    { id: 'sound9', name: 'Popular Movie Line', authorName: 'movie_fan89', usageCount: 120000, durationSec: 8, trending: false, previewUrl: 'https://example.com/sound9.mp3' },
    { id: 'sound10', name: 'New Challenge Theme', authorName: 'trend_setter', usageCount: 100000, durationSec: 15, trending: true, previewUrl: 'https://example.com/sound10.mp3' }
  ];
  
  return sounds;
};

// Mock analytics data
export const getMockAnalytics = (days: number = 30) => {
  const analytics = {
    followerGrowth: [],
    viewsPerVideo: [],
    engagementRate: [],
    topPerformingVideos: [],
    audienceDemo: {
      age: [
        { group: '13-17', percentage: 15 },
        { group: '18-24', percentage: 35 },
        { group: '25-34', percentage: 30 },
        { group: '35-44', percentage: 12 },
        { group: '45+', percentage: 8 }
      ],
      gender: [
        { group: 'Female', percentage: 60 },
        { group: 'Male', percentage: 38 },
        { group: 'Other', percentage: 2 }
      ],
      topCountries: [
        { country: 'United States', percentage: 40 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'Canada', percentage: 8 },
        { country: 'Australia', percentage: 6 },
        { country: 'Germany', percentage: 5 }
      ]
    }
  };
  
  // Generate follower growth data
  let followers = 5000 + Math.floor(Math.random() * 1000);
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const growth = Math.floor(Math.random() * 100) - 10; // -10 to 90
    followers += growth;
    
    analytics.followerGrowth.push({
      date: date.toISOString().split('T')[0],
      followers,
      growth: growth > 0 ? growth : 0, // Only show positive growth in the data
      lost: growth < 0 ? Math.abs(growth) : 0
    });
  }
  
  // Generate views per video data (last 10 videos)
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 3); // A video every 3 days
    
    analytics.viewsPerVideo.push({
      date: date.toISOString().split('T')[0],
      videoId: `video${i}`,
      title: `TikTok Video #${i}`,
      views: Math.floor(Math.random() * 50000) + 1000,
      likes: Math.floor(Math.random() * 5000) + 100,
      comments: Math.floor(Math.random() * 200) + 10,
      shares: Math.floor(Math.random() * 100) + 5
    });
  }
  
  // Generate engagement rate data
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    analytics.engagementRate.push({
      date: date.toISOString().split('T')[0],
      rate: Math.random() * 0.15 + 0.01, // 1% to 16%
    });
  }
  
  // Generate top performing videos
  for (let i = 0; i < 5; i++) {
    analytics.topPerformingVideos.push({
      videoId: `top${i}`,
      title: `Top Performing Video #${i}`,
      views: Math.floor(Math.random() * 100000) + 50000,
      likes: Math.floor(Math.random() * 20000) + 5000,
      comments: Math.floor(Math.random() * 1000) + 100,
      shares: Math.floor(Math.random() * 500) + 50,
      engagementRate: Math.random() * 0.2 + 0.05 // 5% to 25%
    });
  }
  
  return analytics;
}; 