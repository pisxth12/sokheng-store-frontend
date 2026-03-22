// components/HeaderServer.tsx
import { cookies } from 'next/headers';
import HeaderClient from './HeaderClient';
import { getCartCountForUser, getCartCountForGuest } from '@/lib/services/cart.server';
import { getWishlistCountForUser, getWishlistCountForGuest } from '@/lib/services/wishlist.server';
import { getUserProfile } from '@/lib/services/user.server';

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('token')?.value;
  const guestSessionId = cookieStore.get('cartSessionId')?.value;
  
  const isAuthenticated = !!authToken;
  
  const [user, cartCount, wishlistCount] = await Promise.all([
    getUserProfile(authToken),
    isAuthenticated 
      ? getCartCountForUser(authToken)
      :  guestSessionId ? getCartCountForGuest(guestSessionId) : 0,
    isAuthenticated
      ? getWishlistCountForUser(authToken)
      : guestSessionId ? getWishlistCountForGuest(guestSessionId) : 0,
  ]);
  
  
  return (
    <HeaderClient 
      userData={user}
      initialCount={cartCount}
      initialWishlistCount={wishlistCount}
    />
  );
}

