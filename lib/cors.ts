import { NextRequest, NextResponse } from 'next/server';

export interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

// Define allowed origins for frontend
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://27.111.72.61:4003',           // Your actual production URL
  'http://27.111.72.61.nip.io:4003',    // Alternative domain
  'https://27.111.72.61:4003',          // HTTPS version
  // Add your production domain here when deployed
];

const defaultOptions: CorsOptions = {
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
};

export function cors(options: CorsOptions = {}) {
  const opts = { ...defaultOptions, ...options };

  return {
    headers: getCorsHeaders(opts),
    preflight: (request: NextRequest) => handlePreflight(request, opts),
  };
}

function getCorsHeaders(options: CorsOptions): Record<string, string> {
  const headers: Record<string, string> = {};

  // Handle origin
  if (typeof options.origin === 'string') {
    headers['Access-Control-Allow-Origin'] = options.origin;
  } else if (Array.isArray(options.origin)) {
    headers['Access-Control-Allow-Origin'] = options.origin.join(', ');
  } else if (options.origin === true) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (options.origin !== false) {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  // Handle methods
  if (options.methods) {
    headers['Access-Control-Allow-Methods'] = options.methods.join(', ');
  }

  // Handle headers
  if (options.allowedHeaders) {
    headers['Access-Control-Allow-Headers'] = options.allowedHeaders.join(', ');
  }

  // Handle credentials
  if (options.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  // Handle max age
  if (options.maxAge) {
    headers['Access-Control-Max-Age'] = options.maxAge.toString();
  }

  return headers;
}

function handlePreflight(request: NextRequest, options: CorsOptions): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(options),
  });
}

export function withCors(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: CorsOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const corsConfig = cors(options);

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return corsConfig.preflight(request);
    }

    // Process the actual request
    const response = await handler(request);

    // Add CORS headers to the response
    Object.entries(corsConfig.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
} 