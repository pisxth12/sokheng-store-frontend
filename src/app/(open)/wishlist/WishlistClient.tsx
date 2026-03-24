"use client";

import { useState, useTransition, useCallback } from 'react';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import EmptyWishlist from '@/components/open/wishlists/EmptyWishlist';
import './WishlistPage.css';
import { WishlistResponse } from '@/types/open/wishlist.types';
import { CartResponse } from '@/types/open/cart.type';
import { moveToCartFromWishlist, removeFromWishlist } from '../actions/wishlist.actions';

interface WishlistClientProps {
  initialWishlist: WishlistResponse | null;
  initialCart: CartResponse | null;
}


export default function WishlistClient({ initialWishlist, initialCart }: WishlistClientProps) {
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(initialWishlist);
  const [cart, setCart] = useState<CartResponse | null>(initialCart);

  // Simple helper
  const getItemQuantity = useCallback((productId: number) => {
    const item = cart?.items?.find(i => i.productId === productId);
    return item?.quantity || 0;
  }, [cart]);

  const handleMoveToCart = useCallback(async (productId: number, itemId: number) => {
    setUpdatingId(itemId);
    startTransition(async () => {
      try {
       
        const { wishlist: updatedWishlist, cart: updatedCart } = await moveToCartFromWishlist(productId, 1);
        
        setWishlist(updatedWishlist);
        setCart(updatedCart);
      } catch (error) {
        console.error('Failed to move to cart:', error);
        toast.error('Could not move to cart');
      } finally {
        setUpdatingId(null);
      }
    });
  }, []);

  const handleRemoveItem = useCallback(async (itemId: number, productId: number) => {
    setUpdatingId(itemId);
    
    startTransition(async () => {
      try {
        const updatedWishlist = await removeFromWishlist(productId);
        setWishlist(updatedWishlist);
      } catch (error) {
        console.error('Failed to remove item:', error);
        toast.error('Could not remove item');
      } finally {
        setUpdatingId(null);
      }
    });
  }, []);

  // Empty state
  if (!wishlist || wishlist.items.length === 0) {
    return (
      <EmptyWishlist
        message="Your wishlist is empty"
        description="Save your favorite items here by tapping the heart icon on products"
        buttonText="Browse Products"
        buttonLink="/products"
      />
    );
  }

  const items = wishlist.items;
  const count = wishlist.totalItems;

  return (
    <div className="wl-page">
      <div className="wl-container">
        <div className="wl-header">
          <div className="wl-header-left">
            <h1 className="wl-title">Wishlist</h1>
            <span className="wl-count">{count} {count === 1 ? 'item' : 'items'}</span>
          </div>
          <Link href="/products" className="wl-browse-link">
            Browse products
            <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="wl-grid">
          {items.map((item, idx) => {
            const availableStock = item.stock - getItemQuantity(item.productId);
            const canAddToCart = item.inStock && availableStock > 0;

            return (
              <div key={item.id} className="wl-card" style={{ animationDelay: `${idx * 0.06}s` }}>
                <Link href={`/${item.categorySlug}/${item.productSlug}`} className="wl-img-wrap">
                  <img src={item.mainImage} alt={item.productName} className="wl-img" />
                  {item.isOnSale && item.salePrice && (
                    <span className="wl-badge-sale">−{item.discountPercent}%</span>
                  )}
                  <button
                    className="wl-remove-overlay"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      handleRemoveItem(item.id, item.productId); 
                    }}
                    disabled={updatingId === item.id || isPending}
                  >
                    {updatingId === item.id && isPending ? (
                      <span className="cp-spinner" />
                    ) : (
                      <Trash2 size={13} strokeWidth={1.5} />
                    )}
                  </button>
                </Link>

                <div className="wl-body">
                  {item.categoryName && <span className="wl-category">{item.categoryName}</span>}
                  <Link href={`/${item.categorySlug}/${item.productSlug}`} className="wl-name">
                    {item.productName}
                  </Link>
                  <div className="wl-price-row">
                    {item.isOnSale && item.salePrice ? (
                      <>
                        <span className="wl-price wl-price--sale">${item.salePrice}</span>
                        <span className="wl-price-original">${item.price}</span>
                      </>
                    ) : (
                      <span className="wl-price">${item.price}</span>
                    )}
                  </div>
                  <div className={`wl-stock ${item.inStock ? 'wl-stock--in' : 'wl-stock--out'}`}>
                    <span className={`wl-stock-dot ${item.inStock ? 'wl-stock-dot--in' : 'wl-stock-dot--out'}`} />
                    {item.inStock ? 'In stock' : 'Out of stock'}
                  </div>
                  <div className="wl-actions">
                    {item.inStock && (
                      <button
                        className="wl-btn-cart"
                        onClick={() => handleMoveToCart(item.productId, item.id)}
                        disabled={!canAddToCart || updatingId === item.id || isPending}
                      >
                        {updatingId === item.id && isPending ? (
                          <span className="cp-spinner" />
                        ) : (
                          <ShoppingCart size={13} strokeWidth={1.5} />
                        )}
                        {canAddToCart ? 'Move to cart' : 'Out of stock'}
                      </button>
                    )}
                    <button
                      className={`wl-btn-remove ${!item.inStock ? 'wl-btn-remove--full' : ''}`}
                      onClick={() => handleRemoveItem(item.id, item.productId)}
                      disabled={updatingId === item.id || isPending}
                    >
                      {updatingId === item.id && isPending ? (
                        <span className="cp-spinner" />
                      ) : (
                        <Trash2 size={13} strokeWidth={1.5} />
                      )}
                      {!item.inStock && <span>Remove</span>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}