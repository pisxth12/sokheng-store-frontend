"use client"
import { ShoppingCart, User, Search, Heart } from "lucide-react";
import Link from "next/link";

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
  // onCartClick,
  initialCount,
  initialWishlistCount,
  isLoading = false,
}: Props) {

  const displayCartCount = initialCount;
  const displayWishlistCount = initialWishlistCount;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Search Icon */}
      <button
        onClick={onSearchClick}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Wishlist Icon */}
      <Link 
        href="/wishlist"
        prefetch={false} 
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition relative"
      >
        <Heart className="w-5 h-5" />
        {displayWishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {displayWishlistCount > 99 ? "99+" : displayWishlistCount}
          </span>
        )}
      </Link>

      {/* Cart Icon */}
      <Link
        href="/cart"
        prefetch={false}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition relative"
        aria-label="Cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {displayCartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {displayCartCount > 99 ? '99+' : displayCartCount}
          </span>
        )}
      </Link>

      {userData ? (
        <Link
            href="/account"
            prefetch={false}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
            aria-label="My Account"
          >
            <User className="w-5 h-5" />
          </Link>
          ) : (
            <Link
                href="/login"
                className="px-2 py-2 text-sm font-medium  transition duration-200 "
              >
                Sign In
            </Link>
          )}
    </div>
  );
}