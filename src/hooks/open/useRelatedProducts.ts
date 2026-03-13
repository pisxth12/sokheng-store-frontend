
import { Product } from "@/types/admin/product.type";
import { useCallback, useEffect, useState } from "react";
import { publicProductApi } from "../../lib/api/open/products";

interface UseRelatedProductsReturn {
    products: Product[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    total: number;
    loadMore: () => void;
    reset: () => void;
};


export const useRelatedProducts = (productId: number, pageSize: number = 4): UseRelatedProductsReturn=> {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);


    // first load
    useEffect(() => {
        if(!productId) return;
        setLoading(true);
        const fetchInitial = async () => {
            try{
                const data = await publicProductApi.getRelatedProducts(productId, 0, pageSize);
                 setProducts(data.content);
                setHasMore(!data.last);
                setTotal(data.totalElements);
                setPage(1);
            }catch(error){
                console.error("Error fetching related products:", error);
            }finally{
                setLoading(false);
            }
        };
        fetchInitial();
    },[productId, pageSize])


    //Load more
    const loadMore = useCallback(async () => {
        if (loadingMore && !hasMore && !productId) return;
        setLoading(true);
        try{
            const data = await publicProductApi.getRelatedProducts(productId, page, pageSize);
            setProducts((prev) => [...prev, ...data.content]);
            setHasMore(!data.last);
            setPage((prev) => prev + 1);
        }catch(error){
            console.error("Error loading more related products:", error);
        }finally{
            setLoading(false);
        }
    }, [loadingMore, hasMore, productId, page, pageSize])

    const reset = useCallback(() => {
       setProducts([]);
        setPage(0);
        setHasMore(true);
        setLoading(true);
        if(productId){
              publicProductApi.getRelatedProducts(productId, 0, pageSize)
                .then(data => {
                    setProducts(data.content);
                    setHasMore(!data.last);
                    setTotal(data.totalElements);
                    setPage(1);
                })
                .finally(() => setLoading(false));
        
        }
    }, [productId, pageSize]);

    return {
        products,
        loading,
        loadingMore,
        hasMore,
        total,
        loadMore,
        reset
    };

}