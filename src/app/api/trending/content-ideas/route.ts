import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { TikTokContentIdea } from '@/types/tiktok';
import { getTrendingHashtags, getTrendingSounds } from '@/lib/mock/tiktok-data';

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
  'pets'
];

const ideaTemplates = [
  {
    title: "Day in the Life of {category} Creator",
    description: "Show your followers what a typical day looks like for you as a {category} content creator."
  },
  {
    title: "{category} Hack You Need to Know",
    description: "Share a unique and useful {category} tip that your audience might not know about."
  },
  {
    title: "Trying the Viral {category} Trend",
    description: "Put your spin on the latest viral {category} trend that's been making waves on TikTok."
  },
  {
    title: "What I Wish I Knew Before Starting {category}",
    description: "Share insights and advice for beginners in the {category} space based on your experience."
  },
  {
    title: "Behind the Scenes of {category}",
    description: "Give followers a glimpse into what happens behind the scenes in your {category} content creation."
  }
];

// Generate a single content idea
function generateContentIdea(category?: string): TikTokContentIdea {
  // Get random template
  const template = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];
  
  // Replace category in template
  const displayCategory = !category || category === 'all' 
    ? categories[Math.floor(Math.random() * categories.length)] 
    : category;
    
  const title = template.title.replace('{category}', displayCategory);
  const description = template.description.replace('{category}', displayCategory);
  
  // Get some random hashtags for this category (3-5)
  const hashtags = ['tiktoktips', 'fyp', 'viral', displayCategory, 'creator', 'trending'];
  const selectedHashtags = hashtags
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, Math.floor(Math.random() * 3) + 3) // 3-5 hashtags
    .map(h => `#${h}`);
  
  // Get sounds
  const allSounds = getTrendingSounds();
  const randomSound = allSounds[Math.floor(Math.random() * allSounds.length)];
  
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
    suggestedSoundId: Math.random() > 0.3 ? randomSound.id : undefined,
    trend: isTrending ? {
      type: Math.random() > 0.5 ? 'hashtag' : 'sound',
      name: Math.random() > 0.5 ? selectedHashtags[0].substring(1) : randomSound.name,
      growthRate: Math.random() * 200 // 0-200% growth
    } : undefined,
    createdAt: new Date().toISOString(),
    category: displayCategory
  };
}

/**
 * GET handler for TikTok content ideas
 * 
 * Generates content ideas based on trending data
 * 
 * Query parameters:
 * - category: Category to generate ideas for (optional)
 * - count: Number of ideas to generate (default: 5)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const count = parseInt(searchParams.get('count') || '5', 10);
  
  try {
    // In a real implementation, we would call an AI service or TikTok API
    // For now, we'll generate ideas based on templates
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate the requested number of ideas
    const ideas: TikTokContentIdea[] = Array(count)
      .fill(null)
      .map(() => generateContentIdea(category || undefined));
    
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error generating TikTok content ideas:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate TikTok content ideas' },
      { status: 500 }
    );
  }
} 