import { NextRequest, NextResponse } from 'next/server';
import { passwordResetRequest } from '@/services/directus';

export async function POST(req: NextRequest, res: NextResponse) {
  const { email, state } = await req.json();


  if (!email || !state) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }


  await passwordResetRequest(email);
  
  res = NextResponse.json({ message: 'Password reset requested' });
  return res;

}
