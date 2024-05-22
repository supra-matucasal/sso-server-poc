import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:5000',
  // Add other allowed origins here
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');


  console.log('origin', origin)


  if (!origin && req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Origin not found' }, { status: 403 });
  }

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
  }


  //If the url is /api/protected I will check the token except for the generate-login endpoint
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const cookieToken = cookies().get('sso-token')?.value;
    const authorization = req.headers.get('authorization');

    let user = null;

    if (cookieToken) {
      user = await verifyToken(cookieToken);
    }
    
    if (!user && authorization) {
      const token = authorization.split(' ')[1];
      if (token) {
        user = await verifyToken(token);
      }
    }

    if (!user && !req.nextUrl.pathname.startsWith('/api/auth/generate-login')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    req.nextUrl.searchParams.set('user', JSON.stringify(user));
  }

  //If the url is /login I will check the token
  if (req.nextUrl.pathname === '/login') {
    const validToken = process.env.TOKEN_EXTERNAL_APPS;
    const token = req.nextUrl.searchParams.get('token');
    if (!token || token !== validToken) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

  }

  //I want to return the next response but with the headers set to allow cors
  return NextResponse.next({
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    
  })

}

export const config = {
  matcher: ['/api/protected/:path*', '/api/auth/validate', '/login', '/api/auth/generate-login'],
};
