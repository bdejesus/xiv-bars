import { NextResponse } from 'next/server';

function middleware() {
  // retrieve the current response
  const res = NextResponse.next();

  // add the CORS headers to the response
  res.headers.append('Access-Control-Allow-Credentials', 'true');
  res.headers.append('Access-Control-Allow-Origin', '*');
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return res;
}

export const config = {
  matcher: '/api/character/:path*',
};

export default middleware;
