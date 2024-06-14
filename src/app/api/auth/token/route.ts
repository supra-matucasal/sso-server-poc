import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { refreshToken, isRedirectUrlValid } from '@/services/directus';
import { validateClient } from '@/middleware/validateClient';


export async function POST(req: NextRequest) {
  
  const body = await req.text();
  const params = new URLSearchParams(body);

  const client_id = params.get('client_id');
  const client_secret = params.get('client_secret');
  const code = params.get('code');
  const redirect_uri = params.get('redirect_uri');
  const grant_type = params.get('grant_type');
  const refresh_token = params.get('refresh_token');

  console.log('Params: ', {
    code,
    client_id,
    redirect_uri,
    client_secret,
    grant_type,
    refresh_token

  })

  if ((!client_id) || (!client_secret) || (!grant_type) || (!redirect_uri)) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  //Validate if the client_id and client_secret are valid
  const validationError = await validateClient(client_id, client_secret);
  if (validationError) {
    return validationError;
  }


  if (grant_type === 'authorization_code') {
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }


    //TODO: the client_id and client_secret
    //Check if the redirect URL and the client Secret are valid and belongs to the client
    const isRedirectValid = await isRedirectUrlValid(client_id, redirect_uri);
    if (!isRedirectValid) {
      return NextResponse.json({ error: 'Invalid redirect_url or client Id' }, { status: 400 });
    }

    console.log('Redirect valid: ', isRedirectValid)

    // const isSecretValid = await isClientSecretValid(client_id, client_secret);
    // if (!isSecretValid) {
    //   return NextResponse.json({ error: 'Invalid client_secret' }, { status: 400 });
    // }


    /*** Validate the code and set the cookie ***/
    const codeToken = await verifyToken(code);
    if (!codeToken) {
      return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }

    console.log('Code token: ', codeToken)

    const accessToken = codeToken.access_token;
    const refreshToken = codeToken.refresh_token;
    const expires = codeToken.expires;
    const email = codeToken.email;

    const res = NextResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      email: email,
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