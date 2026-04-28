import { publicProductApi } from "@/lib/open/products";
import { PageResponse, Product } from "@/types/open/product.type";
import { useCallback, useEffect } from "react";
import { useProducts } from "./useProducts";

export const useBrandProducts = (
    slug: string,
    initialData?: PageResponse<Product>
) =>{
    const fetchBranProducts = useCallback(async (page: number) => {
        return await publicProductApi.getProductsByBrand(slug, page, 32);
    },[slug]);
    const hookReturn = useProducts(fetchBranProducts);
    
    // Set initial data if provided
    useEffect(() => {
        if (initialData && hookReturn.products.length === 0) {
            // Manually set initial data
            hookReturn.products = initialData.content;
            hookReturn.total = initialData.totalElements
            hookReturn.hasMore = !initialData.last;
        }
    },[initialData]);

    return hookReturn;
}