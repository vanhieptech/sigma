# TikTok API Integration Setup Guide

This guide will help you set up and configure TikTok API integration after your application is approved.

## Prerequisites

- Approved TikTok API application
- Client Key and Client Secret from TikTok Developer Portal
- Hosting environment for your application

## Step 1: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_TIKTOK_REDIRECT_URI=https://your-domain.com/api/auth/tiktok/callback
```

> ⚠️ Never commit your `.env.local` file to version control!

For production deployments, add these environment variables to your hosting platform (Vercel, Netlify, etc.)

## Step 2: Configure Redirect URLs in TikTok Developer Portal

1. Log in to the [TikTok Developer Portal](https://developers.tiktok.com/)
2. Go to your application settings
3. Add the following URLs to the "Redirect Domain" list:
   - `https://your-domain.com` (replace with your actual domain)
4. Add the following URL to the "Redirect URI" list:
   - `https://your-domain.com/api/auth/tiktok/callback`

## Step 3: Verify Integration Components

Ensure the following files exist and are properly configured:

1. `/src/lib/tiktok-api.ts` - TikTok API integration utility
2. `/src/app/api/auth/tiktok/callback/route.ts` - OAuth callback handler
3. `/src/app/terms-of-service/page.tsx` - Terms of Service page
4. `/src/app/privacy-policy/page.tsx` - Privacy Policy page

## Step 4: Deploy Your Application

Deploy your application to your production environment.

## Step 5: Test Authentication Flow

1. Create a "Connect TikTok" button in your application
2. Implement the `getTikTokAuthUrl()` function from `tiktok-api.ts`
3. Test the OAuth flow by clicking the Connect button
4. Verify that you can successfully authenticate with TikTok
5. Check that the callback handler correctly processes the authorization code

Example authentication button implementation:

```tsx
import { getTikTokAuthUrl } from '@/lib/tiktok-api';
import { Button } from '@/components/ui/button';

export function TikTokConnectButton() {
  const handleConnect = () => {
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2);

    // Store state in session storage for verification later
    sessionStorage.setItem('tiktok_auth_state', state);

    // Get and redirect to the TikTok authorization URL
    const authUrl = getTikTokAuthUrl(state);
    window.location.href = authUrl;
  };

  return (
    <Button onClick={handleConnect} className="bg-black hover:bg-gray-900 text-white">
      Connect TikTok Account
    </Button>
  );
}
```

## Step 6: Implement API Calls

Use the utility functions in `tiktok-api.ts` to implement API calls for your application features:

- `getUserInfo()` - Get basic information about the authenticated user
- `getUserVideos()` - Get the user's uploaded videos
- `getVideoComments()` - Get comments for a specific video
- `postComment()` - Post a comment on a video

Example API call:

```tsx
import { getUserInfo } from '@/lib/tiktok-api';
import { useState, useEffect } from 'react';

export function UserProfile({ accessToken }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const data = await getUserInfo(accessToken);
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data available</div>;

  return (
    <div>
      <h2>{userData.user.display_name}</h2>
      <p>Followers: {userData.user.follower_count}</p>
      <p>Following: {userData.user.following_count}</p>
      {/* Display more user information */}
    </div>
  );
}
```

## Step 7: Implement Token Refresh

TikTok access tokens expire, so you'll need to implement token refresh logic:

1. Store both access_token and refresh_token securely
2. Check token expiration before making API calls
3. Use the refresh token to get a new access token when needed

Example token refresh implementation:

```typescript
// Add this function to tiktok-api.ts

export async function refreshAccessToken(refreshToken: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/oauth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}
```

## Step 8: Handle Error Cases

Implement robust error handling for TikTok API calls:

1. Handle authentication errors (expired/invalid tokens)
2. Handle rate limiting errors
3. Handle permission errors (missing scopes)
4. Implement graceful fallbacks for API failures

## Step 9: Optimize for Production

1. Implement server-side fetching for better security
2. Cache API responses when appropriate
3. Implement proper loading states for API-dependent components
4. Add error boundaries around API-dependent components

## Step 10: Monitor and Maintain

1. Set up monitoring for API usage and errors
2. Keep track of TikTok API changes and updates
3. Regularly test the authentication flow and API calls
4. Update your application when TikTok makes changes to their API

## Additional Resources

- [TikTok Developer Portal Documentation](https://developers.tiktok.com/doc/login-kit-web)
- [TikTok API Reference](https://developers.tiktok.com/doc/tiktok-api-v2-reference-login-kit/)
- [TikTok Developer Terms](https://developers.tiktok.com/terms)
