import { NextRequest, NextResponse } from 'next/server';
import { getMockAnalytics } from '@/lib/mock/tiktok-data';

/**
 * GET handler for TikTok analytics
 * 
 * Fetches analytics data for a specific TikTok username
 * 
 * Query parameters:
 * - username: TikTok username to fetch analytics for
 * - days: Number of days to analyze (default: 30)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const days = parseInt(searchParams.get('days') || '30', 10);
  
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
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const analytics = getMockAnalytics(days);
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching TikTok analytics:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch TikTok analytics' },
      { status: 500 }
    );
  }
} 