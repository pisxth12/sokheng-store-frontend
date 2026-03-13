"use client"
import { ProductGrid } from "@/components/open/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useFeatureProducts } from "@/hooks/open/useFeaturedProducts"
import { useTranslations } from 'next-intl'; 

export const FeaturedPage = () => {
    const t = useTranslations('FeaturedPage'); 
    const { products, loading, error } = useFeatureProducts();

    if (loading) return <LoadingSpinner message={t('loading')} />; 
    
    if (error) return (
        <div className="text-center text-red-500 py-10">
            {t('error')} 
        </div>
    );
    
    return (
        <div className=" mx-auto  max-w-primary  py-8">
            <h1 className="text-2xl font-bold mb-6">
                {t('title')}
            </h1>
            <ProductGrid products={products} />
        </div>
    );
}