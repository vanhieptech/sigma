import { NextRequest, NextResponse } from 'next/server';
import { getFacebookCrawler } from '@/lib/crawlers/facebook-crawler';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    // Get job status
    const crawler = getFacebookCrawler();
    const jobStatus = crawler.getJobStatus(jobId);

    if (!jobStatus) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: jobStatus });
  } catch (error) {
    console.error('Error getting job status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get job status' },
      { status: 500 }
    );
  }
}
