import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const user = JSON.parse(req.nextUrl.searchParams.get('user') || '{}');

  console.log('User in auth/validate', user);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Token is valid', user });
}
