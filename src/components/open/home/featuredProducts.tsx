// "use client"
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
        "mx-auto max-w-primary px-primary py-8 ", 
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
            <div className="text-start mb-8">
                <h1 className="max-w-primary px-primary text-3xl font-bold bg-linear-to-r   bg-clip-text ">
                    {t('title')}
                </h1>
             
            </div>
            <ProductGrid products={products} />
        </section>
    );
});

export default FeaturedProducts;