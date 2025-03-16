import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/tiktok-api';

/**
 * Handler for TikTok API OAuth callback
 * This endpoint processes the callback from TikTok after user authorizes the application
 */
export async function GET(request: NextRequest) {
  // Get authorization code from URL parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle error cases
  if (error) {
    console.error('TikTok authorization error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth/error?error=${error}&description=${errorDescription}`, request.url)
    );
  }

  // Validate required parameters
  if (!code) {
    console.error('No authorization code received from TikTok');
    return NextResponse.redirect(new URL('/auth/error?error=no_code', request.url));
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code);

    // Store token in secure cookie or session (this is just a placeholder)
    // In a real app, you'd securely store the token, perhaps encrypted in a database
    const responseUrl = new URL('/auth/success', request.url);

    // For demo purposes only - in production, do not pass tokens in URL
    if (process.env.NODE_ENV === 'development') {
      responseUrl.searchParams.set('access_token', tokenResponse.access_token);
      responseUrl.searchParams.set('refresh_token', tokenResponse.refresh_token);
      responseUrl.searchParams.set('expires_in', tokenResponse.expires_in);
    }

    // If state parameter was passed, return it (for CSRF protection)
    if (state) {
      responseUrl.searchParams.set('state', state);
    }

    return NextResponse.redirect(responseUrl);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.redirect(new URL('/auth/error?error=token_exchange_failed', request.url));
  }
}
