import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

const allowedOrigins = [
  'http://localhost:3000',
  // Add other allowed origins here
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');
  
  if(!origin) {
    return NextResponse.json({ error: 'Origin not found' }, { status: 403 });
  }
  
  if (!allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
  }

  const cookieToken = cookies().get('sso-token')?.value;

  console.log('cookieToken', cookieToken)

  const authorization = req.headers.get('authorization');

  console.log('authorization', authorization)

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

  // Attach user to request object for further use in API routes
  req.nextUrl.searchParams.set('user', JSON.stringify(user));

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/protected/:path*', '/api/auth/validate'], // Apply middleware to specific routes
};
