import { NextRequest, NextResponse } from 'next/server';

function middleware(req: NextRequest) {
  const currentEnv = process.env.NEXT_PUBLIC_ENV || 'development';
  // retrieve the current response
  const res = NextResponse.next();
  const url = req.nextUrl.clone();

  if (req.headers.get('host') === 'xivbars.bejezus.com') {
    url.hostname = 'www.xivbars.com';
    return NextResponse.redirect(url);
  }

  // ssl redirect
  if (['production', 'staging'].includes(currentEnv)
    && req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
      301
    );
  }

  // add the CORS headers to the response
  const rx = /\/character\/.*/;
  if (rx.test(req.nextUrl.pathname)) {
    res.headers.append('Access-Control-Allow-Credentials', 'true');
    res.headers.append('Access-Control-Allow-Origin', '*');
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    res.headers.append(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  return res;
}

export default middleware;
