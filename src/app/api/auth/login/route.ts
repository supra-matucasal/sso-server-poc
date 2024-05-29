import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';
import { login } from '@/services/directus';

export async function POST(req: NextRequest) {
  const { email, password, token, redirect_url, state } = await req.json();

  console.log('redirect_url: ', redirect_url)

  if (!email || !password || !redirect_url || !state) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const {access_token, refresh_token, expires} =  await login(email, password)
  
  const accessToken = access_token
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


  // // Store the state and associate it with the user ID
  // await prisma.state.create({
  //   data: {
  //     state,
  //     userId: user.id,
  //     expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  //   },
  // });


  //Generate randome code for redirect
  const code = Math.random().toString(36).substring(7);

  
  const redirectWithState = `${redirect_url}?state=${state}&code=${code}`;

  
  console.log('redirectWithState: ', redirectWithState)

  return NextResponse.json({ message: 'Logged in', redirectUrl: redirectWithState });

}
