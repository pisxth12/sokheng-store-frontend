// components/brands/BrandCard.tsx
'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import type { Brand } from '@/types/open/brand.type';

interface BrandCardProps {
    brand: Brand;
}

export const BrandCard = memo(function BrandCard({ brand }: BrandCardProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/brands/${brand.slug}`}
            prefetch={false}
            className="group relative overflow-hidden aspect-square rounded-lg"
        >
            {/* Skeleton loader */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
            
            {/* Brand Image */}
            <img
                src={imgError ? '/placeholder-brand.jpg' : (brand.logoUrl || '/placeholder-brand.jpg')}
                alt={brand.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onLoad={(e) => {
                    (e.target as HTMLImageElement).previousSibling?.remove();
                }}
                onError={() => setImgError(true)}
            />
            
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Brand Name at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 className="text-lg font-semibold text-white bg-black/80 px-3 py-1 inline-block rounded">
                    {brand.name}
                </h3>
            </div>
        </Link>
    );
});

BrandCard.displayName = 'BrandCard';