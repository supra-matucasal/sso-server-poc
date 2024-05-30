import { NextRequest, NextResponse } from "next/server";
import { permanentRedirect } from 'next/navigation'
import { logout } from "@/services/directus";
import { getCookie, removeCookie } from "@/lib/cookies";


export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('client_id');
  const redirectLogoutUrl = req.nextUrl.searchParams.get('redirect_logout_url');
  
  //return NextResponse.redirect(`${process.env.AUTH_SSO_SERVER}/api/auth/logout?client_id=${client_id}&redirect_logout_url=${redirect_logout_url}`, { status: 302 });

  if (!clientId || !redirectLogoutUrl ) {
    return new NextResponse(JSON.stringify({ error: 'client_id and redirect_url are required' }), { status: 400 });
  }

  //TODO: Validate client id & redirects urls

  const cookieName = process.env.COOKIE_NAME;

  if(!cookieName) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  
  }

  //Get the token from the cookie
  console.log('Trying to get this cookie in the server: ', cookieName)
  const cookieValue = getCookie(cookieName);

  if(!cookieValue) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { access_token, refresh_token } = JSON.parse(cookieValue);



  if(!access_token || !refresh_token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  //Logout from directus
  await logout(access_token, refresh_token);

  //Remove the cookie session
  removeCookie(cookieName)

  //redirect to the redirectLogoutUrl
  return permanentRedirect(redirectLogoutUrl);  
}