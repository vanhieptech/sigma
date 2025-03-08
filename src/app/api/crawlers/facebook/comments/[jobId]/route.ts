import { NextRequest, NextResponse } from 'next/server';
import { getFacebookCrawler } from '@/lib/crawlers/facebook-crawler';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId;
    
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Get comments for the job
    const crawler = getFacebookCrawler();
    const jobResults = crawler.getJobResults(jobId);
    
    if (!jobResults) {
      return NextResponse.json(
        { success: false, error: 'Job results not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      post: jobResults.post,
      comments: jobResults.comments,
      analysis: jobResults.analysis,
      total: jobResults.comments.length
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get comments' },
      { status: 500 }
    );
  }
} 