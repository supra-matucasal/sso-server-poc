import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, singCodeToken } from '@/lib/jwt';
import { cookies, headers } from 'next/headers'
import bcrypt from 'bcrypt';
import { login } from '@/services/directus';
import { getCookie, deleteCookie } from '@/lib/cookies';

export async function POST(req: NextRequest, res: NextResponse) {
  const { email, password, token, state } = await req.json();

  if (!email || !password || !state) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  //Get the temporary cookie with the client_id and redirect_uri
  const tempCookieName = process.env.TEMP_AUTH_COOKIE_NAME || 'supra-temp-auth-cookie';
  const tempCookieValue = getCookie(tempCookieName);

  if (!tempCookieValue) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clientId, redirectUrl } = JSON.parse(tempCookieValue);

  if (!clientId || !redirectUrl) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }




  const { access_token, refresh_token, expires } = await login(email, password)

  //Remove the temporary cookie
  deleteCookie(tempCookieName);


  const accessToken = access_token


  //The value of the cookie is a json with access token and refresh token
  const cookieValue = JSON.stringify({ access_token: accessToken, refresh_token: refresh_token, expires, email: email });

  const cookieName = process.env.SESSION_COOKIE_NAME || 'supra-server-cookie';
  const cookieDomain = process.env.SESSION_COOKIE_DOMAIN || 'localhost';
  const cookieMaxAge = process.env.SESSION_COOKIE_MAX_AGE || 3600;

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
  const code = await singCodeToken({ access_token: accessToken, refresh_token: refresh_token, expires: expires, email: email });



  const redirectWithState = `${redirectUrl}?state=${state}&code=${code}`;


  console.log('redirectWithState from login: ', redirectWithState)

  //return NextResponse.json({ message: 'Logged in', redirectUrl: redirectWithState });

  const response = NextResponse.json({ message: 'Logged in', redirectUrl: `${redirectUrl}?state=${state}&code=${code}` });

  response.cookies.set(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    path: '/',
    domain: cookieDomain,
    maxAge: +cookieMaxAge,
  });

  return response;

  //return NextResponse.redirect(redirectWithState, { status: 307, headers: headers() });

  //I Like to redirect from the server with the headers cookies

  // const headers2 = {
  //   //...headers(),
  //   //'Set-Cookie': `${cookieName}=${cookieValue}; HttpOnly; Secure; SameSite=Lax; Path=/; Domain=${cookieDomain}; Max-Age=${cookieMaxAge}`,
  //   'Location': redirectWithState
  // }


  //res.redirect(307, '/path-to-redirect');


  //I want to redirect to the url with 307 using next js
  //return new NextResponse(null, { status: 307, headers: headers2 });

  // const response = NextResponse.redirect(redirectWithState);

  // return response;

  // response.setHeader('Set-Cookie', `session=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`);
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Set your client origin here
  // res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials
  // res.redirect(process.env.NEXT_PUBLIC_REDIRECT_URL || 'http://localhost:3000');

}
