// components/HeaderServer.tsx
import { cookies } from 'next/headers';
import HeaderClient from './HeaderClient';
import {  getCartCount } from '@/lib/services/cart.server';
import { getWishlistCounts } from '@/lib/services/wishlist.server';
import { getUserProfile } from '@/lib/services/user.server';

export default async function HeaderServer() {
  
  
  const [user, cartCount, wishlistCount] = await Promise.all([
    getUserProfile(),
    getCartCount(),
    getWishlistCounts(),
  ])


  return (
    <HeaderClient 
      userData={user}
      initialCount={cartCount}
      initialWishlistCount={wishlistCount}
    />
  );
}

