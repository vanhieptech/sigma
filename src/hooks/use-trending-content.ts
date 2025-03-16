'use client';

import { useState, useEffect, useCallback } from 'react';
import { TikTokHashtag, TikTokSound, TikTokContentIdea } from '@/types/tiktok';
import { v4 as uuidv4 } from 'uuid';
import {
  getTikTokTrendingHashtags,
  getTikTokTrendingSounds,
  getTikTokContentIdeas,
} from '@/lib/api/tiktok-api';

interface UseTrendingContentProps {
  initialCategory?: string;
}

interface UseTrendingContentReturn {
  hashtags: TikTokHashtag[];
  sounds: TikTokSound[];
  contentIdeas: TikTokContentIdea[];
  isLoading: boolean;
  error: Error | null;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  refreshTrends: () => Promise<void>;
  generateContentIdea: () => TikTokContentIdea;
}

const categories = [
  'all',
  'comedy',
  'dance',
  'fashion',
  'fitness',
  'food',
  'gaming',
  'beauty',
  'travel',
  'education',
  'pets',
];

const ideaTemplates = [
  {
    title: 'Day in the Life of {category} Creator',
    description:
      'Show your followers what a typical day looks like for you as a {category} content creator.',
  },
  {
    title: '{category} Hack You Need to Know',
    description:
      'Share a unique and useful {category} tip that your audience might not know about.',
  },
  {
    title: 'Trying the Viral {category} Trend',
    description:
      "Put your spin on the latest viral {category} trend that's been making waves on TikTok.",
  },
  {
    title: 'What I Wish I Knew Before Starting {category}',
    description:
      'Share insights and advice for beginners in the {category} space based on your experience.',
  },
  {
    title: 'Behind the Scenes of {category}',
    description:
      'Give followers a glimpse into what happens behind the scenes in your {category} content creation.',
  },
];

export function useTrendingContent({
  initialCategory = 'all',
}: UseTrendingContentProps = {}): UseTrendingContentReturn {
  const [hashtags, setHashtags] = useState<TikTokHashtag[]>([]);
  const [sounds, setSounds] = useState<TikTokSound[]>([]);
  const [contentIdeas, setContentIdeas] = useState<TikTokContentIdea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const fetchTrendingContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel for better performance
      const [hashtagsData, soundsData, ideasData] = await Promise.all([
        getTikTokTrendingHashtags(selectedCategory),
        getTikTokTrendingSounds(selectedCategory),
        getTikTokContentIdeas(selectedCategory, 5),
      ]);

      setHashtags(hashtagsData);
      setSounds(soundsData);

      // If we got content ideas from the API, use them
      if (ideasData && ideasData.length > 0) {
        setContentIdeas(ideasData);
      } else {
        // Otherwise generate our own ideas
        const ideas: TikTokContentIdea[] = Array(5)
          .fill(null)
          .map(() => generateContentIdea(selectedCategory));

        setContentIdeas(ideas);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trending content'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // Generate a content idea
  const generateContentIdea = useCallback(
    (category: string = selectedCategory): TikTokContentIdea => {
      // Get random template
      const template = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];

      // Replace category in template
      const displayCategory =
        category === 'all' ? categories[Math.floor(Math.random() * categories.length)] : category;
      const title = template.title.replace('{category}', displayCategory);
      const description = template.description.replace('{category}', displayCategory);

      // Get some random hashtags for this category (3-5)
      const hashtags = ['tiktoktips', 'fyp', 'viral', displayCategory, 'creator', 'trending'];
      const selectedHashtags = hashtags
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, Math.floor(Math.random() * 3) + 3) // 3-5 hashtags
        .map(h => `#${h}`);

      // Determine if trending (70% chance if category isn't 'all')
      const isTrending = category !== 'all' ? Math.random() < 0.7 : Math.random() < 0.4;

      return {
        id: uuidv4(),
        title,
        description,
        trending: isTrending,
        estimatedViews: Math.floor(Math.random() * 100000) + 5000,
        estimatedEngagement: Math.floor(Math.random() * 10000) + 1000,
        suggestedHashtags: selectedHashtags,
        suggestedSoundId:
          Math.random() > 0.3 ? `sound-${Math.floor(Math.random() * 10) + 1}` : undefined,
        trend: isTrending
          ? {
              type: Math.random() > 0.5 ? 'hashtag' : 'sound',
              name: Math.random() > 0.5 ? selectedHashtags[0].substring(1) : 'Popular Sound',
              growthRate: Math.random() * 200, // 0-200% growth
            }
          : undefined,
        createdAt: new Date().toISOString(),
        category: displayCategory,
      };
    },
    [selectedCategory]
  );

  // Initial fetch
  useEffect(() => {
    fetchTrendingContent();
  }, [fetchTrendingContent]);

  const refreshTrends = useCallback(async () => {
    await fetchTrendingContent();
  }, [fetchTrendingContent]);

  const handleGenerateContentIdea = useCallback(() => {
    const newIdea = generateContentIdea();
    return newIdea;
  }, [generateContentIdea]);

  return {
    hashtags,
    sounds,
    contentIdeas,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    refreshTrends,
    generateContentIdea: handleGenerateContentIdea,
  };
}
