'use client';

import { useState, useCallback } from 'react';
import { SentimentAnalysis } from '@/types/analytics';

interface UseSentimentAnalyticsReturn {
  sentimentAnalysis: SentimentAnalysis | null;
  singleSentiment: number | null;
  wordCloud: { word: string; count: number }[] | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeComments: (comments: string[] | Comment[], includeWordCloud?: boolean) => Promise<void>;
  analyzeSingleComment: (text: string) => Promise<void>;
}

export function useSentimentAnalytics(): UseSentimentAnalyticsReturn {
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis | null>(null);
  const [singleSentiment, setSingleSentiment] = useState<number | null>(null);
  const [wordCloud, setWordCloud] = useState<{ word: string; count: number }[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyze multiple comments to get sentiment analysis
   */
  const analyzeComments = useCallback(
    async (comments: string[] | Comment[], includeWordCloud: boolean = false) => {
      if (!comments.length) return;

      setIsAnalyzing(true);
      setError(null);

      try {
        const response = await fetch('/api/analytics/sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comments,
            includeWordCloud,
          }),
        });

        if (!response.ok) throw new Error('Failed to analyze comments');

        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Unknown error');

        setSentimentAnalysis(result.data);

        if (includeWordCloud && result.data.wordCloud) {
          setWordCloud(result.data.wordCloud);
        }
      } catch (err) {
        console.error('Error analyzing comments:', err);
        setError(err instanceof Error ? err.message : 'Unknown error analyzing comments');
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  /**
   * Analyze a single comment/text to get its sentiment score
   */
  const analyzeSingleComment = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to analyze comment');

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Unknown error');

      setSingleSentiment(result.data.sentiment);
    } catch (err) {
      console.error('Error analyzing comment:', err);
      setError(err instanceof Error ? err.message : 'Unknown error analyzing comment');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    sentimentAnalysis,
    singleSentiment,
    wordCloud,
    isAnalyzing,
    error,
    analyzeComments,
    analyzeSingleComment,
  };
}
