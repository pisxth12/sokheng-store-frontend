'use client';

import { useParams } from 'next/navigation';
import { useProducts } from '@/hooks/open/useProducts';
import { publicProductApi } from '@/lib/api/open/products';
import { ProductGrid } from '@/components/open/products/ProductGrid';
import { useEffect, useState } from 'react';
import { Product } from '@/types/open/product.type';

export default function CategoryPage() {
    const params = useParams(); 
    const slug = params.slug as string;
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await publicProductApi.getProductsByCategory(slug, 0, 32);
                setProducts(data.content);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [slug]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Category: {slug}</h1>
            <ProductGrid products={products} />
        </div>
    );
}