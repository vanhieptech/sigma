import { NextRequest, NextResponse } from 'next/server';
import { getFacebookCrawler } from '@/lib/crawlers/facebook-crawler';
import { FacebookCrawlOptions } from '@/types/crawler';

// Start a new crawl job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, options } = body;
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token is required' },
        { status: 400 }
      );
    }
    
    if (!options?.postUrl) {
      return NextResponse.json(
        { success: false, error: 'Post URL is required' },
        { status: 400 }
      );
    }
    
    // Get the Facebook crawler
    const crawler = getFacebookCrawler();
    
    // Start a new crawl job
    const jobId = await crawler.startCrawlJob(
      'user123', // Replace with actual user ID from auth
      options as FacebookCrawlOptions,
      accessToken
    );
    
    return NextResponse.json({
      success: true,
      jobId
    });
    
  } catch (error: any) {
    console.error('Error starting crawl job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to start crawl job' },
      { status: 500 }
    );
  }
} 