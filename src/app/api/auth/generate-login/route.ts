import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {

  const { redirect: redirectUrl, token, state } = await req.json();

  //If token is not valid throw an error
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Token is required' }), { status: 400 });
  }

  try {

    const currentUrl = process.env.AUTH_SSO_SERVER;

    const loginUrl = `${currentUrl}/login?redirect=${redirectUrl}&state=${state}`;

    
    return new NextResponse(JSON.stringify({ redirectTo: loginUrl }), {
      status: 200
    })

  } catch (error) {
    console.log('Error generating password', error)
    return new NextResponse(JSON.stringify({ error: 'Error generating password' }), { status: 500 });
  }
}


