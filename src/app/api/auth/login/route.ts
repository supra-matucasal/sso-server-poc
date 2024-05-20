import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new NextResponse(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  const token = await signToken({ id: user.id, email: user.email });


  cookies().set({
    name: 'sso-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'none',
    path: '/',
    maxAge: 3600, // 1 hour
    domain: process.env.COOKIE_DOMAIN || 'localhost'
  });

  return NextResponse.json({ message: 'Logged in', token });
}
