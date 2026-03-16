"use client"
import { useRelatedProducts } from "@/hooks/open/useRelatedProducts";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "../css/relatedProducts.css"; 
import { useTranslations } from "next-intl";

interface RelatedProductProps {
    productId: number;
    initialSize?: number;

}

export default function RelatedProduct({
    productId,
    initialSize = 8,
    
    
}: RelatedProductProps) {
    const { products, loading, loadingMore, hasMore, loadMore, total } =
        useRelatedProducts(productId, initialSize, );

    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(4);
    const isLoadingMore = useRef(false);
    
    const t = useTranslations('RelatedProduct'); 

    // Calculate items per view based on screen size
    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerView(4);
            } else if (window.innerWidth >= 640) {
                setItemsPerView(3);
            } else {
                setItemsPerView(2);
            }
        };
        
        updateItemsPerView();
        window.addEventListener("resize", updateItemsPerView);
        return () => window.removeEventListener("resize", updateItemsPerView);
    }, []);

    // Calculate scroll position and update active index
    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || products.length === 0) return;
        
        const scrollLeft = el.scrollLeft;
        const containerWidth = el.clientWidth;
        const totalWidth = el.scrollWidth;
        
        // Update arrow visibility
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < totalWidth - containerWidth - 10);

        // Calculate active index based on scroll position
        const cardWidth = totalWidth / products.length;
        const newIndex = Math.min(
            Math.floor(scrollLeft / cardWidth),
            products.length - itemsPerView
        );
        
        if (newIndex !== activeIndex) {
            setActiveIndex(Math.max(0, newIndex));
        }

        // Load more when near the end
        if (hasMore && !loadingMore && !isLoadingMore.current) {
            const threshold = 200; // pixels from end
            if (totalWidth - (scrollLeft + containerWidth) < threshold) {
                isLoadingMore.current = true;
                loadMore().finally(() => {
                    isLoadingMore.current = false;
                });
            }
        }
    }, [products.length, itemsPerView, hasMore, loadingMore, loadMore, activeIndex]);

    // Add scroll event listener
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        
        el.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check
        
        return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Scroll to specific index
    const scrollToIndex = useCallback((index: number) => {
        const el = scrollRef.current;
        if (!el) return;
        
        const targetIndex = Math.min(Math.max(0, index), products.length - itemsPerView);
        const cardWidth = el.scrollWidth / products.length;
        
        el.scrollTo({
            left: targetIndex * cardWidth,
            behavior: "smooth"
        });
        
        setActiveIndex(targetIndex);
    }, [products.length, itemsPerView]);

    const handlePrev = () => scrollToIndex(activeIndex - itemsPerView);
    const handleNext = () => scrollToIndex(activeIndex + itemsPerView);

    // Unique key for each product
    const getProductKey = useCallback((product: any, index: number) => {
        return `${product.id}-${product.slug || index}-${index}`;
    }, []);

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="sr-only">{t('loading')}</span>
            </div>
        );
    }
    
    if (products.length === 0) return null;

    return (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('title')}
                </h2>
                {total > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {activeIndex + 1}–{Math.min(activeIndex + itemsPerView, products.length)} {t('of')} {total}
                    </span>
                )}
            </div>

            {/* Carousel wrapper */}
            <div className="relative">
                {/* Left arrow */}
                <button
                    onClick={handlePrev}
                    disabled={!canScrollLeft}
                    className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg items-center justify-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-xl hover:scale-110 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                    aria-label={t('previous')}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right arrow */}
                <button
                    onClick={handleNext}
                    disabled={!canScrollRight}
                    className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg items-center justify-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-xl hover:scale-110 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                    aria-label={t('next')}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Scroll container */}
                <div
                    ref={scrollRef}
                    className="no-scrollbar flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory touch-pan-x scroll-smooth"
                >
                    {products.map((product, index) => (
                        <div
                            key={getProductKey(product, index)}
                            className={`
                                snap-start flex-none transition-all duration-300 ease-out
                                ${itemsPerView === 4 ? 'w-[calc(25%-12px)]' : ''}
                                ${itemsPerView === 3 ? 'w-[calc(33.333%-12px)]' : ''}
                                ${itemsPerView === 2 ? 'w-[calc(50%-8px)]' : ''}
                                hover:scale-[1.03] hover:-translate-y-1
                            `}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading more */}
            {loadingMore && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('loadingMore')}
                    </p>
                </div>
            )}
        </div>
    );
}