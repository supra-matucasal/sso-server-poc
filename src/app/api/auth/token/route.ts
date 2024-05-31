import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { getCookie } from '@/lib/cookies';


export async function POST(req: NextRequest) {
  console.log('I am at token route')
  const { code, client_id, redirect_url, client_secret } = await req.json();


  if (!code || !client_id || !redirect_url || !client_secret) {
    return NextResponse.json({ error: 'code, client_id, redirect_url and client_secret are required' }, { status: 400 });
  }


  //TODO: the client_id and client_secret


  /*** Validate the code and set the cookie ***/
  const codeToken = await verifyToken(code);
  if (!codeToken) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }

  const accessToken = codeToken.access_token;
  const refreshToken = codeToken.refresh_token;

  const res = NextResponse.json({ accessToken });

  return res;

}