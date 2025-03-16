import { NextRequest, NextResponse } from 'next/server';
import {
  TrendAnalyticsResponse,
  TrendingItem,
  TrendRecommendation,
  ContentIdea,
} from '@/types/analytics';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Get a random trend name based on category
 */
function getRandomTrendName(category: string): string {
  // Names for different trend categories
  const trendNames: Record<string, string[]> = {
    hashtags: [
      'fyp',
      'foryoupage',
      'viral',
      'trending',
      'comedy',
      'dance',
      'music',
      'fashion',
      'food',
      'fitness',
      'beauty',
      'travel',
      'art',
      'diy',
      'lifehack',
      'pov',
      'asmr',
      'challenge',
      'duet',
      'greenscreen',
      'tutorial',
      'storytime',
      'motivation',
      'funny',
    ],
    sounds: [
      'Original Sound',
      'Monkeys Spinning Monkeys',
      'Oh No No No',
      'Into The Thick Of It',
      'Astronaut In The Ocean',
      'Savage Love',
      'Rasputin',
      'Levitating',
      'Stay',
      'Beggin',
      'Good 4 U',
      'Fancy Like',
      'Adore You',
      'Kiss Me More',
      'Mood',
      'Drivers License',
      'Peaches',
      'Montero',
      'Industry Baby',
      'Butter',
      'Easy On Me',
      'Shivers',
      'Bad Habits',
    ],
    effects: [
      'Green Screen',
      'Time Warp Scan',
      'Slow Zoom',
      'Voice Effects',
      'Beauty Filter',
      'Color Selector',
      'Sticker',
      'Mirror',
      'Duet',
      'Disco Lights',
      'Glitch',
      'Blur',
      'Vintage',
      'Sparkle',
      'Raindrop',
      'Pixelate',
      'Neon',
      'Freeze Frame',
      'Reverse',
    ],
    challenges: [
      'Renegade',
      'Savage',
      'Wipe It Down',
      'Blinding Lights',
      'Flip The Switch',
      'Toosie Slide',
      'Silhouette',
      'Buss It',
      'Tell Me Without Telling Me',
      'Adult Swim',
      'Hands In The Air',
      'Stair Step',
      'Pass The Phone',
      'Emoji',
      'Tortilla Slap',
    ],
  };

  // Select a random name from the category
  const names = trendNames[category] || trendNames.hashtags;
  const randomName = names[Math.floor(Math.random() * names.length)];

  // Format name based on category
  return category === 'hashtags' ? `#${randomName}` : randomName;
}

/**
 * Generate trending items for a specific category
 */
function generateTrendingItems(category: string, count: number = 10): TrendingItem[] {
  const items: TrendingItem[] = [];

  for (let i = 0; i < count; i++) {
    const viewCount = Math.floor(Math.random() * 10000000) + 100000;
    const growth = Math.random() > 0.2 ? Math.random() * 20 : -Math.random() * 10;
    const postCount = Math.floor(Math.random() * 100000) + 1000;

    items.push({
      id: `trend-${category}-${i}`,
      name: getRandomTrendName(category),
      viewCount,
      growth,
      category,
      count: postCount,
      creatorCount: Math.floor(postCount / (5 + Math.random() * 10)),
    });
  }

  return items;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  userInterests: string[] = [],
  contentHistory: string[] = [],
  count: number = 5
): TrendRecommendation[] {
  // Sample interests if none provided
  const interests =
    userInterests.length > 0 ? userInterests : ['dance', 'comedy', 'fashion', 'food', 'travel'];

  // Generate recommendations based on interests
  return Array(count)
    .fill(0)
    .map((_, index) => {
      // Randomly select recommendation type
      const types = ['hashtag', 'sound', 'effect', 'challenge', 'content'];
      const type = types[Math.floor(Math.random() * types.length)];

      // Generate name based on type
      let name = '';
      let description = '';

      switch (type) {
        case 'hashtag':
          const randomInterest = interests[Math.floor(Math.random() * interests.length)];
          name = `#${randomInterest}${Math.floor(Math.random() * 2023)}`;
          description = `This hashtag is trending in the ${randomInterest} category and aligns with your content style.`;
          break;
        case 'sound':
          const soundNames = [
            'Viral Beat',
            'Trending Remix',
            'Popular Song',
            'Catchy Tune',
            'Dance Music',
            'Funny Sound',
            'Voice Effect',
            'Remix',
          ];
          name = soundNames[Math.floor(Math.random() * soundNames.length)];
          description = `This sound is gaining popularity and would work well with your content style.`;
          break;
        case 'effect':
          const effectNames = [
            'Color Pop',
            'Zoom Effect',
            'Transition',
            'Filter Pack',
            'Beauty Mode',
            'Background Blur',
            'Time Warp',
            'Glitch Effect',
          ];
          name = effectNames[Math.floor(Math.random() * effectNames.length)];
          description = `This effect is trending and can enhance your visual content.`;
          break;
        case 'challenge':
          const challengeNames = [
            'Dance Challenge',
            'Transition Challenge',
            'Outfit Change',
            'Before/After',
            'Day in the Life',
            'What I Eat',
            'Transformation',
          ];
          name = challengeNames[Math.floor(Math.random() * challengeNames.length)];
          description = `This challenge is trending and matches your content niche.`;
          break;
        case 'content':
          const contentIdeas = [
            'Day in the Life',
            'Behind the Scenes',
            'Tutorial Series',
            'Q&A Session',
            'Product Review',
            'Reaction Video',
            'Collaboration',
          ];
          name = contentIdeas[Math.floor(Math.random() * contentIdeas.length)];
          description = `This content format is performing well for creators in your niche.`;
          break;
      }

      // Generate random scores
      const relevanceScore = Math.floor(Math.random() * 4) + 7; // 7-10
      const popularity = Math.floor(Math.random() * 5) + 6; // 6-10
      const growth = Math.floor(Math.random() * 80) + 20; // 20-100%

      return {
        id: `rec-${index}`,
        type,
        name,
        description,
        relevanceScore,
        popularity,
        growth,
      };
    });
}

/**
 * Generate content ideas
 */
function generateContentIdeas(
  userType: string = 'creator',
  niche: string = 'general',
  count: number = 5
): ContentIdea[] {
  // Content formats
  const formats = ['short', 'long', 'live', 'photo'];

  // Title templates based on niche
  const titleTemplates: Record<string, string[]> = {
    general: [
      'Day in the Life of a Creator',
      'Behind the Scenes',
      'How I Create My Content',
      'Q&A: Answering Your Top Questions',
      'My Favorite Tools and Apps',
    ],
    fashion: [
      'Outfit of the Day',
      'Styling Tips for [Season]',
      'Fashion Haul: New Trends',
      'How to Style One Item Multiple Ways',
      'Thrift Store Finds and Styling',
    ],
    food: [
      'Easy 15-Minute Recipe',
      'What I Eat in a Day',
      'Restaurant Review: Hidden Gems',
      'Cooking Hack That Will Change Your Life',
      'Budget-Friendly Meal Prep',
    ],
    fitness: [
      '10-Minute Home Workout',
      'My Fitness Journey',
      'Healthy Meal Prep Ideas',
      'Gym Routine Walkthrough',
      'Fitness Myth Busting',
    ],
    beauty: [
      '5-Minute Makeup Routine',
      'Skincare Secrets Revealed',
      'Product Review: Worth the Hype?',
      'Hair Transformation Tutorial',
      'Beauty Hacks You Need to Know',
    ],
    travel: [
      'Hidden Gems in [Location]',
      'Travel Vlog: 24 Hours in [City]',
      'Packing Tips for Any Trip',
      'Budget Travel Guide',
      'Best Street Food in [Location]',
    ],
    tech: [
      'Honest Review: Latest Gadget',
      'Tech Setup Tour',
      'App Recommendations for Productivity',
      'How to Fix Common Tech Problems',
      'New Tech Unboxing and First Impressions',
    ],
    gaming: [
      'Gameplay Highlights',
      'Tips and Tricks for [Game]',
      'Game Review: Is It Worth Playing?',
      'Gaming Setup Tour',
      'Live Stream Highlights',
    ],
  };

  // Use general templates if niche not found
  const templates = titleTemplates[niche] || titleTemplates.general;

  // Generate content ideas
  return Array(count)
    .fill(0)
    .map((_, index) => {
      // Select random format and template
      const format = formats[Math.floor(Math.random() * formats.length)] as
        | 'short'
        | 'long'
        | 'live'
        | 'photo';
      const title = templates[index % templates.length];

      // Generate random hashtags
      const hashtagPool = [
        'trending',
        'viral',
        'fyp',
        'foryou',
        'tiktok',
        'creator',
        'content',
        niche,
        userType,
        'tips',
        'tutorial',
        'howto',
        'lifestyle',
        'trending2023',
      ];

      const suggestedHashtags = Array(5)
        .fill(0)
        .map(() => hashtagPool[Math.floor(Math.random() * hashtagPool.length)])
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

      // Generate random sounds if not a photo
      const suggestedSounds =
        format !== 'photo'
          ? ['Trending Sound 2023', 'Original Sound', 'Popular Remix', 'Viral Beat']
          : undefined;

      // Generate estimated views based on format
      let minViews = 1000;
      let maxViews = 10000;

      switch (format) {
        case 'short':
          minViews = 5000;
          maxViews = 50000;
          break;
        case 'long':
          minViews = 2000;
          maxViews = 20000;
          break;
        case 'live':
          minViews = 500;
          maxViews = 5000;
          break;
        case 'photo':
          minViews = 1000;
          maxViews = 10000;
          break;
      }

      // Generate description
      const descriptions = [
        `Create a ${format} video showing ${title.toLowerCase()} to engage your audience.`,
        `Share your unique take on ${title.toLowerCase()} in a ${format} format.`,
        `This ${format} content idea is perfect for your ${niche} niche and will resonate with your audience.`,
        `Showcase your expertise in ${niche} with this ${format} about ${title.toLowerCase()}.`,
        `A ${format} format works well for this content idea about ${title.toLowerCase()}.`,
      ];

      return {
        id: `idea-${index}`,
        title,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        format,
        suggestedHashtags,
        suggestedSounds,
        estimatedViews: {
          min: minViews,
          max: maxViews,
        },
        relevance: Math.floor(Math.random() * 3) + 8, // 8-10
      };
    });
}

/**
 * GET - Fetch trending data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    // If a specific category is requested, return only that category
    if (category) {
      switch (category) {
        case 'hashtags':
        case 'sounds':
        case 'effects':
        case 'challenges':
          const items = generateTrendingItems(category, 10);
          return NextResponse.json({ success: true, data: items });
        default:
          return NextResponse.json({ success: false, error: 'Invalid category' }, { status: 400 });
      }
    }

    // Otherwise, return all categories
    const hashtags = generateTrendingItems('hashtags', 10);
    const sounds = generateTrendingItems('sounds', 10);
    const effects = generateTrendingItems('effects', 10);
    const challenges = generateTrendingItems('challenges', 10);

    return NextResponse.json({
      success: true,
      data: {
        hashtags,
        sounds,
        effects,
        challenges,
      },
    });
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trend data' },
      { status: 500 }
    );
  }
}

/**
 * POST - Generate recommendations or content ideas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userInterests, contentHistory, userType, niche, count } = body;

    // Generate recommendations
    if (action === 'recommendations') {
      const recommendations = generateRecommendations(userInterests, contentHistory, count || 5);

      return NextResponse.json({
        success: true,
        data: {
          recommendations,
        },
      });
    }

    // Generate content ideas
    if (action === 'contentIdeas') {
      const contentIdeas = generateContentIdeas(
        userType || 'creator',
        niche || 'general',
        count || 5
      );

      return NextResponse.json({
        success: true,
        data: {
          contentIdeas,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error generating trend data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate trend data' },
      { status: 500 }
    );
  }
}
