'use client';

import {
  TikTokAnalytics,
  TikTokHashtag,
  TikTokSound,
  TikTokContentIdea,
  TikTokUserProfile,
} from '@/types/tiktok';
import {
  getMockAnalytics,
  getTrendingHashtags,
  getTrendingSounds,
  getRandomUserProfile,
} from '@/lib/mock/tiktok-data';

// API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const ANALYTICS_ENDPOINT = `${API_BASE_URL}/api/analytics`;
const TRENDING_ENDPOINT = `${API_BASE_URL}/api/trending`;
const PROFILE_ENDPOINT = `${API_BASE_URL}/api/profile`;

// Helper for API requests
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 5000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Get TikTok analytics data
export async function getTikTokAnalytics(
  username: string,
  days: number = 30
): Promise<TikTokAnalytics> {
  try {
    // Try to fetch from real API
    if (API_BASE_URL) {
      const response = await fetchWithTimeout(
        `${ANALYTICS_ENDPOINT}?username=${encodeURIComponent(username)}&days=${days}`,
        { method: 'GET' }
      );

      if (response.ok) {
        const data = await response.json();
        return data as TikTokAnalytics;
      }
    }
  } catch (error) {
    console.error('Error fetching TikTok analytics:', error);
  }

  // Fall back to mock data
  console.info('Using mock TikTok analytics data');
  return getMockAnalytics(days);
}

// Get TikTok trending hashtags
export async function getTikTokTrendingHashtags(category?: string): Promise<TikTokHashtag[]> {
  try {
    // Try to fetch from real API
    if (API_BASE_URL) {
      const url =
        category && category !== 'all'
          ? `${TRENDING_ENDPOINT}/hashtags?category=${encodeURIComponent(category)}`
          : `${TRENDING_ENDPOINT}/hashtags`;

      const response = await fetchWithTimeout(url, { method: 'GET' });

      if (response.ok) {
        const data = await response.json();
        return data as TikTokHashtag[];
      }
    }
  } catch (error) {
    console.error('Error fetching TikTok trending hashtags:', error);
  }

  // Fall back to mock data
  console.info('Using mock TikTok trending hashtags data');
  const allHashtags = getTrendingHashtags();

  // Filter by category if specified
  if (category && category !== 'all') {
    return allHashtags.filter(hashtag =>
      hashtag.name.toLowerCase().includes(category.toLowerCase())
    );
  }

  return allHashtags;
}

// Get TikTok trending sounds
export async function getTikTokTrendingSounds(category?: string): Promise<TikTokSound[]> {
  try {
    // Try to fetch from real API
    if (API_BASE_URL) {
      const url =
        category && category !== 'all'
          ? `${TRENDING_ENDPOINT}/sounds?category=${encodeURIComponent(category)}`
          : `${TRENDING_ENDPOINT}/sounds`;

      const response = await fetchWithTimeout(url, { method: 'GET' });

      if (response.ok) {
        const data = await response.json();
        return data as TikTokSound[];
      }
    }
  } catch (error) {
    console.error('Error fetching TikTok trending sounds:', error);
  }

  // Fall back to mock data
  console.info('Using mock TikTok trending sounds data');
  const allSounds = getTrendingSounds();

  // For mock data, just simulate category filtering
  if (category && category !== 'all') {
    return allSounds.filter((_, index) => index % 2 === 0);
  }

  return allSounds;
}

// Get TikTok content ideas based on trending data
export async function getTikTokContentIdeas(
  category?: string,
  count: number = 5
): Promise<TikTokContentIdea[]> {
  try {
    // Try to fetch from real API
    if (API_BASE_URL) {
      const url =
        category && category !== 'all'
          ? `${TRENDING_ENDPOINT}/content-ideas?category=${encodeURIComponent(category)}&count=${count}`
          : `${TRENDING_ENDPOINT}/content-ideas?count=${count}`;

      const response = await fetchWithTimeout(url, { method: 'GET' });

      if (response.ok) {
        const data = await response.json();
        return data as TikTokContentIdea[];
      }
    }
  } catch (error) {
    console.error('Error fetching TikTok content ideas:', error);
  }

  // Fall back to mock data
  console.info('Using mock TikTok content ideas data');
  // Generate content ideas using the templates from use-trending-content.ts
  // This is implemented separately in each hook
  return [];
}

// Get TikTok user profile
export async function getTikTokUserProfile(username: string): Promise<TikTokUserProfile> {
  try {
    // Try to fetch from real API
    if (API_BASE_URL) {
      const response = await fetchWithTimeout(
        `${PROFILE_ENDPOINT}?username=${encodeURIComponent(username)}`,
        { method: 'GET' }
      );

      if (response.ok) {
        const data = await response.json();
        return data as TikTokUserProfile;
      }
    }
  } catch (error) {
    console.error('Error fetching TikTok user profile:', error);
  }

  // Fall back to mock data
  console.info('Using mock TikTok user profile data');
  const profile = getRandomUserProfile();
  profile.uniqueId = username;
  return profile;
}
