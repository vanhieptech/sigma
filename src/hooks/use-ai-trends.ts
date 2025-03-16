'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingItem,
  ContentIdea,
  TrendRecommendation,
  SentimentAnalysis,
} from '@/types/analytics';
import { useApiContext } from '@/providers/tiktok-api-provider';
import { TrendAnalyzer } from '@/lib/ai/trend-analyzer';
import { SentimentAnalyzer } from '@/lib/ai/sentiment-analyzer';

interface UseTrendsResult {
  trendingHashtags: TrendingItem[];
  trendingSounds: TrendingItem[];
  contentIdeas: ContentIdea[];
  recommendations: TrendRecommendation[];
  sentimentAnalysis: SentimentAnalysis | null;
  isLoading: boolean;
  error: string | null;
  refreshTrends: () => Promise<void>;
  refreshContentIdeas: (userType: string, niche: string) => Promise<void>;
  analyzeSentiment: (comments: string[] | Comment[]) => Promise<void>;
}

export function useAiTrends(): UseTrendsResult {
  const { client, isAuthenticated } = useApiContext();
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingItem[]>([]);
  const [trendingSounds, setTrendingSounds] = useState<TrendingItem[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [recommendations, setRecommendations] = useState<TrendRecommendation[]>([]);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get trend analyzer instances
  const trendAnalyzer = TrendAnalyzer.getInstance();
  const sentimentAnalyzer = SentimentAnalyzer.getInstance();

  /**
   * Fetch trending data from TikTok API
   */
  const refreshTrends = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isAuthenticated) {
        throw new Error('API not authenticated. Please configure your TikTok API credentials.');
      }

      // Fetch trending data from TikTok API
      const [hashtags, sounds, recommendations] = await Promise.all([
        client.getTrendingHashtags(10),
        client.getTrendingSounds(10),
        // Try to use personalized recommendations if available, otherwise use general recommendations
        typeof trendAnalyzer.getPersonalizedRecommendations === 'function'
          ? trendAnalyzer.getPersonalizedRecommendations(
              ['fashion', 'beauty', 'lifestyle'],
              [
                { category: 'fashion', performance: 85 },
                { category: 'beauty', performance: 92 },
                { category: 'food', performance: 67 },
              ]
            )
          : trendAnalyzer.generateTrendRecommendations(),
      ]);

      setTrendingHashtags(hashtags);
      setTrendingSounds(sounds);
      setRecommendations(recommendations);

      // Generate initial content ideas
      await refreshContentIdeas('creator', 'lifestyle');
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError('Failed to fetch trending data');
    } finally {
      setIsLoading(false);
    }
  }, [client, isAuthenticated]);

  /**
   * Generate content ideas using AI
   */
  const refreshContentIdeas = useCallback(async (userType: string, niche: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate content ideas using AI and trend data
      const ideas = await trendAnalyzer.generateContentIdeas(userType, niche);
      setContentIdeas(ideas);
    } catch (err) {
      console.error('Error generating content ideas:', err);
      setError('Failed to generate content ideas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Analyze sentiment of comments
   */
  const analyzeSentiment = useCallback(async (comments: string[] | Comment[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Analyze sentiment using AI
      const analysis = await sentimentAnalyzer.analyzeComments(comments);
      setSentimentAnalysis(analysis);
    } catch (err) {
      console.error('Error analyzing sentiment:', err);
      setError('Failed to analyze sentiment');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshTrends();
    }
  }, [isAuthenticated, refreshTrends]);

  return {
    trendingHashtags,
    trendingSounds,
    contentIdeas,
    recommendations,
    sentimentAnalysis,
    isLoading,
    error,
    refreshTrends,
    refreshContentIdeas,
    analyzeSentiment,
  };
}
