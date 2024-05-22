import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { state } = await req.json();

  if (!state) {
    return NextResponse.json({ error: 'State is required' }, { status: 400 });
  }

  const savedState = await prisma.state.findUnique({
    where: { state },
    include: { user: true },
  });

  if (!savedState || savedState.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired state' }, { status: 401 });
  }

  // Ensure the state is associated with the correct user
  if (!savedState.user) {
    return NextResponse.json({ error: 'State not associated with any user' }, { status: 401 });
  }

  const accessToken = await signToken({ id: savedState.user.id, email: savedState.user.email });

  // Set the token as a secure cookie
  cookies().set({
    name: 'sso-token',
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600, // 1 hour
  });

  // Optionally, delete the state after use to prevent reuse
  await prisma.state.delete({ where: { state } });

  return NextResponse.json({ token: accessToken });
}