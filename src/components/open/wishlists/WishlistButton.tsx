"use client";
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { addToWishlist, removeFromWishlist } from '@/app/(open)/actions/wishlist.actions';

interface WishlistButtonProps {
    productId: number;
    initialIsInWishlist?: boolean;
    className?: string;
    onToggle?: (inWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
    productId, 
    initialIsInWishlist = false,
    className = '',
    onToggle 
}) => {
    const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);
       try{
          if(isInWishlist){
              await removeFromWishlist(productId);
            setIsInWishlist(false);
            onToggle?.(true)
          }else{
            await addToWishlist(productId);
            setIsInWishlist(true);
            onToggle?.(false)
          }
       }catch(error:any){
        console.log(error);
       }finally{
        setLoading(false);
       }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            className={`flex items-center justify-center cursor-pointer transition-all duration-200 ${className}`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {loading ? (
                <Heart className="w-5 h-5 animate-pulse" />
            ) : (
                <Heart 
                    className={`w-6 h-6 transition-transform hover:scale-110 ${
                        isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`} 
                />
            )}
        </div>
    );
};

export default WishlistButton;