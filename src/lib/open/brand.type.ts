import { ProductsWithPriceRangeResponse } from "@/types/open/product.type";
import apiClient from "../api/client";
import { BrandFilterParams } from "@/types/open/product-filter.type";



export const publicBrandApi = {
     getProductsByBrandWithFilters: async (
    brandSlug:string,
    filters : BrandFilterParams= {}
  ): Promise<ProductsWithPriceRangeResponse> => {
    const params = new URLSearchParams();
    params.set("page", (filters.page ?? 0).toString());
    params.set("size", (filters.size ?? 32).toString());
    if (filters.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString());
    
    if(filters.categoryId !== undefined) params.set("categoryId", filters.categoryId.toString());
    if(filters.sortOrder){
      params.set("sortOrder", filters.sortOrder);
    }
    if(filters.sortBy){
      params.set("sortBy", filters.sortBy);
    }
    const res = await apiClient.get<ProductsWithPriceRangeResponse>(
      `/brands/${brandSlug}/products/filtered?${params.toString()}`
    )
    return res.data;
  },
}