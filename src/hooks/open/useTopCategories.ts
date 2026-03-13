import { useState, useEffect, useCallback, useRef } from 'react';
import { publicCategoriesApi } from "@/lib/api/open/categories";
import { TopCategory } from "@/types/open/category.type";

interface ApiCategory {
    id: number;
    name: string;
    slug: string;
    image?: string | null; 
}

export const useTopCategories = (limit: number = 8) => {
    const [categories, setCategories] = useState<TopCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const abortControllerRef = useRef<AbortController | null>(null);
    const retryCountRef = useRef(0);


    const fetchCategories = useCallback(async (retry = false) => {
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    
        abortControllerRef.current = new AbortController();
        
        if (!retry) {
            setLoading(true);
        }
        setError("");
        
        try {
            const data = await publicCategoriesApi.getTop(limit, {
                signal: abortControllerRef.current.signal
            });
            
           
            const transformed = data.map((cat: ApiCategory) => ({
                ...cat,
                displayName: cat.name,
                image: cat.image || '/placeholder-category.jpg'
            }));
            
            setCategories(transformed);
            retryCountRef.current = 0;
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            if (retryCountRef.current < 3) {
                retryCountRef.current++;
                setTimeout(() => fetchCategories(true), 1000 * retryCountRef.current);
            } else {
                setError("Failed to load categories");
            }
        } finally {
            if (!retry) {
                setLoading(false);
            }
        }
    }, [limit]);

    useEffect(() => {
        fetchCategories();
        
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [fetchCategories]);

    return { 
        categories, 
        loading, 
        error, 
        retry: () => fetchCategories(true) 
    };
};