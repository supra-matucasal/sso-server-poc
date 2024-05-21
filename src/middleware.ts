import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

const allowedOrigins = [
  'http://localhost:3000',
  // Add other allowed origins here
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');

  if (!origin && req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Origin not found' }, { status: 403 });
  }

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
  }

  if (req.nextUrl.pathname.startsWith('/api/')) {
    const cookieToken = cookies().get('sso-token')?.value;
    const authorization = req.headers.get('authorization');

    let user = null;

    if (cookieToken) {
      user = await verifyToken(cookieToken);
      console.log('user from cookie', user)
    }


    if (!user && authorization) {
      const token = authorization.split(' ')[1];
      if (token) {
        user = await verifyToken(token);
        console.log('user from token', user)
      }
    }

    console.log('user', user)


    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    req.nextUrl.searchParams.set('user', JSON.stringify(user));
  }

  if (req.nextUrl.pathname === '/login') {
    const validToken = process.env.TOKEN_EXTERNAL_APPS;
    const token = req.nextUrl.searchParams.get('token');
    if (!token || token !== validToken) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/api/protected/:path*', '/api/auth/validate', '/login'],
};
