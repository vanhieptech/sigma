import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip middleware for Socket.IO and WebSocket requests
  if (
    request.url.includes('/api/socket/io') ||
    request.headers.get('upgrade')?.toLowerCase() === 'websocket'
  ) {
    return NextResponse.next()
  }

  // Add CORS headers for Socket.IO requests
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  
  return response
}

export const config = {
  matcher: '/api/:path*'
} 