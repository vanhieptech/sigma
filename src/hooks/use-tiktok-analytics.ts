"use client";

import { useState, useEffect, useCallback } from 'react';
import { TikTokAnalytics } from '@/types/tiktok';
import { getTikTokAnalytics } from '@/lib/api/tiktok-api';

interface UseTikTokAnalyticsProps {
  username?: string;
  daysToAnalyze?: number;
}

interface UseTikTokAnalyticsReturn {
  analytics: TikTokAnalytics | null;
  isLoading: boolean;
  error: Error | null;
  refreshAnalytics: () => Promise<void>;
}

export function useTikTokAnalytics({
  username = '',
  daysToAnalyze = 30
}: UseTikTokAnalyticsProps = {}): UseTikTokAnalyticsReturn {
  const [analytics, setAnalytics] = useState<TikTokAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!username) {
      setAnalytics(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get analytics data from the API service
      const data = await getTikTokAnalytics(username, daysToAnalyze);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
    } finally {
      setIsLoading(false);
    }
  }, [username, daysToAnalyze]);

  // Initial fetch
  useEffect(() => {
    if (username) {
      fetchAnalytics();
    }
  }, [username, fetchAnalytics]);

  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refreshAnalytics
  };
} 