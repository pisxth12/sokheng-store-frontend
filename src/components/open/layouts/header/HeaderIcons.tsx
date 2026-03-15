"use client"
import { useAuth } from "@/hooks/open/useAuth";
import { useCart } from "@/hooks/open/useCart";
import { useWishlist } from "@/hooks/open/useWishlist";
import { ShoppingCart, User, Search, Menu, Heart } from "lucide-react";
import Link from "next/link";

interface Props {
  onSearchClick: () => void;
  onCartClick: () => void;
  initialCount: number;
}

export default function HeaderIcons({
  onSearchClick,
  onCartClick,
  initialCount,
}: Props) {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { count: itemCountInWishlist } = useWishlist();

   const displayCount = itemCount || initialCount;


  return (
    <div className="flex items-center gap-2">
      {/*  Search Icon */}
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
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition relative"
       
      >
        <Heart className="w-5 h-5" />
        {itemCountInWishlist > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ">
            {itemCountInWishlist > 99 ? "99+" : itemCountInWishlist}
          </span>
        )}
      </Link>

      {/* Cart Icon */}
      <button
        onClick={onCartClick}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition relative"
        aria-label="Cart"
      >
        <ShoppingCart className="w-5 h-5" />
         {displayCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {displayCount > 99 ? '99+' : displayCount}
          </span>
        )}
      </button>

       {/*  User Icon / Sign In Button */}
      {isAuthenticated ? (
        <Link
          href="/account"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
          aria-label="My Account"
        >
          <User className="w-5 h-5" />
        </Link>
      ) : (
        <Link
          href="/login"
          className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition"
        >
          Sign In
        </Link>
      )}

     
    </div>
  );
}
