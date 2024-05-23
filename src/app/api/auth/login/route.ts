import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { email, password, token, redirectUrl, state } = await req.json();

  if (!email || !password || !redirectUrl || !state) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  //Check the user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  const accessToken = await signToken({ id: user.id, email: user.email });

  cookies().set({
    name: 'sso-token',
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    domain: 'localhost', 
    maxAge: 3600, // 1 hour
  });



  // Store the state and associate it with the user ID
  await prisma.state.create({
    data: {
      state,
      userId: user.id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  
  const redirectWithState = `${redirectUrl}?state=${state}`;


  return NextResponse.json({ message: 'Logged in', redirectUrl: redirectWithState });

}
