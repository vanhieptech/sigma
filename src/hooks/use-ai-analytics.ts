'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  VideoAnalytics,
  SentimentAnalysis,
  AudienceTimingMetrics,
  ContentStrategyRecommendation,
} from '@/types/analytics';
import { useApiContext } from '@/providers/tiktok-api-provider';
import { SentimentAnalyzer } from '@/lib/ai/sentiment-analyzer';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface UseAiAnalyticsResult {
  videoAnalytics: VideoAnalytics | null;
  sentimentAnalysis: SentimentAnalysis | null;
  audienceTimingMetrics: AudienceTimingMetrics | null;
  contentStrategy: ContentStrategyRecommendation | null;
  isLoading: boolean;
  error: string | null;
  fetchVideoAnalytics: (videoId: string) => Promise<void>;
  analyzeComments: (videoId: string) => Promise<void>;
  generateContentStrategy: () => Promise<void>;
  generateAudienceTiming: () => Promise<void>;
}

export function useAiAnalytics(): UseAiAnalyticsResult {
  const { client, isAuthenticated } = useApiContext();
  const [videoAnalytics, setVideoAnalytics] = useState<VideoAnalytics | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis | null>(null);
  const [audienceTimingMetrics, setAudienceTimingMetrics] = useState<AudienceTimingMetrics | null>(
    null
  );
  const [contentStrategy, setContentStrategy] = useState<ContentStrategyRecommendation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get sentiment analyzer instance
  const sentimentAnalyzer = SentimentAnalyzer.getInstance();

  /**
   * Fetch video analytics from TikTok API
   */
  const fetchVideoAnalytics = useCallback(
    async (videoId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!isAuthenticated) {
          throw new Error('API not authenticated');
        }

        // We need to find the video in user's videos
        const userVideos = await client.getUserVideos('me', 50);
        const video = userVideos.find(v => v.videoId === videoId);

        if (!video) {
          throw new Error('Video not found');
        }

        setVideoAnalytics(video);
      } catch (err) {
        console.error('Error fetching video analytics:', err);
        setError('Failed to fetch video analytics');
      } finally {
        setIsLoading(false);
      }
    },
    [client, isAuthenticated]
  );

  /**
   * Analyze comments for a video
   */
  const analyzeComments = useCallback(
    async (videoId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch comments for the video
        const comments = await client.getVideoComments(videoId, 100);

        // Analyze sentiment using AI
        const analysis = await sentimentAnalyzer.analyzeComments(comments);
        setSentimentAnalysis(analysis);
      } catch (err) {
        console.error('Error analyzing comments:', err);
        setError('Failed to analyze comments');
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  /**
   * Generate content strategy recommendations using AI
   */
  const generateContentStrategy = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!videoAnalytics) {
        throw new Error('No video analytics available');
      }

      // Use OpenAI to generate content strategy based on video performance
      const prompt = `
        Based on the following TikTok video analytics, generate a content strategy recommendation:
        
        Video Analytics:
        - Views: ${videoAnalytics.views}
        - Likes: ${videoAnalytics.likes}
        - Comments: ${videoAnalytics.comments}
        - Shares: ${videoAnalytics.shares}
        - Average Watch Time: ${videoAnalytics.watchTimeAvg || 0}s
        - Completion Rate: ${videoAnalytics.completionRate || 0}%
        - Engagement Rate: ${videoAnalytics.engagementRate || 0}%
        
        The strategy should include:
        1. Recommended content types with engagement rates and posting frequency
        2. Optimal video length range
        3. Recommended weekly posting schedule
        4. Best posting times
        
        Return ONLY a JSON object with the following structure:
        {
          "contentTypes": [
            { "type": string, "engagementRate": number, "recommendedFrequency": number }
          ],
          "optimaVideoLength": {
            "min": number, 
            "max": number,
            "ideal": number
          },
          "recommendedPostingFrequency": number,
          "recommendedPostingTimes": [
            { "weekday": string, "times": [string] }
          ]
        }
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert TikTok content strategist. Generate data-driven content strategy recommendations. Return only JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) throw new Error('No response from AI');

      const parsedResponse = JSON.parse(response);
      setContentStrategy(parsedResponse as ContentStrategyRecommendation);
    } catch (err) {
      console.error('Error generating content strategy:', err);
      setError('Failed to generate content strategy');
    } finally {
      setIsLoading(false);
    }
  }, [videoAnalytics]);

  /**
   * Generate audience timing recommendations using AI
   */
  const generateAudienceTiming = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!videoAnalytics) {
        throw new Error('No video analytics available');
      }

      // Use OpenAI to generate audience timing metrics based on video performance
      const prompt = `
        Based on the following TikTok video analytics, generate audience timing metrics:
        
        Video Analytics:
        - Views: ${videoAnalytics.views}
        - Likes: ${videoAnalytics.likes}
        - Comments: ${videoAnalytics.comments}
        - Shares: ${videoAnalytics.shares}
        - Average Watch Time: ${videoAnalytics.watchTimeAvg || 0}s
        
        Generate timing metrics including:
        1. Best posting times with engagement rates
        2. Audience active hours
        3. Audience active weekdays
        4. Primary timezone distribution
        
        Return ONLY a JSON object with the following structure:
        {
          "bestPostingTimes": [
            { "weekday": string, "hour": number, "engagementRate": number }
          ],
          "audienceActiveHours": [
            { "hour": number, "activity": number }
          ],
          "audienceActiveWeekdays": [
            { "weekday": string, "activity": number }
          ],
          "timezone": [
            { "name": string, "percentage": number }
          ]
        }
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert TikTok analytics specialist. Generate data-driven audience timing recommendations. Return only JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) throw new Error('No response from AI');

      const parsedResponse = JSON.parse(response);
      setAudienceTimingMetrics(parsedResponse as AudienceTimingMetrics);
    } catch (err) {
      console.error('Error generating audience timing metrics:', err);
      setError('Failed to generate audience timing metrics');
    } finally {
      setIsLoading(false);
    }
  }, [videoAnalytics]);

  return {
    videoAnalytics,
    sentimentAnalysis,
    audienceTimingMetrics,
    contentStrategy,
    isLoading,
    error,
    fetchVideoAnalytics,
    analyzeComments,
    generateContentStrategy,
    generateAudienceTiming,
  };
}
