import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

  // once validated the state is deleted
  await prisma.state.delete({ where: { state } });

  return NextResponse.json({ message: 'State verified' }, { status: 200 });
}