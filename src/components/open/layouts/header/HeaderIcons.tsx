"use client";
import { ShoppingCart, User, Search, Heart } from "lucide-react";
import Link from "next/link";
import './Header.css';

interface Props {
  onSearchClick: () => void;
  userData: any;
  initialCount: number;
  initialWishlistCount: number;
  isLoading?: boolean;
}

export default function HeaderIcons({
  userData,
  onSearchClick,
  initialCount,
  initialWishlistCount,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="hd-icons">
        {[0,1,2,3].map(i => <span key={i} className="hd-skeleton" />)}
      </div>
    );
  }

  return (
    <div className="hd-icons">

      {/* Search */}
      <button className="hd-icon-btn" onClick={onSearchClick} aria-label="Search">
        <Search size={18} strokeWidth={1.5} />
      </button>

      {/* Wishlist */}
      <Link href="/wishlist" prefetch={false} className="hd-icon-btn" aria-label="Wishlist">
        <Heart size={18} strokeWidth={1.5} />
        {initialWishlistCount > 0 && (
          <span className="hd-badge">
            {initialWishlistCount > 99 ? '99+' : initialWishlistCount}
          </span>
        )}
      </Link>

      {/* Cart */}
      <Link href="/cart" prefetch={false} className="hd-icon-btn" aria-label="Cart">
        <ShoppingCart size={18} strokeWidth={1.5} />
        {initialCount > 0 && (
          <span className="hd-badge">
            {initialCount > 99 ? '99+' : initialCount}
          </span>
        )}
      </Link>

      {/* Account / Sign in */}
      {userData ? (
        <Link href="/account" prefetch={false} className="hd-icon-btn" aria-label="Account">
          <User size={18} strokeWidth={1.5} />
        </Link>
      ) : (
        <Link href="/login" className="hd-signin">Sign in</Link>
      )}

    </div>
  );
}