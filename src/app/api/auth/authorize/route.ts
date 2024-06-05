import { NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation'
import { getCookie } from "@/lib/cookies";
import { singCodeToken } from "@/lib/jwt";


export async function GET(req: NextRequest) {
  console.log('Trying to authorize')
  const clientId = req.nextUrl.searchParams.get('client_id');
  const redirectUrl = req.nextUrl.searchParams.get('redirect_uri');
  const state = req.nextUrl.searchParams.get('state');

  if (!clientId || !redirectUrl || !state) {
    return new NextResponse(JSON.stringify({ error: 'client_id, redirect_uri and state are required' }), { status: 400 });
  }

  //TODO: Validate client id & redirects urls


  //If we already have a cookie we should redirect to the callback URL
  const cookieName = process.env.COOKIE_NAME;
  if (cookieName) {
    const cookieValue = getCookie(cookieName);

    if (cookieValue) {
      //Cookie values is a json with access_token and refresh_token
      const { access_token , refresh_token, expires} = JSON.parse(cookieValue);
      console.log('access_token in authorize', access_token)
      if (access_token) {
        const code = await singCodeToken({ access_token: access_token, refresh_token: refresh_token, expires });
        const redirectWithState = `${redirectUrl}?state=${state}&code=${code}`;
        return redirect(redirectWithState);
      }
    }

  }

  return redirect(`/login?client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}`);

}