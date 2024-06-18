import { NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation'
import { getCookie, setCookie } from "@/lib/cookies";
import { singCodeToken } from "@/lib/jwt";
import { isRedirectUrlValid } from "@/services/directus";


export async function GET(req: NextRequest) {
  console.log('Trying to authorize')
  const clientId = req.nextUrl.searchParams.get('client_id');
  const clientSecret = req.nextUrl.searchParams.get('client_secret');
  const redirectUrl = req.nextUrl.searchParams.get('redirect_uri');
  const state = req.nextUrl.searchParams.get('state');

  console.log('clientSecret in authoruze', clientSecret)

  if (!clientId || !redirectUrl || !state) {
    return new NextResponse(JSON.stringify({ error: 'client_id, redirect_uri and state are required' }), { status: 400 });
  }

  //Check if the redirect URL is valid and belongs to the client
  const isValid = await isRedirectUrlValid(clientId, redirectUrl);

  if (!isValid) {
    return new NextResponse(JSON.stringify({ error: 'Invalid redirect_url or client Id' }), { status: 400 });
  }


  //If we already have a cookie we should redirect to the callback URL
  const cookieName = process.env.SESSION_COOKIE_NAME;
  if (cookieName) {
    const cookieValue = getCookie(cookieName);

    if (cookieValue) {
      //Cookie values is a json with access_token and refresh_token
      const { access_token, refresh_token, expires, email } = JSON.parse(cookieValue);
      console.log('access_token in authorize', access_token)
      if (access_token) {
        const code = await singCodeToken({ access_token: access_token, refresh_token: refresh_token, expires, email });
        const redirectWithState = `${redirectUrl}?state=${state}&code=${code}`;
        return redirect(redirectWithState);
      }
    }

  }


  //Set temporary cookie with the client_id and redirect_uri
  const cookieValue = JSON.stringify({ clientId: clientId, redirectUrl: redirectUrl });
  const cookieTempName = process.env.TEMP_AUTH_COOKIE_NAME || 'supra-temp-auth-cookie';
  setCookie(cookieTempName, cookieValue);
  //cookieName: string, value: string

  return redirect(`/login?state=${state}`);

}