import { NextRequest, NextResponse, userAgent } from 'next/server';
import { getCookie } from './lib/cookies';
import { verifyToken } from './lib/jwt';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:5000',
  'http://app1.local:4000',
  'http://app2.local:5000',
  'http://127.0.0.1:4000',
  'http://127.0.0.1:5000'
  // Add other allowed origins here
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.next();

    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { headers: response.headers });
    }

    return response;
  }


  //If the route is login or /api/auth/generate-login we should check if there is a cookie or not
  //If there is a cookie we should redirect to the callback URL of the parameter
  // console.log('req.nextUrl.pathname', req.nextUrl.pathname)
  // if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/api/auth/generate-login') {
  //   const cookieName = process.env.COOKIE_NAME;
  //   //const cookieName = 'sso-temp-token';
  //   if (cookieName) {
  //     const accessToken = getCookie(cookieName)
  //     console.log('accessToken', accessToken)
  //     if (accessToken && await verifyToken(accessToken)) {
  //       let redirectUrl
  //       if (req.nextUrl.pathname  === '/login') {
  //         const url = new URL(req.url);
  //         redirectUrl = url.searchParams.get('redirect') + '?accessToken=' + accessToken;
  //       } else {
  //         const { redirect } = await req.json();
  //         redirectUrl = redirect + '?accessToken=' + accessToken;
  //       }

  //       return NextResponse.redirect(redirectUrl);
  //     }
  //   }

  // }

  if(req.nextUrl.pathname === '/'){
    return new NextResponse('Page Not Available', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*', '/login', '/'],
};
