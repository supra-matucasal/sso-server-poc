import { NextRequest, NextResponse } from "next/server";
import { permanentRedirect } from 'next/navigation'


export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('client_id');
  const redirectUrl = req.nextUrl.searchParams.get('redirect_url');
  const state = req.nextUrl.searchParams.get('state');

  if (!clientId || !redirectUrl || !state) {
    return new NextResponse(JSON.stringify({ error: 'client_id, redirect_url and state are required' }), { status: 400 });
  }

  //TODO: Validate client id & redirects urls

  return permanentRedirect(`/login?client_id=${clientId}&redirect_url=${redirectUrl}&state=${state}`);
  
}