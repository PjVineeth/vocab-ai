import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for a template file
  if (request.nextUrl.pathname.startsWith('/Speech_model_conv_pipeline_1805_/templates/')) {
    // Allow the request to proceed to the static file
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/Speech_model_conv_pipeline_1805_/templates/:path*',
}; 