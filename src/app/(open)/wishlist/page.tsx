'use client';

import EmptyWishlist from '@/components/open/wishlists/EmptyWishlist';
import { useWishlist } from '@/hooks/open/useWishlist';
import Error from '@/components/ui/Error';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ShoppingCart, Trash2, Heart, Minus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/open/useCart';
import toast from 'react-hot-toast';
import { useCallback, useEffect, useRef } from 'react';

const WishlistPage = () => {
    const { items, count, loading, error, removeItem, moveToCart , loadWishlist, isLoaded} = useWishlist();
    const {  refreshCart , getItemQuantity } = useCart();
    const hasLoaded = useRef(false); 
   
    useEffect(() => {
        if (!isLoaded && !hasLoaded.current) {
             hasLoaded.current = true;
            loadWishlist();

        }
    }, [loadWishlist, isLoaded]);

    const handleMoveToCart = useCallback(async (productId: number, quantity: number = 1) => {
        const success = await moveToCart(productId,quantity);
        if (success) {
             await refreshCart();
              toast.success('Item moved to cart!');
        }else{
            toast.error('Failed to move item to cart.');
        }
    }, [moveToCart, refreshCart])


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
        <div className="min-h-screen py-8">
            <div className=" mx-auto px-4 ">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className=" p-2 rounded-lg">
                            <Heart className="w-10 h-10 " />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold ">
                            My Wishlist
                        </h1>
                        <span className="  px-3 py-1 rounded-full text-sm font-medium">
                            {count} {count === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    <Link href="/products" className="font-medium flex items-center gap-2">
                        Continue Shopping
                        <span className="text-xl">→</span>
                    </Link> 
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div 
                            key={item.id} 
                            className="border relative border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                        >
                            {/* Image Container */}
                            <Link href={`/products/${item.productSlug}`} className="block relative aspect-square overflow-hidden ">
                                <img
                                    src={item.mainImage}
                                    alt={item.productName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                
                               
                            </Link>
                            {item.isOnSale && item.salePrice && (
                                    <span className='absolute text-white top-3 right-3 z-10 bg-red-500 px-3'>
                                    -{item.discountPercent}%
                                    </span>
                                )}

                            {/* Content */}
                            <div className="p-4">
                                {/* Product Name */}
                                <Link href={`/products/${item.productSlug}`}>
                                    <h3 className="font-semibold  mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                                        {item.productName}
                                    </h3>
                                </Link>
      
                                {/* Price */}
                                    <div className="flex items-baseline gap-2 mb-4">
                                        {item.isOnSale ? (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xl font-bold text-red-600">
                                                    ${item.salePrice}
                                                </span>
                                                <span className="text-sm text-gray-500 line-through">
                                                    ${item.price}
                                                    
                                                </span>
                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                                    {item.discountPercent}% OFF
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xl font-bold ">
                                                ${item.price}
                                            </span>
                                        )}
                                    </div>
                               

                                {/* Stock Status */}
                                <div className="mb-4">
                                    {item.inStock ? (
                                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                                            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {item.inStock && (
                                    <button
                                        onClick={() => handleMoveToCart(item.productId)}
                                        disabled={item.stock - getItemQuantity(item.productId) <= 0}
                                        className={`flex-1 py-2.5 px-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                                            item.stock - getItemQuantity(item.productId) > 0
                                                ? 'bg-black text-white hover:bg-gray-800'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        {item.stock - getItemQuantity(item.productId) > 0 ? 'Move to Cart' : 'Out of Stock'}
                                    </button>
                                )}
                                    
                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className={`${
                                            item.inStock ? 'w-12' : 'flex-1'
                                        } bg-gray-100 hover:bg-gray-200  py-2.5 px-4  font-medium transition-colors flex items-center justify-center gap-2`}
                                            title="Remove from wishlist">
                                        <Trash2 className="w-4 h-4 text-darkbg" />
                                        {!item.inStock && <span>Remove</span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;