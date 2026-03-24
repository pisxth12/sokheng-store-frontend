// app/cart/CartClient.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Plus, Minus, ShoppingBag, ChevronRight, Trash2, Lock } from 'lucide-react';
import type { CartResponse } from '@/types/open/cart.type';
import './CartPage.css';
import { removeCartItem, updateCartItem } from '../actions/cart.actions';

interface CartClientProps {
  initialCart: CartResponse | null;
}

export default function CartClient({ initialCart }: CartClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(initialCart);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    setUpdatingId(itemId);
    
    startTransition(async () => {
      try {
        const updatedCart = await updateCartItem(itemId, newQuantity);
        setCart(updatedCart);
      } catch (error) {
        console.error('Failed to update cart:', error);
      } finally {
        setUpdatingId(null);
      }
    });
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingId(itemId);
    
    startTransition(async () => {
      try {
        const updatedCart = await removeCartItem(itemId);
        setCart(updatedCart);
      } catch (error) {
        console.error('Failed to remove item:', error);
      } finally {
        setUpdatingId(null);
      }
    });
  };

  // Empty cart state
  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen py-12 bg-white dark:bg-[#0f0f0e] cp-page-enter">
        <div className="max-w-7xl mx-auto px-4 text-center pt-24">
          <ShoppingBag className="w-12 h-12 mx-auto mb-6 text-gray-200 dark:text-[#2a2a27]" strokeWidth={1} />
          <h1 className="text-xl font-normal text-gray-900 dark:text-white mb-3">Your cart is empty</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-7">Looks like you haven't added anything yet.</p>
          <Link
            href="/products"
            className="inline-block text-xs tracking-widest uppercase text-gray-900 dark:text-white border-b border-gray-900 dark:border-white pb-0.5 hover:opacity-50 transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalPrice;
  const itemCount = cart.totalItems;

  return (
    <div className="min-h-screen py-8 bg-white dark:bg-[#0f0f0e] cp-page-enter">
      <div className="max-w-primary mx-auto px-4">
        {/* Header */}
        <div className="mb-10 border-b border-gray-100 dark:border-[#2a2a27] pb-5">
          <h1 className="text-xl font-normal text-gray-900 dark:text-white">Shopping cart</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 tracking-wider uppercase">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-12">
          {/* Left: Items */}
          <div className="lg:col-span-4">
            <div className="divide-y divide-gray-100 dark:divide-[#2a2a27]">
              {cart.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="py-6 flex gap-6 cp-row-enter"
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  {/* Image */}
                  <Link 
                    href={`/${item.categorySlug}/${item.slug}`} 
                    className="w-24 lg:w-40 h-24 lg:h-40 bg-gray-50 dark:bg-[#1a1a18] shrink-0 cp-img-wrap"
                  >
                    {item.productImage ? (
                      <img 
                        src={item.productImage} 
                        alt={item.productName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-300 dark:text-[#3a3a37]" />
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1 gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/${item.categorySlug}/${item.slug}`}
                          className="text-sm text-gray-800 dark:text-gray-200 hover:text-gray-400 hover:underline dark:hover:text-gray-500 transition truncate block"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1.5">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Qty + Remove */}
                    <div className="flex items-center gap-4 mt-5">
                      <div className="cp-qty-wrap">
                        <button
                          className="cp-qty-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingId === item.id || isPending}
                        >
                          {updatingId === item.id && isPending ? (
                            <span className="cp-spinner" />
                          ) : (
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          )}
                        </button>
                        <span className="cp-qty-val">{item.quantity}</span>
                        <button
                          className="cp-qty-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock || updatingId === item.id || isPending}
                        >
                          <Plus className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>

                      <button
                        className="cp-remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingId === item.id || isPending}
                      >
                        <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/products" className="cp-continue-link">
                <ChevronRight className="w-3 h-3 rotate-180" strokeWidth={1.5} />
                Continue shopping
              </Link>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 p-6 cart-sumury-body">
              <div className="border-b border-gray-100 dark:border-[#2a2a27] pb-4 mb-5">
                <h2 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Order summary
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-300 dark:text-gray-600">At checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="text-gray-300 dark:text-gray-600">At checkout</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2a2a27]">
                <div className="flex justify-between text-2xl">
                  <span className="font-normal text-gray-900 dark:text-white">Total</span>
                  <span className="font-normal text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-1.5 text-right">
                  Taxes and shipping calculated at checkout
                </p>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                disabled={isPending}
                className="cp-checkout-btn mt-6 w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-3 h-3" strokeWidth={1.5} />
                Checkout
              </button>

              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="text-[10px] text-gray-300 dark:text-gray-600 uppercase tracking-wider">Secure</span>
                <div className="flex gap-1.5">
                  {['Visa', 'MC', 'Amex', 'PayPal'].map(c => (
                    <span key={c} className="cp-card-badge">{c}</span>
                  ))}
                </div>
              </div>

              <div className="mt-5 text-center border-t border-gray-100 dark:border-[#2a2a27] pt-5">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">
                  Need help?{' '}
                  <a href="/contact" className="text-gray-900 dark:text-white underline underline-offset-2 hover:text-red-500 dark:hover:text-red-400 transition">
                    Contact us
                  </a>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Free shipping and returns on all orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}