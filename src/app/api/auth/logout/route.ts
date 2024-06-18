import { NextRequest, NextResponse } from "next/server";
import { permanentRedirect } from 'next/navigation'
import { logout } from "@/services/directus";
import { getCookie, removeCookie } from "@/lib/cookies";


export async function GET(req: NextRequest) {

  const clientId = req.nextUrl.searchParams.get('client_id');
  const redirectLogoutUrl = req.nextUrl.searchParams.get('redirect_logout_url');

  if (!clientId || !redirectLogoutUrl) {
    return new NextResponse(JSON.stringify({ error: 'client_id and redirect_url are required' }), { status: 400 });
  }

  //TODO: Validate client id & redirects urls
  const cookieName = process.env.SESSION_COOKIE_NAME;

  if (!cookieName) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });

  }

  //Get the token from the cookie
  const cookieValue = getCookie(cookieName);

  if (!cookieValue) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { access_token, refresh_token } = JSON.parse(cookieValue);

  if (!access_token || !refresh_token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }


  //Remove the cookie session
  removeCookie(cookieName)

  //redirect to the redirectLogoutUrl
  return NextResponse.redirect(`${redirectLogoutUrl}`, { status: 302 });

}