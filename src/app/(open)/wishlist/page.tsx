'use client';

import EmptyWishlist from '@/components/open/wishlists/EmptyWishlist';
import { useWishlist } from '@/hooks/open/useWishlist';
import Error from '@/components/ui/Error';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/open/useCart';
import toast from 'react-hot-toast';
import { useCallback, useEffect, useRef } from 'react';
import './WishlistPage.css';

const WishlistPage = () => {
  const { items, count, loading, error, removeItem, moveToCart, loadWishlist, isLoaded } = useWishlist();
  const { refreshCart, getItemQuantity } = useCart();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded && !hasLoaded.current) {
      hasLoaded.current = true;
      loadWishlist();
    }
  }, [loadWishlist, isLoaded]);

  const handleMoveToCart = useCallback(async (productId: number) => {
    const success = await moveToCart(productId, 1);
    if (success) {
      await refreshCart();
      toast.success('Moved to cart');
    } else {
      toast.error('Could not move to cart');
    }
  }, [moveToCart, refreshCart]);

  if (loading && !isLoaded) return <LoadingSpinner />;
  if (error) return <Error error={error} />;
  if (items.length === 0) return (
    <EmptyWishlist
      message="Your wishlist is empty"
      description="Save your favorite items here by tapping the heart icon on products"
      buttonText="Browse Products"
      buttonLink="/products"
    />
  );

  return (
    <div className="wl-page">
      <div className="wl-container">

        {/* ── Header ── */}
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

        {/* ── Grid ── */}
        <div className="wl-grid">
          {items.map((item, idx) => {
            const availableStock = item.stock - getItemQuantity(item.productId);
            const canAddToCart = item.inStock && availableStock > 0;

            return (
              <div
                key={item.id}
                className="wl-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                {/* Image */}
                <Link href={`/${item.categorySlug}/${item.productSlug}`} className="wl-img-wrap">
                  <img src={item.mainImage} alt={item.productName} className="wl-img" />

                  {/* Sale badge */}
                  {item.isOnSale && item.salePrice && (
                    <span className="wl-badge-sale">−{item.discountPercent}%</span>
                  )}

                  {/* Remove hover overlay */}
                  <button
                    className="wl-remove-overlay"
                    onClick={(e) => { e.preventDefault(); removeItem(item.productId); }}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </Link>

                {/* Body */}
                <div className="wl-body">
                  {item.categoryName && (
                    <span className="wl-category">{item.categoryName}</span>
                  )}

                  <Link href={`/${item.categorySlug}/${item.productSlug}`} className="wl-name">
                    {item.productName}
                  </Link>

                  {/* Price */}
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

                  {/* Stock */}
                  <div className={`wl-stock ${item.inStock ? 'wl-stock--in' : 'wl-stock--out'}`}>
                    <span className={`wl-stock-dot ${item.inStock ? 'wl-stock-dot--in' : 'wl-stock-dot--out'}`} />
                    {item.inStock ? 'In stock' : 'Out of stock'}
                  </div>

                  {/* Actions */}
                  <div className="wl-actions">
                    {item.inStock && (
                      <button
                        className="wl-btn-cart"
                        onClick={() => handleMoveToCart(item.productId)}
                        disabled={!canAddToCart}
                      >
                        <ShoppingCart size={13} strokeWidth={1.5} />
                        {canAddToCart ? 'Move to cart' : 'Out of stock'}
                      </button>
                    )}

                    <button
                      className={`wl-btn-remove ${!item.inStock ? 'wl-btn-remove--full' : ''}`}
                      onClick={() => removeItem(item.productId)}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
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
};

export default WishlistPage;