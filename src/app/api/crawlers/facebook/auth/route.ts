import { NextRequest, NextResponse } from 'next/server';
import { exchangeFacebookAuthCode, getFacebookLoginUrl } from '@/lib/crawlers/facebook-api';

export async function GET(request: NextRequest) {
  try {
    // Handle auth code callback
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (code) {
      // Exchange code for access token
      const accessToken = await exchangeFacebookAuthCode(code);

      // Return the access token (in a real app, you'd store this securely)
      return NextResponse.json({ success: true, accessToken });
    } else {
      // Generate login URL
      const loginUrl = await getFacebookLoginUrl();
      return NextResponse.json({ success: true, loginUrl });
    }
  } catch (error) {
    console.error('Facebook auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
