import { TrendData, TrendRecommendation, ContentIdea } from '@/types/analytics';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

/**
 * TikTok Trend Analyzer service
 * Uses AI to analyze trends and provide recommendations
 */
export class TrendAnalyzer {
  private static instance: TrendAnalyzer;
  private trendCache: Map<string, TrendData[]> = new Map();
  private cacheDuration = 60 * 60 * 1000; // 1 hour in ms
  private lastCacheUpdate: number = 0;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TrendAnalyzer {
    if (!TrendAnalyzer.instance) {
      TrendAnalyzer.instance = new TrendAnalyzer();
    }
    return TrendAnalyzer.instance;
  }

  /**
   * Get trending hashtags
   */
  public async getTrendingHashtags(category?: string): Promise<TrendData[]> {
    const cacheKey = `hashtags-${category || 'all'}`;
    return this.getTrendsByType(cacheKey, 'hashtag', category);
  }

  /**
   * Get trending sounds
   */
  public async getTrendingSounds(category?: string): Promise<TrendData[]> {
    const cacheKey = `sounds-${category || 'all'}`;
    return this.getTrendsByType(cacheKey, 'sound', category);
  }

  /**
   * Get trending effects
   */
  public async getTrendingEffects(category?: string): Promise<TrendData[]> {
    const cacheKey = `effects-${category || 'all'}`;
    return this.getTrendsByType(cacheKey, 'effect', category);
  }

  /**
   * Get trending challenges
   */
  public async getTrendingChallenges(category?: string): Promise<TrendData[]> {
    const cacheKey = `challenges-${category || 'all'}`;
    return this.getTrendsByType(cacheKey, 'challenge', category);
  }

  /**
   * Get personalized trend recommendations
   * @param userInterests User interests to tailor recommendations
   * @param contentHistory Previous content categories
   */
  public async getPersonalizedRecommendations(
    userInterests: string[],
    contentHistory: { category: string; performance: number }[]
  ): Promise<TrendRecommendation[]> {
    // Get all trends first
    const allTrends = await this.getAllTrends();

    // Use OpenAI to analyze and provide personalized recommendations
    try {
      const prompt = this.buildPersonalizationPrompt(userInterests, contentHistory, allTrends);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert TikTok trend analyst. Provide personalized trend recommendations based on user interests and past content performance. Return only JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) throw new Error('No response from AI');

      const parsedResponse = JSON.parse(response);
      return parsedResponse.recommendations as TrendRecommendation[];
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);

      // Fallback: Return basic recommendations based on growth rate
      return allTrends
        .sort((a, b) => b.growthRate - a.growthRate)
        .slice(0, 5)
        .map(trend => ({
          id: `rec-${trend.id}`,
          type: trend.category,
          name: trend.name,
          description: `Trending ${trend.category} with high growth rate`,
          relevanceScore: trend.relevanceScore,
          popularity: Math.min(10, Math.floor(trend.totalViews / 100000)),
          growth: trend.growthRate,
        }));
    }
  }

  /**
   * Generate content ideas based on trends
   * @param count Number of ideas to generate
   * @param userType Type of user (KOL, KOC, etc)
   * @param niche Content niche
   */
  public async generateContentIdeas(
    count: number = 5,
    userType: string = 'Regular',
    niche?: string
  ): Promise<ContentIdea[]> {
    // Get trending data
    const allTrends = await this.getAllTrends();

    try {
      const prompt = this.buildContentIdeaPrompt(count, userType, niche, allTrends);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a creative TikTok content strategist. Generate unique and engaging content ideas based on current trends. Return only JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) throw new Error('No response from AI');

      const parsedResponse = JSON.parse(response);
      return parsedResponse.contentIdeas as ContentIdea[];
    } catch (error) {
      console.error('Error generating content ideas:', error);

      // Fallback: Return basic content ideas
      return Array(count)
        .fill(0)
        .map((_, index) => ({
          id: `idea-${index}`,
          title: `Content idea based on trending ${niche || 'topic'}`,
          description: 'Create engaging content around current trends',
          format: 'short',
          suggestedHashtags: allTrends
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(t => t.name.replace('#', '')),
          estimatedViews: {
            min: 1000,
            max: 10000,
          },
          relevance: 7,
          estimatedEngagement: 5,
          videoLength: 30,
        }));
    }
  }

  /**
   * Analyze sentiment for a trend
   * @param trendName Trend name to analyze
   */
  public async analyzeTrendSentiment(trendName: string): Promise<number> {
    try {
      const prompt = `Analyze the sentiment around the TikTok trend: "${trendName}"
      
      Consider how users are responding to this trend, the types of videos being created,
      and the overall reception. Rate the sentiment on a scale from -1 (very negative) 
      to 1 (very positive).
      
      Return only a single number.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert in social media trend analysis. Provide precise sentiment scores.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const response = completion.choices[0].message.content;
      if (!response) return 0;

      const sentiment = parseFloat(response.trim());
      return isNaN(sentiment) ? 0 : Math.max(-1, Math.min(1, sentiment));
    } catch (error) {
      console.error('Error analyzing trend sentiment:', error);
      return 0; // Neutral sentiment as fallback
    }
  }

  /**
   * Get all trends combined
   */
  private async getAllTrends(): Promise<TrendData[]> {
    const [hashtags, sounds, effects, challenges] = await Promise.all([
      this.getTrendingHashtags(),
      this.getTrendingSounds(),
      this.getTrendingEffects(),
      this.getTrendingChallenges(),
    ]);

    return [...hashtags, ...sounds, ...effects, ...challenges];
  }

  /**
   * Get trends by type with caching
   */
  private async getTrendsByType(
    cacheKey: string,
    category: 'hashtag' | 'sound' | 'effect' | 'challenge',
    contentCategory?: string
  ): Promise<TrendData[]> {
    // Check cache first
    const now = Date.now();
    if (this.trendCache.has(cacheKey) && now - this.lastCacheUpdate < this.cacheDuration) {
      return this.trendCache.get(cacheKey) || [];
    }

    // If no cache or expired, fetch fresh data
    try {
      // In a real implementation, this would call TikTok API
      // For now, we'll simulate with realistic data
      const trends = this.fetchTrendingDataFromAPI(category, contentCategory);

      // Update cache
      this.trendCache.set(cacheKey, trends);
      this.lastCacheUpdate = now;

      return trends;
    } catch (error) {
      console.error(`Error fetching ${category} trends:`, error);
      return this.trendCache.get(cacheKey) || [];
    }
  }

  /**
   * Simulated API data fetch
   * In a real implementation, this would call TikTok's API
   */
  private fetchTrendingDataFromAPI(
    category: 'hashtag' | 'sound' | 'effect' | 'challenge',
    contentCategory?: string
  ): TrendData[] {
    // Generate realistic trend names based on category
    const trendNames = this.generateTrendNames(category, contentCategory);

    // Create trend data with realistic metrics
    return trendNames.map((name, index) => ({
      id: `trend-${category}-${index}`,
      name,
      category,
      growthRate: 10 + Math.random() * 90, // 10-100% growth
      totalViews: Math.floor(1000000 + Math.random() * 500000000), // 1M-500M views
      totalPosts: Math.floor(1000 + Math.random() * 100000), // 1K-100K posts
      sentiment: -0.5 + Math.random() * 1.5, // -0.5 to 1.0
      relevanceScore: 50 + Math.random() * 50, // 50-100 score
      examples: Array(3)
        .fill(0)
        .map((_, i) => ({
          videoId: `video-${i}`,
          thumbnailUrl: `https://placekitten.com/300/${200 + i}`,
          engagementRate: 0.05 + Math.random() * 0.2, // 5-25% engagement
        })),
    }));
  }

  /**
   * Generate realistic trend names for simulation
   */
  private generateTrendNames(
    category: 'hashtag' | 'sound' | 'effect' | 'challenge',
    contentCategory?: string
  ): string[] {
    const prefix = contentCategory ? `${contentCategory} ` : '';

    const categorySpecificNames: Record<string, string[]> = {
      hashtag: [
        '#TikTokMadeMeBuyIt',
        '#FYP',
        '#ForYou',
        '#Viral',
        '#TrendAlert',
        '#LearnOnTikTok',
        '#TikTokTaughtMe',
        '#StorytimeTime',
        '#POV',
        '#DayInMyLife',
      ],
      sound: [
        'Original Sound - trending_creator',
        'Viral TikTok Beat',
        'Sped Up Version',
        'Remix 2023',
        'Trending Audio',
        'Dance Challenge Music',
        'Comedy Sound Effect',
        'Emotional Piano Backing',
        'Motivational Speech Clip',
      ],
      effect: [
        'Bold Glamour Filter',
        'Time Warp Scan',
        'Green Screen',
        'Slow Zoom',
        'Voice Effects',
        'Beauty Mode Plus',
        'AR Background',
        'Face Morph Pro',
        'Character Creator',
      ],
      challenge: [
        'Dance Challenge 2023',
        'Transition Challenge',
        '7 Second Challenge',
        'Duet This',
        'Tell Me Without Telling Me',
        'Outfit Change',
        'Expectations vs Reality',
        'Lip Sync Battle',
      ],
    };

    // Get the appropriate list based on category
    const baseNames = categorySpecificNames[category] || [];

    // Add the prefix to each name if needed
    return baseNames.map(name => {
      if (category === 'hashtag') {
        // For hashtags, we insert the content category in the hashtag
        return contentCategory ? name.replace('#', `#${contentCategory}`) : name;
      }
      return `${prefix}${name}`;
    });
  }

  /**
   * Build prompt for personalized recommendations
   */
  private buildPersonalizationPrompt(
    userInterests: string[],
    contentHistory: { category: string; performance: number }[],
    allTrends: TrendData[]
  ): string {
    // Convert trends to a simplified format for the prompt
    const trendsData = allTrends.map(trend => ({
      name: trend.name,
      category: trend.category,
      growthRate: trend.growthRate,
      views: trend.totalViews,
      sentiment: trend.sentiment,
    }));

    return `Generate personalized TikTok trend recommendations based on the following:
    
    USER INTERESTS:
    ${userInterests.join(', ')}
    
    CONTENT HISTORY (category, performance score 0-1):
    ${contentHistory.map(h => `${h.category}: ${h.performance}`).join('\n')}
    
    CURRENT TRENDS:
    ${JSON.stringify(trendsData, null, 2)}
    
    Please analyze this data and provide 5 personalized trend recommendations.
    For each recommendation, include:
    1. The trend itself
    2. Why this trend would work well for this user
    3. Estimated views if they create content on this trend
    4. Estimated engagement rate
    5. Suggested approach to the trend
    6. Confidence score (0-1) for this recommendation
    
    Return ONLY a JSON object with the following structure:
    {
      "recommendations": [
        {
          "trend": {...trend object...},
          "recommendationReason": "string",
          "estimatedViews": number,
          "estimatedEngagement": number,
          "suggestedApproach": "string",
          "confidenceScore": number
        },
        ...more recommendations...
      ]
    }`;
  }

  /**
   * Build prompt for content idea generation
   */
  private buildContentIdeaPrompt(
    count: number,
    userType: string,
    niche: string | undefined,
    allTrends: TrendData[]
  ): string {
    // Convert trends to a simplified format for the prompt
    const trendsData = allTrends.map(trend => ({
      name: trend.name,
      category: trend.category,
      growthRate: trend.growthRate,
    }));

    return `Generate ${count} creative TikTok content ideas based on the following:
    
    USER TYPE: ${userType}
    ${niche ? `CONTENT NICHE: ${niche}` : 'NO SPECIFIC NICHE'}
    
    CURRENT TRENDS:
    ${JSON.stringify(trendsData, null, 2)}
    
    Please create unique and engaging content ideas that:
    1. Leverage current trends
    2. Are appropriate for the user type
    3. Would perform well on TikTok
    4. Are specific and actionable
    
    For each idea, include:
    - A catchy title
    - A brief description
    - Related trends
    - Estimated performance (views range and engagement range)
    - Suggested hashtags
    - Suggested sounds
    - Target audience
    
    Return ONLY a JSON object with the following structure:
    {
      "contentIdeas": [
        {
          "id": "unique-id",
          "title": "string",
          "description": "string",
          "relatedTrends": [...trend objects...],
          "estimatedPerformance": {
            "views": { "min": number, "max": number },
            "engagement": { "min": number, "max": number }
          },
          "suggestedHashtags": ["string", "string"],
          "suggestedSounds": ["string", "string"],
          "targetAudience": ["string", "string"]
        },
        ...more ideas...
      ]
    }`;
  }

  /**
   * Generate trend recommendations for general use
   * This is a simpler version of getPersonalizedRecommendations
   */
  public async generateTrendRecommendations(): Promise<TrendRecommendation[]> {
    // Get all trends
    const allTrends = await this.getAllTrends();

    try {
      // Use OpenAI to generate recommendations
      const prompt = `
        Generate 5 TikTok trend recommendations based on current trends.
        
        CURRENT TRENDS:
        ${JSON.stringify(
          allTrends.map(t => ({
            name: t.name,
            category: t.category,
            growthRate: t.growthRate,
            views: t.totalViews,
          })),
          null,
          2
        )}
        
        For each recommendation, include:
        1. Name of the trend
        2. Type (hashtag, sound, effect, challenge, content format)
        3. Brief description
        4. Current views estimate
        5. Predicted views in 1 week
        6. Growth rate
        7. Confidence score (0-100)
        8. Peak time (ISO date string)
        
        Return ONLY a JSON array with objects having this structure:
        [
          {
            "id": string,
            "name": string,
            "type": string,
            "description": string,
            "currentViews": number,
            "predictedViews": number,
            "growth": number,
            "confidence": number,
            "peakTime": string
          }
        ]
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert TikTok trend analyst. Generate realistic trend recommendations based on current data. Return only JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) throw new Error('No response from AI');

      const parsedResponse = JSON.parse(response);
      return Array.isArray(parsedResponse) ? parsedResponse : [];
    } catch (error) {
      console.error('Error generating trend recommendations:', error);

      // Fallback: Return basic recommendations based on growth rate
      return allTrends
        .sort((a, b) => b.growthRate - a.growthRate)
        .slice(0, 5)
        .map(trend => ({
          id: `rec-${trend.id}`,
          name: trend.name,
          type: trend.category,
          description: `Trending ${trend.category} with high growth rate`,
          currentViews: trend.totalViews,
          predictedViews: Math.floor(trend.totalViews * (1 + trend.growthRate / 100)),
          growth: trend.growthRate,
          confidence: 70 + Math.floor(Math.random() * 20),
          peakTime: new Date(
            Date.now() + 86400000 * (3 + Math.floor(Math.random() * 4))
          ).toISOString(),
        }));
    }
  }
}
