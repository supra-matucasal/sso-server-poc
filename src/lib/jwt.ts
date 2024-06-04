import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_TEMP_EXPIRES_IN = process.env.JWT_TEMP_EXPIRES_IN || '10m';

//generate temp token for auth user
export const signTempToken = async (user: { id: number; email: string }) => {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_TEMP_EXPIRES_IN)
    .sign(SECRET_KEY);
};

export const singCodeToken = async (payload: { access_token: string; refresh_token: string, expires: number }) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_TEMP_EXPIRES_IN)
    .sign(SECRET_KEY);
}


export const signToken = async (user: { id: number; email: string }) => {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(SECRET_KEY);
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};
