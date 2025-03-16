'use client';

import { useState, useEffect, useCallback } from 'react';
import { HistoricalComparison, TimeInterval } from '@/types/analytics';
import { useApiContext } from '@/providers/tiktok-api-provider';

interface UseHistoricalAnalyticsProps {
  userId: string;
  initialTimeRange?: TimeInterval;
  autoFetch?: boolean;
}

interface UseHistoricalAnalyticsResult {
  comparison: HistoricalComparison | null;
  isLoading: boolean;
  error: string | null;
  fetchComparison: (timeRange: TimeInterval) => Promise<void>;
}

export function useHistoricalAnalytics({
  userId,
  initialTimeRange = '24h',
  autoFetch = true,
}: UseHistoricalAnalyticsProps): UseHistoricalAnalyticsResult {
  const [comparison, setComparison] = useState<HistoricalComparison | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { client } = useApiContext();

  const fetchComparison = useCallback(
    async (timeRange: TimeInterval) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await client.getHistoricalComparison(userId, timeRange as string);
        setComparison(data);
      } catch (err) {
        console.error('Error fetching historical comparison:', err);
        setError('Failed to fetch historical data');
      } finally {
        setIsLoading(false);
      }
    },
    [client, userId]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchComparison(initialTimeRange);
    }
  }, [autoFetch, fetchComparison, initialTimeRange]);

  return {
    comparison,
    isLoading,
    error,
    fetchComparison,
  };
}
