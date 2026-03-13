"use client"
import { useWishlist } from '@/hooks/open/useWishlist';
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
    productId: number;
    className?: string;
    onToggle?: (inWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
    productId, 
    className = '',
    onToggle 
}) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);
    const { checkItem, toggleItem } = useWishlist();

    useEffect(() => {
        checkStatus();
    }, [productId]);

    const checkStatus = async () => {
        const status = await checkItem(productId);
        setIsInWishlist(status);
    };

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setLoading(true);
        const success = await toggleItem(productId, isInWishlist);
        if (success) {
            const newStatus = !isInWishlist;
            setIsInWishlist(newStatus);
            onToggle?.(newStatus);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={` rounded-full flex items-center justify-center transition-all duration-200 ${
                isInWishlist 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-gray-600'
            } ${className}`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {loading ? (
                <Heart className="w-5 h-5 animate-pulse" />
            ) : (
                <Heart 
                    className={`w-6 h-6 transition-transform hover:scale-110 ${
                        isInWishlist ? 'fill-red-500' : ''
                    }`} 
                />
            )}
        </button>
    );
};

export default WishlistButton;