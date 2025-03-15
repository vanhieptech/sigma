import { NextRequest, NextResponse } from 'next/server';
import { getTrendingSounds } from '@/lib/mock/tiktok-data';

/**
 * GET handler for TikTok trending sounds
 * 
 * Fetches trending sounds, optionally filtered by category
 * 
 * Query parameters:
 * - category: Category to filter sounds by (optional)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  
  try {
    // In a real implementation, we would call the TikTok API or our own server
    // For now, we'll use mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allSounds = getTrendingSounds();
    
    // Filter by category if provided (in a real implementation, we would have better filtering)
    let sounds = allSounds;
    if (category && category !== 'all') {
      // For mock data, just simulate category filtering
      sounds = allSounds.filter((_, index) => index % 2 === 0);
    }
    
    return NextResponse.json(sounds);
  } catch (error) {
    console.error('Error fetching TikTok trending sounds:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch TikTok trending sounds' },
      { status: 500 }
    );
  }
} 