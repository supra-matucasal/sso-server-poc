import { cookies } from "next/headers";

const cookieMaxAge = process.env.COOKIE_MAX_AGE || '3600';
const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost';

export const setCookie = (cookieName: string, value: string) => {

  cookies().set({
    name: cookieName,
    value: value,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    domain: cookieDomain,
    maxAge: +cookieMaxAge
  });

};

export const getCookie = (cookieName: string) => {
  console.log('Trying to get cookie with this cookiename: ', cookieName)
  return cookies().get(cookieName)?.value;
};

