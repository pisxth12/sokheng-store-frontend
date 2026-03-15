'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTopCategories } from '@/hooks/open/useTopCategories';
import { TopCategory } from '@/types/open/category.type';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { memo, useMemo, useState } from 'react';



interface TopCategoriesProps {
  categories: TopCategory[]; // get from Server
}


export const TopCategories = memo(function TopCategories({ categories }: TopCategoriesProps) {
    const t = useTranslations('FeaturedPage');

  
    const gridClass = useMemo(() => 
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", 
    []);



    // Empty state
    if (!categories.length) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No categories available</p>
            </div>
        );
    }

    return (
        <section className="max-w-primary mx-auto  py-12">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Top Categories
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Shop our most popular categories
                </p>
            </div>

            {/* Categories Grid */}
            <div className={gridClass}>
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </section>
    );
});

// Extracted component for better performance
const CategoryCard = memo(function CategoryCard({ category }: { category: any }) {
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/categories/${category.slug}`}
            prefetch={false}
            className="group relative overflow-hidden aspect-square "
        >
            {/* Image with fallback */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <img
                src={imgError ? '/placeholder-category.jpg' : (category.image || '/placeholder-category.jpg')}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onLoad={(e) => {
                    (e.target as HTMLImageElement).previousSibling?.remove();
                }}
                onError={() => setImgError(true)}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 className="text-lg font-semibold text-white bg-black px-3   inline-block">
                    {category.name}
                </h3>
            </div>
        </Link>
    );
});