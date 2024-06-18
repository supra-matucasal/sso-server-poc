import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, singCodeToken } from '@/lib/jwt';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';
import { login, signup, checkUserExists } from '@/services/directus';

export async function POST(req: NextRequest) {
  const { email, password, token, redirect_url, state } = await req.json();

  console.log('redirect_url: ', redirect_url)

  if (!email || !password || !redirect_url || !state) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  //1- Check if the user already exists
  const userExists = await checkUserExists(email);
  console.log('userExists: ', userExists)
  if (userExists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  //2- Create the user
  const response = await signup(email, password, state);
  if (response.status !== 200 && response.status !== 204) {
    return NextResponse.json({ error: 'Sign up failed' }, { status: response.status });

  }

  //3) Try to login, if login does not work it means that the user has to confirm the email
  //const { access_token, refresh_token, expires } = await login(email, password);


  // const accessToken = access_token
  // const cookieName = process.env.SESSION_NAME || 'server-cookie';
  // const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost';
  // const cookieMaxAge = process.env.COOKIE_MAX_AGE || 3600;


  // if (!accessToken || !cookieName || !cookieDomain) {
  //   return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  // }

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
  //const cookieValue = JSON.stringify({ access_token: accessToken, refresh_token: refresh_token, email: email });



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
  //const code = await singCodeToken({ access_token: accessToken, refresh_token: refresh_token, expires, email });



  // const redirectWithState = `${redirect_url}?state=${state}&code=${code}`;
  // console.log('redirectWithState: ', redirectWithState)
  const redirectAfterSignup = `${process.env.AUTH_SSO_SERVER}/signup/success`;

  return NextResponse.json({ message: 'Signed up & Logged in', redirectUrl: redirectAfterSignup });

  // response.cookies.set(cookieName, cookieValue, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'lax',
  //   path: '/',
  //   domain: cookieDomain,
  //   maxAge: +cookieMaxAge,
  // });



}
