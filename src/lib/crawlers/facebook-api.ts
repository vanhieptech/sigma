import { SocialMediaComment, SocialMediaPost } from '@/types/crawler';

// Facebook Graph API constants
const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS_PER_WINDOW: 200,
  WINDOW_MS: 3600000, // 1 hour
  DELAY_BETWEEN_REQUESTS: 1000, // 1 second
};

// Batch size for comment fetching
const BATCH_SIZE = 100;

// Rate limiting state
let requestCount = 0;
let windowStart = Date.now();

// Facebook API types
export interface FacebookPostResponse {
  id: string;
  message?: string;
  created_time: string;
  from: {
    id: string;
    name: string;
  };
  likes?: {
    data: Array<{ id: string; name: string }>;
    paging?: {
      cursors: {
        before: string;
        after: string;
      };
      next?: string;
    };
    summary?: {
      total_count: number;
    };
  };
  shares?: {
    count: number;
  };
  comments?: {
    data: FacebookCommentResponse[];
    paging?: {
      cursors: {
        before: string;
        after: string;
      };
      next?: string;
    };
    summary?: {
      total_count: number;
    };
  };
}

export interface FacebookCommentResponse {
  id: string;
  message: string;
  created_time: string;
  from: {
    id: string;
    name: string;
  };
  like_count: number;
  comment_count: number;
  parent?: {
    id: string;
  };
}

// Extract Facebook post ID from URL
export function extractFacebookPostId(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    // Handle different Facebook URL formats
    if (urlObj.hostname.includes('facebook.com') || urlObj.hostname.includes('fb.com')) {
      // Format: facebook.com/permalink.php?story_fbid=123&id=456
      const storyFbId = urlObj.searchParams.get('story_fbid');
      const id = urlObj.searchParams.get('id');
      if (storyFbId && id) {
        return `${id}_${storyFbId}`;
      }

      // Format: facebook.com/groups/groupId/posts/postId
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 3 && pathParts[0] === 'groups' && pathParts[2] === 'posts') {
        return `${pathParts[1]}_${pathParts[3]}`;
      }

      // Format: facebook.com/username/posts/postId
      if (pathParts.length >= 3 && pathParts[1] === 'posts') {
        return pathParts[2];
      }

      // Format: facebook.com/photo.php?fbid=123
      const fbid = urlObj.searchParams.get('fbid');
      if (fbid) {
        return fbid;
      }

      // Format: facebook.com/photo/?fbid=123
      if (pathParts[0] === 'photo' && fbid) {
        return fbid;
      }
    }
  } catch (error) {
    console.error('Error parsing Facebook URL:', error);
  }

  return null;
}

// Sleep utility
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiter utility
async function checkRateLimit() {
  const now = Date.now();
  if (now - windowStart > RATE_LIMIT.WINDOW_MS) {
    // Reset window
    requestCount = 0;
    windowStart = now;
  }

  if (requestCount >= RATE_LIMIT.MAX_REQUESTS_PER_WINDOW) {
    // Wait until the current window expires
    const waitTime = RATE_LIMIT.WINDOW_MS - (now - windowStart);
    console.log(`Rate limit reached. Waiting for ${waitTime / 1000} seconds...`);
    await sleep(waitTime);
    requestCount = 0;
    windowStart = Date.now();
  }

  await sleep(RATE_LIMIT.DELAY_BETWEEN_REQUESTS);
  requestCount++;
}

// Fetch Facebook post data
export async function fetchFacebookPost(
  postId: string,
  accessToken: string
): Promise<SocialMediaPost> {
  await checkRateLimit();

  console.log(`Fetching post data for ${postId}...`);

  try {
    // First, try to fetch the post using the /{post-id} endpoint
    const response = await fetch(
      `${GRAPH_API_BASE_URL}/${postId}?fields=id,message,created_time,from,likes.summary(true),shares,comments.summary(true)&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();

      // If we get the deprecated API error, try an alternative approach
      if (errorData.error && errorData.error.code === 12) {
        console.log('Singular statuses API is deprecated, trying alternative approach...');

        // Check if the post ID contains a page ID (format: {page-id}_{post-id})
        const parts = postId.split('_');
        if (parts.length === 2) {
          const pageId = parts[0];

          // Try to fetch from the page feed instead
          const feedResponse = await fetch(
            `${GRAPH_API_BASE_URL}/${pageId}/feed?fields=id,message,created_time,from,likes.summary(true),shares,comments.summary(true)&access_token=${accessToken}`
          );

          if (!feedResponse.ok) {
            const feedError = await feedResponse.json();
            throw new Error(`Facebook API error: ${JSON.stringify(feedError)}`);
          }

          const feedData = await feedResponse.json();

          // Find the post in the feed
          const post = feedData.data.find((p: any) => p.id === postId);
          if (post) {
            return mapPostResponseToSocialMediaPost(post);
          }
        }

        // If we couldn't find the post in the feed, try one more approach
        // Try to fetch using the /{user-id}/posts endpoint
        const userPostsResponse = await fetch(
          `${GRAPH_API_BASE_URL}/me/posts?fields=id,message,created_time,from,likes.summary(true),shares,comments.summary(true)&access_token=${accessToken}`
        );

        if (!userPostsResponse.ok) {
          const userPostsError = await userPostsResponse.json();
          throw new Error(`Facebook API error: ${JSON.stringify(userPostsError)}`);
        }

        const userPostsData = await userPostsResponse.json();

        // Find the post in the user's posts
        const userPost = userPostsData.data.find((p: any) => p.id === postId);
        if (userPost) {
          return mapPostResponseToSocialMediaPost(userPost);
        }

        // If we still couldn't find the post, throw an error
        throw new Error(`Could not find post with ID ${postId}`);
      }

      // For other errors, just throw them
      throw new Error(`Facebook API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return mapPostResponseToSocialMediaPost(data);
  } catch (error) {
    console.error('Error fetching Facebook post:', error);
    throw error;
  }
}

// Helper function to map API response to our data model
function mapPostResponseToSocialMediaPost(data: FacebookPostResponse): SocialMediaPost {
  return {
    id: data.id,
    platform: 'facebook',
    originalUrl: `https://www.facebook.com/${data.id}`,
    content: data.message || '',
    authorName: data.from?.name || 'Unknown',
    authorId: data.from?.id || 'unknown',
    publishedAt: new Date(data.created_time),
    crawledAt: new Date(),
    metrics: {
      likes: data.likes?.summary?.total_count || 0,
      shares: data.shares?.count || 0,
      comments: data.comments?.summary?.total_count || 0,
    },
  };
}

// Enhanced comment fetching with batching and rate limiting
export async function fetchFacebookComments(
  postId: string,
  accessToken: string,
  includeReplies: boolean = true,
  limit: number = BATCH_SIZE,
  after?: string
): Promise<{
  comments: SocialMediaComment[];
  hasNext: boolean;
  nextCursor?: string;
}> {
  await checkRateLimit();

  const fields = 'id,message,created_time,from,like_count,comment_count,parent';
  let url = `${GRAPH_API_BASE_URL}/${postId}/comments?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

  if (after) {
    url += `&after=${after}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      if (error.error?.code === 4 || error.error?.code === 17) {
        // Rate limit hit, wait and retry
        console.log('Rate limit hit, waiting and retrying...');
        await sleep(RATE_LIMIT.DELAY_BETWEEN_REQUESTS * 5);
        return fetchFacebookComments(postId, accessToken, includeReplies, limit, after);
      }
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const comments: SocialMediaComment[] = [];

    // Process comments with error handling
    for (const comment of data.data || []) {
      try {
        const hashtags = extractHashtags(comment.message || '');
        const mentions = extractMentions(comment.message || '');

        comments.push({
          id: comment.id,
          postId,
          platform: 'facebook',
          content: comment.message || '',
          authorName: comment.from?.name || 'Unknown',
          authorId: comment.from?.id || 'unknown',
          publishedAt: new Date(comment.created_time),
          parentCommentId: comment.parent?.id,
          metrics: {
            likes: comment.like_count || 0,
            replies: comment.comment_count || 0,
          },
          hashtags,
          mentions,
        });

        // Fetch replies if needed
        if (includeReplies && comment.comment_count > 0) {
          try {
            const replies = await fetchFacebookCommentReplies(comment.id, accessToken);
            comments.push(...replies);
          } catch (error) {
            console.error(`Error fetching replies for comment ${comment.id}:`, error);
            // Continue with other comments even if replies fail
          }
        }
      } catch (error) {
        console.error(`Error processing comment ${comment.id}:`, error);
        // Continue with other comments
      }
    }

    return {
      comments,
      hasNext: !!data.paging?.next,
      nextCursor: data.paging?.cursors?.after,
    };
  } catch (error: any) {
    console.error('Error fetching Facebook comments:', error);
    // Implement exponential backoff for network errors
    if (error.message.includes('network') || error.message.includes('timeout')) {
      const backoffTime = Math.min(
        30000,
        RATE_LIMIT.DELAY_BETWEEN_REQUESTS * Math.pow(2, Math.floor(Math.random() * 5))
      );
      console.log(`Network error, retrying in ${backoffTime / 1000} seconds...`);
      await sleep(backoffTime);
      return fetchFacebookComments(postId, accessToken, includeReplies, limit, after);
    }
    throw error;
  }
}

// Fetch replies to a comment
async function fetchFacebookCommentReplies(
  commentId: string,
  accessToken: string
): Promise<SocialMediaComment[]> {
  await checkRateLimit();

  const fields = 'id,message,created_time,from,like_count,comment_count,parent';
  const url = `${GRAPH_API_BASE_URL}/${commentId}/comments?fields=${fields}&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      if (error.error?.code === 4 || error.error?.code === 17) {
        // Rate limit hit, wait and retry
        await sleep(RATE_LIMIT.DELAY_BETWEEN_REQUESTS * 5);
        return fetchFacebookCommentReplies(commentId, accessToken);
      }
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const replies: SocialMediaComment[] = [];

    for (const reply of data.data || []) {
      try {
        const hashtags = extractHashtags(reply.message || '');
        const mentions = extractMentions(reply.message || '');

        replies.push({
          id: reply.id,
          postId: commentId.split('_')[0], // Extract original post ID
          platform: 'facebook',
          content: reply.message || '',
          authorName: reply.from?.name || 'Unknown',
          authorId: reply.from?.id || 'unknown',
          publishedAt: new Date(reply.created_time),
          parentCommentId: commentId,
          metrics: {
            likes: reply.like_count || 0,
            replies: reply.comment_count || 0,
          },
          hashtags,
          mentions,
        });
      } catch (error) {
        console.error(`Error processing reply ${reply.id}:`, error);
        // Continue with other replies
      }
    }

    return replies;
  } catch (error: any) {
    console.error('Error fetching Facebook comment replies:', error);
    // Implement exponential backoff for network errors
    if (error.message.includes('network') || error.message.includes('timeout')) {
      const backoffTime = Math.min(
        30000,
        RATE_LIMIT.DELAY_BETWEEN_REQUESTS * Math.pow(2, Math.floor(Math.random() * 5))
      );
      await sleep(backoffTime);
      return fetchFacebookCommentReplies(commentId, accessToken);
    }
    throw error;
  }
}

// Extract hashtags from text
function extractHashtags(text: string): string[] {
  if (!text) return [];
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
}

// Extract mentions from text
function extractMentions(text: string): string[] {
  if (!text) return [];
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1)) : [];
}

// Facebook Authentication Utilities
export async function getFacebookLoginUrl(): Promise<string> {
  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;
  const scope = 'pages_read_engagement';

  if (!appId || !redirectUri) {
    throw new Error('Facebook App ID or Redirect URI not configured');
  }

  return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
}

export async function exchangeFacebookAuthCode(code: string): Promise<string> {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    throw new Error('Facebook App credentials not configured');
  }

  const response = await fetch(
    `${GRAPH_API_BASE_URL}/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Facebook auth error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Get user's Facebook pages and their access tokens
export async function getUserPages(userAccessToken: string): Promise<
  Array<{
    id: string;
    name: string;
    access_token: string;
    category: string;
  }>
> {
  await checkRateLimit();

  try {
    const response = await fetch(
      `${GRAPH_API_BASE_URL}/me/accounts?access_token=${userAccessToken}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user pages:', error);
    throw error;
  }
}

/**
 * Fetches comments from a Facebook page post using methods compatible with the New Pages Experience
 * This is an alternative implementation that handles Pages migrated to the new architecture
 */
export async function fetchCommentsForNewPagesExperience(
  postId: string,
  accessToken: string,
  cursor?: string
): Promise<{ comments: any[]; nextCursor?: string }> {
  try {
    // For New Pages Experience, we need to use a different approach
    // Instead of directly accessing post comments, we fetch the post first to ensure it exists
    const postEndpoint = `https://graph.facebook.com/v18.0/${postId}?access_token=${accessToken}`;
    const postResponse = await fetch(postEndpoint);
    const postData = await postResponse.json();

    if (postData.error) {
      console.error('Error fetching post:', postData.error);
      throw new Error(`Error fetching post: ${postData.error.message}`);
    }

    // Use the /comments edge with the appropriate fields
    let commentsEndpoint = `https://graph.facebook.com/v18.0/${postId}/comments?access_token=${accessToken}`;
    commentsEndpoint +=
      '&fields=id,message,created_time,from,attachment,comment_count,like_count,parent';
    commentsEndpoint += '&limit=25'; // Adjust as needed

    if (cursor) {
      commentsEndpoint += `&after=${cursor}`;
    }

    const commentsResponse = await fetch(commentsEndpoint);
    const commentsData = await commentsResponse.json();

    if (commentsData.error) {
      // Special handling for New Pages Experience error
      if (commentsData.error.error_subcode === 2069030) {
        throw new Error(
          'This Page uses the New Pages Experience which has limited API access. Try using a User Access Token with page_read_engagement permission instead.'
        );
      }

      throw new Error(`Error fetching comments: ${commentsData.error.message}`);
    }

    return {
      comments: commentsData.data || [],
      nextCursor: commentsData.paging?.cursors?.after,
    };
  } catch (error) {
    console.error('Error in fetchCommentsForNewPagesExperience:', error);
    throw error;
  }
}

/**
 * Modified fetchCommentsAsPage function that tries both regular and New Pages Experience methods
 */
export async function fetchCommentsAsPage(
  postId: string,
  pageAccessToken: string,
  cursor?: string
): Promise<{ comments: SocialMediaComment[]; nextCursor?: string; pageAccessToken: string }> {
  try {
    // First try the regular method
    try {
      const endpoint = `https://graph.facebook.com/v18.0/${postId}/comments?access_token=${pageAccessToken}`;
      const response = await fetch(
        endpoint +
          '&fields=id,message,created_time,from,attachment,comment_count,like_count,parent&limit=25' +
          (cursor ? `&after=${cursor}` : '')
      );
      const data = await response.json();

      if (!data.error) {
        // If successful, map and return the comments
        const comments = (data.data || []).map((comment: any) =>
          mapCommentResponseToSocialMediaComment(comment, postId)
        );
        return {
          comments,
          nextCursor: data.paging?.cursors?.after,
          pageAccessToken,
        };
      }

      // If we got an error about New Pages Experience, fall back to the alternative method
      if (data.error?.error_subcode === 2069030) {
        throw new Error('New Pages Experience detected');
      }

      // For other errors, throw them
      throw new Error(data.error?.message || 'Unknown error');
    } catch (error: any) {
      // If the error is about New Pages Experience, try the alternative method
      if (error.message === 'New Pages Experience detected') {
        console.log('Falling back to New Pages Experience compatible method');
        const result = await fetchCommentsForNewPagesExperience(postId, pageAccessToken, cursor);
        return {
          comments: result.comments.map(comment =>
            mapCommentResponseToSocialMediaComment(comment, postId)
          ),
          nextCursor: result.nextCursor,
          pageAccessToken,
        };
      }

      // Otherwise, re-throw the error
      throw error;
    }
  } catch (error) {
    console.error('Error in fetchCommentsAsPage:', error);
    throw error;
  }
}

// Get page post access token for a specific post
export async function getPageAccessTokenForPost(
  postUrl: string,
  userAccessToken: string
): Promise<string | null> {
  try {
    // Extract the post ID
    const postId = extractFacebookPostId(postUrl);
    if (!postId) {
      throw new Error('Invalid Facebook post URL');
    }

    // If the post has page_id_post_id format, extract the page ID
    const pageId = postId.includes('_') ? postId.split('_')[0] : null;

    if (!pageId) {
      return null; // Not a page post
    }

    // Get all pages the user has access to
    const pages = await getUserPages(userAccessToken);

    // Find the page that matches the post's page ID
    const page = pages.find(p => p.id === pageId);

    return page ? page.access_token : null;
  } catch (error) {
    console.error('Error getting page access token for post:', error);
    return null;
  }
}

// Map Facebook comment response to SocialMediaComment
function mapCommentResponseToSocialMediaComment(
  comment: FacebookCommentResponse,
  postId: string
): SocialMediaComment {
  // Extract hashtags and mentions
  const hashtags: string[] = [];
  const mentions: string[] = [];

  if (comment.message) {
    // Extract hashtags (words starting with #)
    const hashtagMatches = comment.message.match(/#\w+/g);
    if (hashtagMatches) {
      hashtags.push(...hashtagMatches);
    }

    // Extract mentions (words starting with @)
    const mentionMatches = comment.message.match(/@\w+/g);
    if (mentionMatches) {
      mentions.push(...mentionMatches);
    }
  }

  return {
    id: comment.id,
    postId: postId,
    content: comment.message || '',
    authorName: comment.from?.name || 'Unknown User',
    authorId: comment.from?.id || 'unknown',
    publishedAt: new Date(comment.created_time),
    parentCommentId: comment.parent?.id,
    metrics: {
      likes: comment.like_count || 0,
      replies: comment.comment_count || 0,
    },
    hashtags,
    mentions,
    platform: 'facebook',
  };
}
