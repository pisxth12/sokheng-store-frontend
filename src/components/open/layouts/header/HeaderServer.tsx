// components/HeaderServer.tsx
import { cookies } from 'next/headers';
import HeaderClient from './HeaderClient';
import { getServerCartCount } from '@/lib/services/cart.server';

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('JSESSIONID')?.value;
  const count = await getServerCartCount(sessionId);
  
  return <HeaderClient initialCount={count} />;
}