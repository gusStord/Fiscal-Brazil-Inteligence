import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fast-path for health checks — respond IMMEDIATELY without waiting for full Next.js
  // This is critical for FC (Function Compute) health checks during cold starts
  if (pathname === '/healthz') {
    return new NextResponse('ok', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  if (pathname === '/health' || pathname === '/ready') {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'brazil-fiscal-intelligence'
    });
  }

  if (pathname === '/api/health') {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'brazil-fiscal-intelligence'
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/health', '/healthz', '/ready', '/api/health'],
};
