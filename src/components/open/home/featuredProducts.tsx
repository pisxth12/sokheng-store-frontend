"use client"
import { ProductGrid } from "@/components/open/products/ProductGrid";
import { Product } from "@/types/open/product.type";
import { useTranslations } from 'next-intl'; 
import { memo,  useMemo } from "react";

interface FeaturedProductsProps {
  products: Product[];
}


const FeaturedProducts = memo(function FeaturedPage({ products }: FeaturedProductsProps) {
    const t = useTranslations('FeaturedPage');
    
  
    const containerClass = useMemo(() => 
        "mx-auto max-w-primary py-8 ", 
    []);

   

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