import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';


export async function POST(req: NextRequest) {
  const { tempToken } = await req.json();

  if (!tempToken) {
    return NextResponse.json({ error: 'Temp token is required' }, { status: 400 });
  }

  
  //Verify temp token
  const decoded = await verifyToken(tempToken);

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }


  //Generate a real access token now
  const accessToken = await signToken({ id: user.id, email: user.email });

  //Now that I have the token I will store it in a cookie
  const cookieName = process.env.COOKIE_NAME;
  const cookieDomain = process.env.COOKIE_DOMAIN;
  const cookieMaxAge = process.env.COOKIE_MAX_AGE || 3600;

  if(!accessToken || !cookieName || !cookieDomain) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  // cookies().set({
  //   name: cookieName,
  //   value: accessToken,
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'strict',
  //   path: '/',
  //   domain: cookieDomain, 
  //   maxAge: +cookieMaxAge
  // });

  // cookies().set({
  //   name: 'sso-token-real-token',
  //   //name: cookieName,
  //   value: accessToken,
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'strict',
  //   path: '/',
  //   domain: 'localhost', 
  //   maxAge: 3600
  // });



  //return NextResponse.json({ accessToken }, { status: 200 });
  return NextResponse.json({ accessToken });

}