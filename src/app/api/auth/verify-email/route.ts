import { verifyEmail } from "@/services/directus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const response = await verifyEmail(token)
    if(response.status !== 200) {
      return NextResponse.json({ error: 'Email verification failed' }, { status: response.status });
    
    }

    return NextResponse.json({ message: 'Email verified successfully' });
  }
  catch (error) {
    return NextResponse.json({ error: 'Email verification failed' }, { status: 400 });
  }

}