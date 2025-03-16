/**
 * TikTok API integration utility
 *
 * This file contains utilities for connecting to the TikTok API
 * Replace the placeholder values with your actual API credentials once approved
 */

// API Configuration - will be replaced with actual values from TikTok Developer Portal
const TIKTOK_CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '';
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI || '';

// API Endpoints
const API_BASE_URL = 'https://open.tiktokapis.com/v2';
const AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/';

/**
 * Generate TikTok authorization URL
 */
export function getTikTokAuthUrl(state: string = ''): string {
  const params = new URLSearchParams({
    client_key: TIKTOK_CLIENT_KEY,
    redirect_uri: REDIRECT_URI,
    scope: 'user.info.basic,video.list,video.upload,comment.list,comment.create',
    response_type: 'code',
    state,
  });

  return `${AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/oauth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
}

/**
 * Get user info
 */
export async function getUserInfo(accessToken: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/info/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
}

/**
 * Get user videos
 */
export async function getUserVideos(
  accessToken: string,
  cursor: string = '',
  limit: number = 10
): Promise<any> {
  try {
    const params = new URLSearchParams({
      cursor,
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/video/list/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user videos: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user videos:', error);
    throw error;
  }
}

/**
 * Get video comments
 */
export async function getVideoComments(
  accessToken: string,
  videoId: string,
  cursor: string = '',
  limit: number = 20
): Promise<any> {
  try {
    const params = new URLSearchParams({
      video_id: videoId,
      cursor,
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/comment/list/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get video comments: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting video comments:', error);
    throw error;
  }
}

/**
 * Post a comment
 */
export async function postComment(
  accessToken: string,
  videoId: string,
  text: string
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/comment/create/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_id: videoId,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post comment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
}

// Additional API functions will be added as needed once the application is approved
