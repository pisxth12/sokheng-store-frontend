// components/brands/BrandCard.tsx
'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import type { Brand } from '@/types/open/brand.type';
import Image from 'next/image';

interface BrandCardProps {
    brand: Brand;
}

export const BrandCard = memo(function BrandCard({ brand }: BrandCardProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/${brand.slug}`}
            prefetch={false}
            className="group relative block overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                {/* Skeleton Loader */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer" />
                
                {/* Brand Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={imgError ? '/placeholder-brand.jpg' : (brand.logoUrl || '/placeholder-brand.jpg')}
                        alt={brand.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onLoadingComplete={(img) => {
                            img.previousElementSibling?.remove();
                        }}
                        onError={() => setImgError(true)}
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Brand Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-center truncate">
                        {brand.name}
                    </h3>
                    {brand.name && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 text-center mt-1">
                            {brand.name} products
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
});

BrandCard.displayName = 'BrandCard';