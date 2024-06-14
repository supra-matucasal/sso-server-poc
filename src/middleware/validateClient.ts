import { NextResponse } from 'next/server';
import { isClientSecretValid, isRedirectUrlValid } from '@/services/directus';

export async function validateClient(params: URLSearchParams) {
  const client_id = params.get('client_id');
  const client_secret = params.get('client_secret');

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
