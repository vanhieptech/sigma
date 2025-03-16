import { v4 as uuidv4 } from 'uuid';
import {
  CrawlJob,
  FacebookCrawlOptions,
  SocialMediaComment,
  SocialMediaPost,
  EngagementAnalysis,
} from '@/types/crawler';
import {
  exchangeFacebookAuthCode,
  extractFacebookPostId,
  fetchFacebookComments,
  fetchFacebookPost,
  sleep,
} from './facebook-api';

// Class to manage Facebook crawl jobs
export class FacebookCrawler {
  private jobs: Map<string, CrawlJob> = new Map();
  private results: Map<
    string,
    {
      post?: SocialMediaPost;
      comments: SocialMediaComment[];
      analysis?: EngagementAnalysis;
    }
  > = new Map();

  // Start a new crawl job
  async startCrawlJob(
    userId: string,
    options: FacebookCrawlOptions,
    accessToken: string
  ): Promise<string> {
    // Extract post ID from URL
    const postId = extractFacebookPostId(options.postUrl);
    if (!postId) {
      throw new Error('Invalid Facebook post URL');
    }

    // Create a new job ID
    const jobId = uuidv4();

    // Create and store the job
    const job: CrawlJob = {
      id: jobId,
      userId,
      platform: 'facebook',
      targetUrl: options.postUrl,
      status: 'pending',
      startTime: new Date(),
      stats: {
        commentsCollected: 0,
        uniqueUsers: 0,
        hashtagsFound: 0,
      },
    };

    this.jobs.set(jobId, job);
    this.results.set(jobId, { comments: [] });

    // Start processing the job asynchronously
    this.processCrawlJob(jobId, postId, options, accessToken).catch(error => {
      console.error(`Error processing job ${jobId}:`, error);
      const failedJob = this.jobs.get(jobId);
      if (failedJob) {
        failedJob.status = 'failed';
        failedJob.error = error.message;
        failedJob.endTime = new Date();
        this.jobs.set(jobId, failedJob);
      }
    });

    return jobId;
  }

  // Get job status
  getJob(jobId: string): CrawlJob | null {
    return this.jobs.get(jobId) || null;
  }

  // Get job results
  getJobResults(jobId: string): {
    post?: SocialMediaPost;
    comments: SocialMediaComment[];
    analysis?: EngagementAnalysis;
  } | null {
    return this.results.get(jobId) || null;
  }

  // Process the crawl job
  private async processCrawlJob(
    jobId: string,
    postId: string,
    options: FacebookCrawlOptions,
    accessToken: string
  ): Promise<void> {
    try {
      // Update job status
      const job = this.jobs.get(jobId);
      if (!job) return;

      job.status = 'processing';
      this.jobs.set(jobId, job);

      // Get post data
      console.log(`Fetching post data for ${postId}...`);
      const post = await fetchFacebookPost(postId, accessToken);
      this.results.get(jobId)!.post = post;

      // Initialize comment collection
      let hasMore = true;
      let cursor: string | undefined;
      const allComments: SocialMediaComment[] = [];
      const processedIds = new Set<string>();

      // Estimate total comments for progress tracking
      const estimatedTotal = post.metrics.comments;
      job.stats.totalExpectedComments = estimatedTotal;
      this.jobs.set(jobId, job);

      console.log(`Starting to fetch comments. Estimated total: ${estimatedTotal}`);

      // Fetch comments in batches with error handling and retries
      let retryCount = 0;
      const MAX_RETRIES = 5;

      while (hasMore && (!options.maxComments || allComments.length < options.maxComments)) {
        try {
          const batchSize = options.maxComments
            ? Math.min(100, options.maxComments - allComments.length)
            : 100;

          console.log(
            `Fetching batch of comments. Current count: ${allComments.length}, Batch size: ${batchSize}`
          );

          const result = await fetchFacebookComments(
            postId,
            accessToken,
            options.includeReplies,
            batchSize,
            cursor
          );

          // Reset retry count on successful fetch
          retryCount = 0;

          // Filter out duplicates
          const newComments = result.comments.filter(comment => !processedIds.has(comment.id));
          newComments.forEach(comment => processedIds.add(comment.id));

          if (newComments.length === 0 && result.hasNext) {
            // If we got no new comments but there are supposedly more,
            // move to the next page anyway
            cursor = result.nextCursor;
            continue;
          }

          allComments.push(...newComments);

          // Update cursor for next page
          hasMore = result.hasNext;
          cursor = result.nextCursor;

          // Update job stats
          job.stats.commentsCollected = allComments.length;
          job.stats.uniqueUsers = new Set(allComments.map(c => c.authorId)).size;

          // Count hashtags
          const allHashtags = allComments.flatMap(comment => comment.hashtags || []);
          job.stats.hashtagsFound = allHashtags.length;

          this.jobs.set(jobId, job);

          // Store interim results
          this.results.get(jobId)!.comments = allComments;

          // Generate interim analysis
          if (allComments.length > 0 && allComments.length % 500 === 0) {
            const analysis = this.generateAnalysis(allComments, post);
            this.results.get(jobId)!.analysis = analysis;
          }

          // Add delay between batches to avoid rate limits
          await sleep(1000);

          // Log progress
          const progress = Math.min(100, Math.round((allComments.length / estimatedTotal) * 100));
          console.log(`Progress: ${progress}% (${allComments.length}/${estimatedTotal})`);
        } catch (error) {
          console.error(`Error fetching comments batch:`, error);

          // Retry logic for recoverable errors
          retryCount++;

          if (retryCount <= MAX_RETRIES) {
            const backoffTime = Math.min(30000, 1000 * Math.pow(2, retryCount));
            console.log(`Retry ${retryCount}/${MAX_RETRIES} in ${backoffTime / 1000} seconds...`);
            await sleep(backoffTime);
            continue;
          } else {
            // Too many retries, but we'll save what we have so far
            console.log(
              `Max retries reached. Saving ${allComments.length} comments collected so far.`
            );
            hasMore = false;
          }
        }
      }

      // Generate final analysis
      console.log(`Generating analysis for ${allComments.length} comments...`);
      const analysis = this.generateAnalysis(allComments, post);
      this.results.get(jobId)!.analysis = analysis;

      // Mark job as completed
      job.status = 'completed';
      job.endTime = new Date();
      this.jobs.set(jobId, job);

      console.log(`Job ${jobId} completed. Collected ${allComments.length} comments.`);
    } catch (error) {
      console.error(`Error processing job ${jobId}:`, error);
      const failedJob = this.jobs.get(jobId);
      if (failedJob) {
        failedJob.status = 'failed';
        failedJob.error = error.message;
        failedJob.endTime = new Date();
        this.jobs.set(jobId, failedJob);
      }
    }
  }

  // Generate analysis from comments
  private generateAnalysis(
    comments: SocialMediaComment[],
    post?: SocialMediaPost
  ): EngagementAnalysis {
    // Count comments by author
    const commentsByAuthor = new Map<
      string,
      {
        authorId: string;
        authorName: string;
        commentCount: number;
        totalLikes: number;
      }
    >();

    for (const comment of comments) {
      const authorData = commentsByAuthor.get(comment.authorId) || {
        authorId: comment.authorId,
        authorName: comment.authorName,
        commentCount: 0,
        totalLikes: 0,
      };

      authorData.commentCount++;
      authorData.totalLikes += comment.metrics.likes;

      commentsByAuthor.set(comment.authorId, authorData);
    }

    // Find top influencers
    const topInfluencers = Array.from(commentsByAuthor.values())
      .sort((a, b) => {
        // Sort by comment count first, then by likes
        if (b.commentCount !== a.commentCount) {
          return b.commentCount - a.commentCount;
        }
        return b.totalLikes - a.totalLikes;
      })
      .slice(0, 10);

    // Count hashtags
    const hashtagCounts = new Map<string, number>();
    for (const comment of comments) {
      for (const hashtag of comment.hashtags || []) {
        hashtagCounts.set(hashtag, (hashtagCounts.get(hashtag) || 0) + 1);
      }
    }

    // Get top hashtags
    const hashtagAnalysis = Array.from(hashtagCounts.entries())
      .map(([hashtag, count]) => ({ hashtag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Create activity timeline
    const commentsByDay = new Map<string, number>();
    for (const comment of comments) {
      const day = comment.publishedAt.toISOString().split('T')[0];
      commentsByDay.set(day, (commentsByDay.get(day) || 0) + 1);
    }

    const activityTimeline = Array.from(commentsByDay.entries())
      .map(([day, count]) => ({
        date: new Date(day),
        commentCount: count,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate engagement rate
    let engagementRate = 0;
    if (post && post.metrics.comments > 0) {
      engagementRate =
        (post.metrics.likes + post.metrics.comments + post.metrics.shares) / post.metrics.comments;
    }

    // Placeholder for sentiment analysis (would need NLP processing)
    const sentimentBreakdown = {
      positive: Math.floor(comments.length * 0.6), // Dummy values
      neutral: Math.floor(comments.length * 0.3), // In a real implementation, these would
      negative: Math.floor(comments.length * 0.1), // be calculated using NLP analysis
    };

    return {
      engagementRate,
      topInfluencers,
      sentimentBreakdown,
      hashtagAnalysis,
      activityTimeline,
    };
  }
}

// Singleton instance
let facebookCrawlerInstance: FacebookCrawler | null = null;

// Get the Facebook crawler instance
export function getFacebookCrawler(): FacebookCrawler {
  if (!facebookCrawlerInstance) {
    facebookCrawlerInstance = new FacebookCrawler();
  }
  return facebookCrawlerInstance;
}
