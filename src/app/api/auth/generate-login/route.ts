import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {

  const { redirect: redirectUrl, token, state } = await req.json();

  try {
    const currentUrl = process.env.AUTH_SSO_SERVER || 'http://localhost:3000';

    const loginUrl = `${currentUrl}/login?redirect=${redirectUrl}&token=${token}&state=${state}`;

    
    return new NextResponse(JSON.stringify({ redirectTo: loginUrl }), {
      status: 200
    })

  } catch (error) {
    console.log('Error generating password', error)
    return new NextResponse(JSON.stringify({ error: 'Error generating password' }), { status: 500 });
  }
}


