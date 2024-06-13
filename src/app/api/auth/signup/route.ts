import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, singCodeToken } from '@/lib/jwt';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';
import { signup } from '@/services/directus';

export async function POST(req: NextRequest) {
  const { email, password, token, redirect_url, state } = await req.json();

  console.log('redirect_url: ', redirect_url)

  if (!email || !password || !redirect_url || !state) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const { access_token, refresh_token, expires } = await signup(email, password)

  const accessToken = access_token
  const cookieName = process.env.SESSION_NAME || 'server-cookie';
  const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost';
  const cookieMaxAge = process.env.COOKIE_MAX_AGE || 3600;


  if (!accessToken || !cookieName || !cookieDomain) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }

  //The value of the cookie is a json with access token and refresh token
  // const cookieValue = JSON.stringify({ access_token: accessToken, refresh_token: refresh_token });

  // cookies().set({
  //   name: cookieName,
  //   value: cookieValue,
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'lax',
  //   path: '/',
  //   domain: cookieDomain,
  //   maxAge: +cookieMaxAge
  // });



  // //Generate randome code for redirect
  // const code = Math.random().toString(36).substring(7);


  // const redirectWithState = `${redirect_url}?state=${state}&code=${code}`;

  //The value of the cookie is a json with access token and refresh token
  const cookieValue = JSON.stringify({ access_token: accessToken, refresh_token: refresh_token, email: email });

 

  // cookies().set({
  //   name: cookieName,
  //   value: cookieValue,
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'lax',
  //   path: '/',
  //   domain: cookieDomain,
  //   maxAge: +cookieMaxAge
  // });



  //The code will contain a JWT created from the current access token and refresh token
  const code = await singCodeToken({ access_token: accessToken, refresh_token: refresh_token, expires, email });
  


  const redirectWithState = `${redirect_url}?state=${state}&code=${code}`;



  console.log('redirectWithState: ', redirectWithState)

  const response =  NextResponse.json({ message: 'Signed up & Logged in', redirectUrl: redirectWithState });

  response.cookies.set(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    path: '/',
    domain: cookieDomain,
    maxAge: +cookieMaxAge,
  });

  return response;

}
