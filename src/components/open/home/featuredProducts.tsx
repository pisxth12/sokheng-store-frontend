"use client"
import { ProductGrid } from "@/components/open/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useFeatureProducts } from "@/hooks/open/useFeaturedProducts"
import { useTranslations } from 'next-intl'; 
import { memo, useCallback, useMemo } from "react";

const FeaturedProducts = memo(function FeaturedPage() {
    const t = useTranslations('FeaturedPage');
    const { products, loading, error, refetch } = useFeatureProducts();
    
  
    const containerClass = useMemo(() => 
        "mx-auto max-w-primary py-8 ", 
    []);

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    
    if (loading) {
        return <LoadingSpinner message={t('loading')} />;
    }
    
    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">{t('error')}</p>
                <button 
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    {t('tryAgain')}
                </button>
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No Products Available</p>
            </div>
        );
    }

    return (
        <section className={containerClass}>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('title')}
                </h1>
             
            </div>
            <ProductGrid products={products} />
        </section>
    );
});

export default FeaturedProducts;