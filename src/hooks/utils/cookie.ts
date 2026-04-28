// lib/utils/cookies.ts
'use server';

import { cookies } from 'next/headers';

export async function forwardSessionCookie(cookie: string | null) {
  if (!cookie) return;
  
  const match = cookie.match(/sessionId=([^;]+)/);
  if (!match) return;
  
  const cookieStore = await cookies();
  cookieStore.set('sessionId', match[1], {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
  });
}