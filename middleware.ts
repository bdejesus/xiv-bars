import { NextRequest, NextResponse } from 'next/server';

function middleware(req: NextRequest) {
  const currentEnv = process.env.NEXT_PUBLIC_ENV || 'development';
  // retrieve the current response
  const res = NextResponse.next();

  // ssl redirect
  if (['production', 'staging'].includes(currentEnv)
    && req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
      301
    );
  }

  return res;
}

export default middleware;
