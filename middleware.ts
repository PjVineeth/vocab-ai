import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define allowed origins for frontend
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://27.111.72.61:4003',           // Your actual production URL
  'http://27.111.72.61.nip.io:4003',    // Alternative domain
  'https://27.111.72.61:4003',          // HTTPS version
  // Add your production domain here when deployed
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // Allow requests with no origin (like Postman)
  return ALLOWED_ORIGINS.includes(origin);
}

function middlewareHandler(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigin = isAllowedOrigin(origin) ? (origin || '*') : 'null';

    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Add CORS headers to all API responses
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  return NextResponse.next();
}

// Export both named and default for compatibility
export const middleware = middlewareHandler;
export default middlewareHandler;

export const config = {
  matcher: ['/api/:path*'],
}; 