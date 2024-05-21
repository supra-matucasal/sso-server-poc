import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { email, password, token, redirectUrl } = await req.json();

  if (!email || !password || !token || !redirectUrl) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }


  // Verify the token
  const validToken = process.env.TOKEN_EXTERNAL_APPS;
  if (token !== validToken) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  //Check the user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  //Generate the auth token 
  const authToken = await signToken({ id: user.id, email: user.email });

  // Set the cookie
  cookies().set({
    name: 'sso-token',
    value: authToken,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'none',
    path: '/',
    maxAge: 3600, // 1 hour
    domain: process.env.COOKIE_DOMAIN || 'localhost'
  });

  return NextResponse.json({ message: 'Logged in', token: authToken, redirectUrl });

}
