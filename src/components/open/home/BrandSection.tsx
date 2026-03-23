// components/brands/BrandSection.tsx
'use client';

import { useRef } from 'react';
import { BrandCard } from "../brands/BrandCard";
import { Brand } from "@/types/open/brand.type";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface brands {
    brands: Brand[];
}

export function BrandSection({ brands }: brands) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!brands.length) {
        return null;
    }

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleDoubleClick = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="max-w-primary px-primary mx-auto py-12 relative ">
            <div className="relative group">
                {/* Navigation Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-0"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    onDoubleClick={handleDoubleClick}
                    className="overflow-x-auto scroll-smooth hide-scrollbar"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    <div className="flex gap-4">
                        {brands.map((brand) => (
                            <div key={brand.id} className="flex-none w-1/2 sm:w-1/3 lg:w-1/4">
                                <BrandCard brand={brand} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}