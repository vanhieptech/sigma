import { NextResponse, NextRequest } from 'next/server';
import { initSocketIO } from './lib/socketio';

// This middleware will run for all routes
export function middleware(request: NextRequest) {
  // Only initialize Socket.IO for the socket API route
  if (request.nextUrl.pathname.startsWith('/api/socket')) {
    // Note: Next.js middleware can't directly initialize Socket.IO
    // The actual initialization happens in the socket route handler
    console.log('Socket.IO middleware triggered');
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware is applied to
export const config = {
  matcher: [
    '/api/socket/:path*',
  ],
} 