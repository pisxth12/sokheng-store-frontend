"use client"
import { publicProductApi } from "@/lib/api/open/products";
import { Product } from "@/types/open/product.type"
import { useEffect, useState } from "react"

export const useFeatureProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchFeaturedProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await publicProductApi.getFeatured();
            setProducts(res);
        } catch (err: any) {
            setError('Failed to load featured products');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    return { products, loading, error, fetchFeaturedProducts }; 
}

