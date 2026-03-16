'use client';

import { TopCategory } from '@/types/open/category.type';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { memo, useMemo, useState } from 'react';
import { CategoryCard } from '../categories/CategoryCard';



interface TopCategoriesProps {
  categories: TopCategory[]; 
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

