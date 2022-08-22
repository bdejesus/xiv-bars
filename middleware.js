import { NextResponse } from 'next/server';

function middleware(req) {
  const currentEnv = process.env.NEXT_PUBLIC_ENV;

  // ssl redirect
  if (['production', 'staging'].includes(currentEnv)
    && req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
      301
    );
  }

  return NextResponse.next();
}

export default middleware;
