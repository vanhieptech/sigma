import { NextRequest, NextResponse } from 'next/server';
import { getFacebookCrawler } from '@/lib/crawlers/facebook-crawler';

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const jobId = params.jobId;

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    const crawler = getFacebookCrawler();
    const job = crawler.getJob(jobId);

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    // Calculate progress percentage
    const total = job.stats.totalExpectedComments || 0;
    const current = job.stats.commentsCollected || 0;
    const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

    return NextResponse.json({
      success: true,
      status: job.status,
      total,
      current,
      percentage,
      uniqueUsers: job.stats.uniqueUsers,
      hashtagsFound: job.stats.hashtagsFound,
      error: job.error,
    });
  } catch (error: any) {
    console.error('Error getting job progress:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get job progress' },
      { status: 500 }
    );
  }
}
