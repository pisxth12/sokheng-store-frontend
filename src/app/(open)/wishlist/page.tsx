import { getCart } from '@/lib/services/cart.server';
import { getWishlist } from '../actions/wishlist.actions';
import WishlistClient from './WishlistClient';

export default async function WishlistPage() {
  const [wishlist, cart] = await Promise.all([
      getWishlist(),
      getCart()
  ]);
  return <WishlistClient initialWishlist={wishlist}    initialCart={cart} />;
}