'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingItem, TrendRecommendation, ContentIdea } from '@/types/analytics';

interface UseTrendAnalyticsReturn {
  hashtags: TrendingItem[];
  sounds: TrendingItem[];
  effects: TrendingItem[];
  challenges: TrendingItem[];
  recommendations: TrendRecommendation[];
  contentIdeas: ContentIdea[];
  isLoading: boolean;
  error: string | null;
  fetchTrends: (category?: string) => Promise<void>;
  generateRecommendations: (userInterests: string[], contentHistory: string[]) => Promise<void>;
  generateContentIdeas: (userType: string, niche: string) => Promise<void>;
}

export function useTrendAnalytics(): UseTrendAnalyticsReturn {
  const [hashtags, setHashtags] = useState<TrendingItem[]>([]);
  const [sounds, setSounds] = useState<TrendingItem[]>([]);
  const [effects, setEffects] = useState<TrendingItem[]>([]);
  const [challenges, setChallenges] = useState<TrendingItem[]>([]);
  const [recommendations, setRecommendations] = useState<TrendRecommendation[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch trending data from the API
   */
  const fetchTrends = useCallback(async (category?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = category ? `/api/analytics/trends?category=${category}` : '/api/analytics/trends';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch trend data');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }

      if (category) {
        // If a specific category was requested, update only that category
        switch (category) {
          case 'hashtags':
            setHashtags(result.data);
            break;
          case 'sounds':
            setSounds(result.data);
            break;
          case 'effects':
            setEffects(result.data);
            break;
          case 'challenges':
            setChallenges(result.data);
            break;
        }
      } else {
        // Update all categories
        setHashtags(result.data.hashtags || []);
        setSounds(result.data.sounds || []);
        setEffects(result.data.effects || []);
        setChallenges(result.data.challenges || []);
      }
    } catch (err) {
      console.error('Error fetching trend data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching trend data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate personalized recommendations based on user interests and content history
   */
  const generateRecommendations = useCallback(
    async (userInterests: string[] = [], contentHistory: string[] = []) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/analytics/trends', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'recommendations',
            userInterests,
            contentHistory,
            count: 5,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate recommendations');
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Unknown error');
        }

        setRecommendations(result.data.recommendations || []);
      } catch (err) {
        console.error('Error generating recommendations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error generating recommendations');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Generate content ideas based on user type and niche
   */
  const generateContentIdeas = useCallback(
    async (userType: string = 'creator', niche: string = 'general') => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/analytics/trends', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'contentIdeas',
            userType,
            niche,
            count: 5,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate content ideas');
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Unknown error');
        }

        setContentIdeas(result.data.contentIdeas || []);
      } catch (err) {
        console.error('Error generating content ideas:', err);
        setError(err instanceof Error ? err.message : 'Unknown error generating content ideas');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch trends on component mount
  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return {
    hashtags,
    sounds,
    effects,
    challenges,
    recommendations,
    contentIdeas,
    isLoading,
    error,
    fetchTrends,
    generateRecommendations,
    generateContentIdeas,
  };
}
