
import { useRouter } from 'next/navigation';
import React from 'react';

const EmptyCart = () => {
    const router = useRouter();


    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            {/* Shopping Bag Icon */}
            <div className="mb-8">
                <svg 
                    className="w-40 h-40 text-gray-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.2} 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                </svg>
            </div>

            {/* Message */}
            <h2 className="text-3xl font-bold  mb-3">
                Your Cart is Empty
            </h2>
            
            <p className="text-lg mb-8 text-center max-w-md">
                Looks like you haven't added anything yet. 
                Let's find something special for you!
            </p>

            {/* Shop Now Button */}
            <button
                onClick={ ()=> router.push('/products')}
                className="px-8 py-4 bg-linear-to-r  
                         text-white text-lg font-semibold 
                         border-2
                         transform transition-all duration-300 
                         hover:scale-105 hover:shadow-xl
                         focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
                 Shop Now
            </button>
            
        </div>
    );
};

export default EmptyCart;