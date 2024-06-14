import { NextResponse } from 'next/server';
import { isClientSecretValid } from '@/services/directus';

export async function validateClient(client_id: string, client_secret: string) {
  
  if (!client_id || !client_secret) {
    return NextResponse.json({ error: 'client_id, client_secret are required' }, { status: 400 });
  }

  const isSecretValid = await isClientSecretValid(client_id, client_secret);
  if (!isSecretValid) {
    return NextResponse.json({ error: 'Invalid client_secret' }, { status: 400 });
  }

  // If validation passes, return null
  return null;
}
