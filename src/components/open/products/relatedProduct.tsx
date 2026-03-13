"use client"
import { useRelatedProducts } from "@/hooks/open/useRelatedProducts";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useState, useEffect, useRef, useCallback } from "react";
import "../css/relatedProducts.css"; 
import { useTranslations } from "next-intl";

interface RelatedProductProps {
    productId: number;
    initialSize?: number;
    loadMoreSize?: number;
}

export default function RelatedProduct({
    productId,
    initialSize = 8,
}: RelatedProductProps) {
    const { products, loading, loadingMore, hasMore, loadMore, total } =
        useRelatedProducts(productId, initialSize);


    const scrollRef = useRef<HTMLDivElement>(null);
    const [activePage, setActivePage] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(2);
    
    const t = useTranslations('RelatedProduct'); 
    
    const totalPages = Math.ceil(products.length / itemsPerView);

    useEffect(() => {
        const update = () => setItemsPerView(window.innerWidth >= 1024 ? 4 : 2);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const onScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);

        const cardWidth = el.scrollWidth / products.length;
        const page = Math.round(el.scrollLeft / (cardWidth * itemsPerView));
        setActivePage(Math.min(page, totalPages - 1));

        if (
            el.scrollLeft + el.clientWidth >= el.scrollWidth - cardWidth * 2 &&
            hasMore &&
            !loadingMore
        ) {
            loadMore();
        }
    }, [products.length, itemsPerView, totalPages, hasMore, loadingMore, loadMore]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        
        el.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        
        return () => el.removeEventListener("scroll", onScroll);
    }, [onScroll]);

    const scrollToPage = (page: number) => {
        const el = scrollRef.current;
        if (!el) return;
        
        const cardWidth = el.scrollWidth / products.length;
        el.scrollTo({ left: page * cardWidth * itemsPerView, behavior: "smooth" });
    };

    const handleNext = () => scrollToPage(activePage + 1);
    const handlePrev = () => scrollToPage(activePage - 1);

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
                          {activePage * itemsPerView + 1}–{Math.min((activePage + 1) * itemsPerView, products.length)} {t('of')} {total} 
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
                    className="no-scrollbar flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory touch-pan-x"
                >
                    {products.map((product,index) => (
                        <div
                             key={`${product.id}-${index}`}
                            className="snap-start flex-none w-[calc(50%-8px)] lg:w-[calc(25%-12px)] transition-transform duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}

                    {/* Spacer */}
                    <div className="flex-none w-1" aria-hidden />
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