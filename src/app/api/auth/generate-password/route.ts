import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new NextResponse(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password generated successfully', user: updatedUser });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Error generating password' }), { status: 500 });
  }
}
