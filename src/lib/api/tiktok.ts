import axios from 'axios';
import {
  AnalyticsMetrics,
  Comment,
  ContentIdea,
  HistoricalComparison,
  SentimentAnalysis,
  TimeInterval,
  TrendingItem,
  TrendRecommendation,
  VideoAnalytics,
} from '@/types/analytics';
import { TikTokAnalytics, TikTokUserProfile } from '@/types/tiktok';

/**
 * TikTok API Configuration
 */
interface TikTokApiConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  baseUrl?: string;
}

/**
 * TikTok API Client
 * Handles authentication and API requests to TikTok
 */
export class TikTokApiClient {
  private static instance: TikTokApiClient;
  private apiKey: string = '';
  private apiSecret: string = '';
  private accessToken: string = '';
  private baseUrl: string;
  private isConfigured: boolean = false;

  private constructor() {
    this.baseUrl = process.env.TIKTOK_API_BASE_URL || 'https://open.tiktokapis.com/v2';
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): TikTokApiClient {
    if (!TikTokApiClient.instance) {
      TikTokApiClient.instance = new TikTokApiClient();
    }
    return TikTokApiClient.instance;
  }

  /**
   * Configure API client with credentials
   */
  public configure(config: TikTokApiConfig): void {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.accessToken = config.accessToken;
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    }
    this.isConfigured = true;
  }

  /**
   * Initialize the TikTok client with API credentials
   */
  public async initialize(apiKey: string, apiSecret: string, accessToken: string): Promise<void> {
    this.configure({ apiKey, apiSecret, accessToken });
    await this.testConnection();
  }

  /**
   * Test the API connection
   */
  public async testConnection(): Promise<void> {
    this.validateConfiguration();
    await this.request('/test-connection');
  }

  /**
   * Check if API client is properly configured
   */
  private validateConfiguration(): void {
    if (!this.isConfigured || !this.apiKey || !this.apiSecret || !this.accessToken) {
      throw new Error('TikTok API client is not properly configured');
    }
  }

  /**
   * Base method for making API requests
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    params?: Record<string, string | number | boolean>,
    body?: unknown
  ): Promise<T> {
    this.validateConfiguration();

    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    try {
      const response = await axios({
        method,
        url: url.toString(),
        headers: this.getHeaders(),
        data: body,
      });

      if (!response.data) {
        throw new Error('Invalid response from TikTok API');
      }

      return response.data as T;
    } catch (error) {
      console.error('TikTok API Request Error:', error);
      throw error;
    }
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get user profile information
   */
  public async getUserProfile(username: string): Promise<TikTokUserProfile> {
    return this.request<TikTokUserProfile>(`/users/@${username}`);
  }

  /**
   * Get user analytics
   */
  public async getUserAnalytics(username: string, days: number = 30): Promise<TikTokAnalytics> {
    return this.request<TikTokAnalytics>(`/users/@${username}/analytics`, 'GET', { days });
  }

  /**
   * Get video analytics
   */
  public async getVideoAnalytics(videoId: string): Promise<VideoAnalytics> {
    return this.request<VideoAnalytics>(`/videos/${videoId}/analytics`);
  }

  /**
   * Get user's videos with analytics
   */
  public async getUserVideos(userId: string, count: number = 10): Promise<VideoAnalytics[]> {
    return this.request<VideoAnalytics[]>('/video/list', 'GET', { userId, count });
  }

  /**
   * Get trending hashtags
   */
  public async getTrendingHashtags(limit: number = 10): Promise<TrendingItem[]> {
    return this.request<TrendingItem[]>('/trends/hashtags', 'GET', { limit });
  }

  /**
   * Get trending sounds
   */
  public async getTrendingSounds(limit: number = 10): Promise<TrendingItem[]> {
    return this.request<TrendingItem[]>('/trends/sounds', 'GET', { limit });
  }

  /**
   * Get trending effects
   */
  public async getTrendingEffects(count: number = 10): Promise<TrendingItem[]> {
    return this.request<TrendingItem[]>('/trends/effects', 'GET', { count });
  }

  /**
   * Get trending challenges
   */
  public async getTrendingChallenges(count: number = 10): Promise<TrendingItem[]> {
    return this.request<TrendingItem[]>('/trends/challenges', 'GET', { count });
  }

  /**
   * Get comments for a video
   */
  public async getVideoComments(videoId: string, limit: number = 50): Promise<Comment[]> {
    return this.request<Comment[]>(`/videos/${videoId}/comments`, 'GET', { limit });
  }

  /**
   * Generate content recommendations
   */
  public async generateRecommendations(
    userInterests: string[],
    contentHistory: string[],
    count: number = 5
  ): Promise<TrendRecommendation[]> {
    return this.request<TrendRecommendation[]>(
      '/trends/recommendations',
      'POST',
      { count },
      { userInterests, contentHistory }
    );
  }

  /**
   * Generate content ideas
   */
  public async generateContentIdeas(
    userType: string,
    niche: string,
    count: number = 5
  ): Promise<ContentIdea[]> {
    return this.request<ContentIdea[]>(
      '/trends/content-ideas',
      'POST',
      { count },
      { userType, niche }
    );
  }

  /**
   * Analyze sentiment of comments
   */
  public async analyzeSentiment(
    comments: string[],
    includeWordCloud: boolean = true
  ): Promise<SentimentAnalysis> {
    return this.request<SentimentAnalysis>(
      '/analytics/sentiment',
      'POST',
      { includeWordCloud: String(includeWordCloud) },
      { comments }
    );
  }

  /**
   * Get historical analytics comparison
   */
  public async getHistoricalComparison(
    userId: string,
    timeRange: string
  ): Promise<HistoricalComparison> {
    return this.request<HistoricalComparison>('/analytics/historical', 'GET', {
      userId,
      timeRange,
    });
  }

  /**
   * Upload a video to TikTok
   */
  public async uploadVideo(
    videoFile: File,
    description: string,
    hashtags: string[] = []
  ): Promise<{ videoId: string; status: string }> {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('description', description);
    formData.append('hashtags', JSON.stringify(hashtags));

    return this.request<{ videoId: string; status: string }>(
      '/content/upload',
      'POST',
      undefined,
      formData
    );
  }

  /**
   * Schedule a post to be published
   */
  public async schedulePost(
    videoFile: File,
    caption: string,
    scheduledTime: Date,
    hashtags: string[],
    mentions: string[]
  ): Promise<{ id: string; scheduledTime: string }> {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('caption', caption);
    formData.append('scheduledTime', scheduledTime.toISOString());
    formData.append('hashtags', JSON.stringify(hashtags));
    formData.append('mentions', JSON.stringify(mentions));

    return this.request<{ id: string; scheduledTime: string }>(
      '/content/schedule',
      'POST',
      undefined,
      formData
    );
  }
}

// Export singleton instance
export default TikTokApiClient.getInstance();
