import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RATE_LIMIT_CONFIG } from '@/lib/config';

// Simple in-memory rate limiting
// In production, use a more robust solution like Redis
const API_RATE_LIMIT = RATE_LIMIT_CONFIG.maxRequestsPerMinute;
const API_RATE_LIMIT_WINDOW = RATE_LIMIT_CONFIG.windowSizeMs;

interface RateLimitEntry {
  count: number;
  timestamp: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.timestamp > API_RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get client IP for rate limiting
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
  const rateLimitKey = `${ip}:${request.nextUrl.pathname}`;
  
  // Check if the client has exceeded the rate limit
  const now = Date.now();
  const entry = rateLimitMap.get(rateLimitKey) || { count: 0, timestamp: now };
  
  // Reset count if the window has passed
  if (now - entry.timestamp > API_RATE_LIMIT_WINDOW) {
    entry.count = 0;
    entry.timestamp = now;
  }
  
  // Increment the count
  entry.count++;
  rateLimitMap.set(rateLimitKey, entry);
  
  // If the client has exceeded the rate limit, return a 429 response
  if (entry.count > API_RATE_LIMIT) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests, please try again later' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(API_RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(entry.timestamp + API_RATE_LIMIT_WINDOW),
        },
      }
    );
  }
  
  // Add rate limit headers to the response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(API_RATE_LIMIT));
  response.headers.set('X-RateLimit-Remaining', String(API_RATE_LIMIT - entry.count));
  response.headers.set('X-RateLimit-Reset', String(entry.timestamp + API_RATE_LIMIT_WINDOW));
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
}; 