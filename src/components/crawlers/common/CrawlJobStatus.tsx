'use client';

import { useEffect, useState } from 'react';
import { CrawlJob } from '@/types/crawler';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';

interface CrawlJobStatusProps {
  jobId: string;
  platform: 'facebook' | 'tiktok' | 'twitter' | 'linkedin';
  onComplete?: () => void;
}

export function CrawlJobStatus({ jobId, platform, onComplete }: CrawlJobStatusProps) {
  const [job, setJob] = useState<CrawlJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJobStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crawlers/${platform}/jobs/${jobId}`);
      const data = await response.json();

      if (data.success) {
        setJob(data.job);
        if (data.job.status === 'completed' && onComplete) {
          onComplete();
        }
      } else {
        setError(data.error || 'Failed to fetch job status');
      }
    } catch (err) {
      setError('An error occurred while fetching the job status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchJobStatus();

    // Set up polling for status updates
    const intervalId = setInterval(() => {
      if (job?.status !== 'completed' && job?.status !== 'failed') {
        fetchJobStatus();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [jobId, platform, job?.status]);

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!job || loading) {
    return (
      <div className="my-4 p-4 border rounded-md animate-pulse">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <div className="h-4 bg-slate-200 rounded w-full"></div>
        </div>
        <div className="mt-2 h-2 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (job.status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (job.status) {
      case 'completed':
        return 'Crawl job completed successfully';
      case 'failed':
        return `Crawl job failed: ${job.error || 'Unknown error'}`;
      case 'pending':
        return 'Crawl job is pending...';
      case 'processing':
        return 'Processing comments...';
      default:
        return 'Unknown status';
    }
  };

  // Calculate progress for processing status
  const getProgress = () => {
    if (job.status === 'completed') return 100;
    if (job.status === 'pending') return 0;
    // For processing, show progress based on comments collected (if we have that info)
    return Math.min(Math.max((job.stats.commentsCollected / 100) * 100, 5), 95);
  };

  return (
    <div className="my-4 p-4 border rounded-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        <span className="text-sm text-gray-500">Job ID: {job.id.substring(0, 8)}...</span>
      </div>

      <Progress value={getProgress()} className="h-2 my-2" />

      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        <div>
          <div className="text-gray-500">Comments</div>
          <div className="font-semibold">{job.stats.commentsCollected}</div>
        </div>
        <div>
          <div className="text-gray-500">Unique Users</div>
          <div className="font-semibold">{job.stats.uniqueUsers}</div>
        </div>
        <div>
          <div className="text-gray-500">Hashtags</div>
          <div className="font-semibold">{job.stats.hashtagsFound}</div>
        </div>
      </div>

      {job.status === 'failed' && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{job.error || 'Unknown error occurred'}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
