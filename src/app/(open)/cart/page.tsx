import { getCart } from '@/lib/services/cart.server';
import CartClient from './CartClient';
import './CartPage.css';

export const dynamic = 'force-dynamic'



export default async function CartPage() {
  const cart = await getCart();
  
  return <CartClient initialCart={cart} />; 

}