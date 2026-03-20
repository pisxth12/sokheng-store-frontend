// components/HeaderServer.tsx
import { cookies } from 'next/headers';
import HeaderClient from './HeaderClient';
import { getServerCartCount } from '@/lib/services/cart.server';
import { getWishlistCount } from '@/lib/services/wishlist.server';

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('JSESSIONID')?.value;
  const [count, wishlistCount] = await Promise.all([
    getServerCartCount(sessionId),
    getWishlistCount(sessionId)
  ]);
  
  
  return <HeaderClient initialWishlistCount={wishlistCount} initialCount={count} />;
}