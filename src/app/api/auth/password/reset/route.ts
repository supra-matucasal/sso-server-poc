import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/services/directus';

export async function POST(req: NextRequest, res: NextResponse) {
  const { password, token } = await req.json();


  if (!password || !token) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }


  const response = await resetPassword(password, token);
  
  res = NextResponse.json({ message: 'Password reset correctly' });
  return res;

}
