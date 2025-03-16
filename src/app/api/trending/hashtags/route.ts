import { NextRequest, NextResponse } from 'next/server';
import { getTrendingHashtags } from '@/lib/mock/tiktok-data';

/**
 * GET handler for TikTok trending hashtags
 *
 * Fetches trending hashtags, optionally filtered by category
 *
 * Query parameters:
 * - category: Category to filter hashtags by (optional)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  try {
    // In a real implementation, we would call the TikTok API or our own server
    // For now, we'll use mock data

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const allHashtags = getTrendingHashtags();

    // Filter by category if provided
    let hashtags = allHashtags;
    if (category && category !== 'all') {
      hashtags = allHashtags.filter(hashtag =>
        hashtag.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    return NextResponse.json(hashtags);
  } catch (error) {
    console.error('Error fetching TikTok trending hashtags:', error);

    return NextResponse.json(
      { error: 'Failed to fetch TikTok trending hashtags' },
      { status: 500 }
    );
  }
}
