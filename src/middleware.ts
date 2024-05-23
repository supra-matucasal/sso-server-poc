import { NextRequest, NextResponse, userAgent } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { headers } from 'next/headers'


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:5000',
  // Add other allowed origins here
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');
  const hostHeader = req.headers.get("Host");
  
  
  console.log('req.nextUrl.pathname: ', req.nextUrl.pathname)
  console.log('hostHeader', hostHeader)
  console.log('origin', origin)
  console.log('req.headers.referer', req.headers.get('referer'))
  

  console.log('-----------------------------------')

  //If route is /api/auth/generate-login I will allow the request
  if (req.nextUrl.pathname.startsWith('/api/auth/generate-login')) {
    return NextResponse.next();
  }




  // if (!origin && req.nextUrl.pathname.startsWith('/api/')) {
  //   return NextResponse.json({ error: 'Origin not found' }, { status: 403 });
  // }

  // if (origin && !allowedOrigins.includes(origin)) {
  //   return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
  // }


  //If the url is /api/protected I will check the token except for the generate-login endpoint
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // const cookieToken = cookies().get('sso-token')?.value;
    // const authorization = req.headers.get('authorization');

    // let user = null;

    // if (cookieToken) {
    //   user = await verifyToken(cookieToken);
    // }

    // if (!user && authorization) {
    //   const token = authorization.split(' ')[1];
    //   if (token) {
    //     user = await verifyToken(token);
    //   }
    // }

    // if (!user && !req.nextUrl.pathname.startsWith('/api/auth/generate-login')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // req.nextUrl.searchParams.set('user', JSON.stringify(user));
  }

  //If the url is /login I will check the token
  // if (req.nextUrl.pathname === '/login') {
  //   const validToken = process.env.TOKEN_EXTERNAL_APPS;
  //   const token = req.nextUrl.searchParams.get('token');
  //   if (!token || token !== validToken) {
  //     return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  //   }

  // }

  //I want to return the next response but with the headers set to allow cors
  return NextResponse.next();

}

export const config = {
  matcher: ['/api/auth/:path*', '/api/auth/validate', '/login', '/api/auth/generate-login'],
};
