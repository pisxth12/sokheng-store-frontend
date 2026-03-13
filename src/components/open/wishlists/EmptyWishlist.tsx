import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface EmptyWishlistProps {
    message?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
}

const EmptyWishlist: React.FC<EmptyWishlistProps> = ({
    message = "Your wishlist is empty",
    description = "Save your favorite items here",
    buttonText = "Continue Shopping",
    buttonLink = "/products"
}) => {
    return (
        <div className="flex flex-col items-center h-screen justify-center py-16 px-4 text-center">
            <Heart 
                size={64} 
                className=" mb-4"
                strokeWidth={1.5}
            />
            
            <h2 className="text-2xl font-semibold  mb-2">
                {message}
            </h2>
            
            <p className=" mb-8 max-w-md">
                {description}
            </p>
            
            <Link 
                href={buttonLink}
                className="px-6 py-3 border   transition-colors"
            >
                {buttonText}
            </Link>
        </div>
    );
};

export default EmptyWishlist;