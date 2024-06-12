import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { me } from '@/services/directus';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }


  const token = authHeader.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  //const decoded = await verifyToken(token);
  const decoded = await me(token)
  console.log('Decoded: ', decoded)
  if (!decoded || !decoded.data) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  console.log('Decoded user data: ', decoded.data);

  return NextResponse.json({ id: decoded.data.id, email: decoded.data.email, first_name: decoded.data.first_name, last_name: decoded.data.last_name});
}
