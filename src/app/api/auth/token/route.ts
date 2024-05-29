import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { getCookie } from '@/lib/cookies';


export async function POST(req: NextRequest) {
  console.log('I am at token route')
  const { code, client_id, redirect_url, client_secret } = await req.json();

  console.log(code, client_id, redirect_url, client_secret )

  if (!code || !client_id || !redirect_url || !client_secret) {
    return NextResponse.json({ error: 'code, client_id, redirect_url and client_secret are required' }, { status: 400 });
  }


  //TODO: Validate code, the client_id and client_secret



  //Return the access token from the cookie
  const cookieName = process.env.COOKIE_NAME;

  if(!cookieName) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  
  }

  console.log('Trying to get this cookie in the server: ', cookieName)


  const accessToken = getCookie(cookieName);

  //get all the cookies
  const allCookies = cookies().getAll();
  console.log('allCookies in token route', allCookies)

  console.log('accessToken in token route', accessToken)


  //return NextResponse.json({ accessToken }, { status: 200 });
  return NextResponse.json({ accessToken });

}