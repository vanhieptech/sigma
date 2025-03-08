import { NextRequest, NextResponse } from 'next/server';
import { extractFacebookPostId, getPageAccessTokenForPost, fetchCommentsAsPage } from '@/lib/crawlers/facebook-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postUrl, userAccessToken } = body;
    
    if (!postUrl || !userAccessToken) {
      return NextResponse.json(
        { error: 'Post URL and User Access Token are required' },
        { status: 400 }
      );
    }
    
    // Extract the post ID from the URL
    const postId = extractFacebookPostId(postUrl);
    if (!postId) {
      return NextResponse.json(
        { error: 'Invalid Facebook post URL' },
        { status: 400 }
      );
    }
    
    try {
      // Try to get the page access token
      const pageAccessToken = await getPageAccessTokenForPost(postId, userAccessToken);
      
      if (!pageAccessToken) {
        return NextResponse.json(
          { 
            error: 'Could not get page access token. Make sure you have admin access to the page.' 
          },
          { status: 400 }
        );
      }
      
      // Fetch comments using the page access token
      // Our updated fetchCommentsAsPage function will handle New Pages Experience pages
      const result = await fetchCommentsAsPage(postId, pageAccessToken);
      
      return NextResponse.json({
        comments: result.comments,
        nextCursor: result.nextCursor,
        pageAccessToken: result.pageAccessToken
      });
    } catch (error: any) {
      // Log the specific error for debugging
      console.error('Error fetching Facebook page comments:', error);
      
      // If this is a New Pages Experience error, provide a more specific message
      if (error.message?.includes('New Pages experience')) {
        return NextResponse.json(
          { 
            error: 'This Page uses the New Pages Experience which has some API limitations. ' +
                  'We\'ve tried to handle this automatically. Please try again or use a different access token.' 
          },
          { status: 400 }
        );
      }
      
      // Handle other specific error cases
      if (error.message?.includes('OAuthException')) {
        return NextResponse.json(
          { error: 'Authentication error. Your access token may be invalid or expired.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `Error: ${error.message || 'Unknown error'}` },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 