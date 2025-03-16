import { NextRequest, NextResponse } from 'next/server';
import { getFacebookCrawler } from '@/lib/crawlers/facebook-crawler';

// API handler for getting results of a Facebook crawl job
export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params;

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    // Get the Facebook crawler instance
    const crawler = getFacebookCrawler();

    // Get the job status
    const job = crawler.getJob(jobId);

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    // Get the job results
    const results = crawler.getJobResults(jobId);

    return NextResponse.json({
      success: true,
      job,
      results,
    });
  } catch (error: any) {
    console.error('Error getting Facebook crawl results:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
