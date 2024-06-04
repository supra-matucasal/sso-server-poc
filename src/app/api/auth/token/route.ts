import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { getCookie } from '@/lib/cookies';
import { refreshToken } from '@/services/directus';


export async function POST(req: NextRequest) {
  //const { code, client_id, redirect_uri, client_secret } = await req.json();
  const body = await req.text();
  const params = new URLSearchParams(body);

  const code = params.get('code');
  const client_id = params.get('client_id');
  const redirect_uri = params.get('redirect_uri');
  const client_secret = params.get('client_secret');
  const grant_type = params.get('grant_type');
  const refresh_token = params.get('refresh_token');

  if (grant_type === 'authorization_code') {
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }


    //TODO: the client_id and client_secret


    /*** Validate the code and set the cookie ***/
    const codeToken = await verifyToken(code);
    if (!codeToken) {
      return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }

    console.log('Code token: ', codeToken)

    const accessToken = codeToken.access_token;
    const refreshToken = codeToken.refresh_token;
    const expires = codeToken.expires;

    const res = NextResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: expires,
      scope: 'openid profile email'
    });

    return res;
  }

  /*** Refresh token ***/
  if (grant_type === 'refresh_token') {
    if (!refresh_token) {
      return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
    }

    //console.log('Refresh token: ', refresh_token);

    //const codeToken = await verifyToken(refresh_token);
    // if (!codeToken) {
    //   return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    // }

    // const accessToken = codeToken.access_token;


    //Getting the refresh token from directus
    const codeToken = await refreshToken(refresh_token)

    console.log('New tokens...:', codeToken)

    const res = NextResponse.json({
      access_token: codeToken.access_token,
      refresh_token: codeToken.refresh_token,
      token_type: 'Bearer',
      expires_in: codeToken.expires,
      scope: 'openid profile email'
    });

    return res;
  }

}