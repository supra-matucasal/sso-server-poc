import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { email, password, token, redirectUrl, state } = await req.json();

  if (!email || !password || !redirectUrl || !state) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  //Check the user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  const accessToken = await signToken({ id: user.id, email: user.email });
  const cookieName = process.env.COOKIE_NAME;
  const cookieDomain = process.env.COOKIE_DOMAIN;
  const cookieMaxAge = process.env.COOKIE_MAX_AGE || 3600;


  if(!accessToken || !cookieName || !cookieDomain) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }


  cookies().set({
      name: cookieName,
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      domain: cookieDomain, 
      maxAge: +cookieMaxAge
    });


  // Store the state and associate it with the user ID
  await prisma.state.create({
    data: {
      state,
      userId: user.id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  
  const redirectWithState = `${redirectUrl}?state=${state}&accessToken=${accessToken}`;


  return NextResponse.json({ message: 'Logged in', redirectUrl: redirectWithState });

}
