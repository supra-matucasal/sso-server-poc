import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, signToken } from '@/lib/jwt';


export async function POST(req: NextRequest) {
  const { tempToken } = await req.json();

  if (!tempToken) {
    return NextResponse.json({ error: 'Temp token is required' }, { status: 400 });
  }

  
  //Verify temp token
  const decoded = await verifyToken(tempToken);

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }


  //Generate a real access token now
  const accessToken = await signToken({ id: user.id, email: user.email });

  return NextResponse.json({ accessToken }, { status: 200 });
}