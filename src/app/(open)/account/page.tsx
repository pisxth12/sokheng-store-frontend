
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AccountClient from './AccountClient';
import { getOrderCount } from '@/lib/services/order.server';
import { getWishlistCount } from '@/lib/services/wishlist.server';
import { getUserProfile } from '@/lib/services/user.server';

export default async function AccountPage() {

  const cookieStore = await cookies();
  const sessionId = cookieStore.get('JSESSIONID')?.value;
  
  if (!sessionId) {
    redirect('/login');
  }

 
  const [orderCount, wishlistCount, user] = await Promise.all([
    getOrderCount(sessionId),
    getWishlistCount(sessionId),
    getUserProfile(sessionId)
  ]);

  return (
    <AccountClient 
      initialUser={user}
      initialOrderCount={orderCount}
      initialWishlistCount={wishlistCount}
    />
  );
}