'use client';

import { TopCategory } from '@/types/open/category.type';
import { useTranslations } from 'next-intl';
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


    if (categories.length < 1) return null;

    return (
        <section className="max-w-primary px-primary mx-auto  py-12">
            {/* Categories Grid */}
            <div className={gridClass}>
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </section>
    );
});

