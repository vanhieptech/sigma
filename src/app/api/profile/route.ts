import { NextRequest, NextResponse } from 'next/server';
import { getRandomUserProfile } from '@/lib/mock/tiktok-data';

/**
 * GET handler for TikTok user profiles
 * 
 * Fetches profile data for a specific TikTok username
 * 
 * Query parameters:
 * - username: TikTok username to fetch profile for
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  
  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }
  
  try {
    // In a real implementation, we would call the TikTok API or our own server
    // For now, we'll use mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Get mock profile and set the requested username
    const profile = getRandomUserProfile();
    profile.uniqueId = username;
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching TikTok user profile:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch TikTok user profile' },
      { status: 500 }
    );
  }
} 