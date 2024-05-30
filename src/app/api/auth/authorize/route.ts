import { NextRequest, NextResponse } from "next/server";
import { permanentRedirect } from 'next/navigation'
import { getCookie } from "@/lib/cookies";


export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('client_id');
  const redirectUrl = req.nextUrl.searchParams.get('redirect_url');
  const state = req.nextUrl.searchParams.get('state');

  if (!clientId || !redirectUrl || !state) {
    return new NextResponse(JSON.stringify({ error: 'client_id, redirect_url and state are required' }), { status: 400 });
  }

  //TODO: Validate client id & redirects urls


  //If we already have a cookie we should redirect to the callback URL
  const cookieName = process.env.COOKIE_NAME;
  if (cookieName) {
    const cookieValue = getCookie(cookieName);

    if (cookieValue) {
      //Cookie values is a json with access_token and refresh_token
      const { access_token } = JSON.parse(cookieValue);

      if (access_token) {
        const code = Math.random().toString(36).substring(7);
        const redirectWithState = `${redirectUrl}?state=${state}&code=${code}`;
        return permanentRedirect(redirectWithState);
      }
    }

  }

  return permanentRedirect(`/login?client_id=${clientId}&redirect_url=${redirectUrl}&state=${state}`);

}