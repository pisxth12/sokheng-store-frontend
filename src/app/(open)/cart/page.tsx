
import { getCart } from '@/lib/services/cart.server';
import CartClient from './CartClient';


export default async function CartPage() {
  const cart = await getCart();
  
  return <CartClient initialCart={cart} />; 

}