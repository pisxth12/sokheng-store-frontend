import { publicProductApi } from "@/lib/open/products";
import { PageResponse } from "@/types/admin/product.type";
import { Product } from "@/types/open/product.type";
import { useEffect } from "react";
import { useProducts } from "./useProducts";

export const useCategoryProducts = (
    slug: string,
    initialData?: PageResponse<Product>
) =>{

    const fetchCategoryProducts = async (page: number) => {
    return await publicProductApi.getProductsByCategory(slug, page, 32);
  };

  const hookReturn = useProducts(fetchCategoryProducts);

  // Set initial data if provided
  useEffect(() => {
    if (initialData && hookReturn.products.length === 0) {
      // Manually set initial data
      hookReturn.products = initialData.content;
      hookReturn.total = initialData.totalElements;
      hookReturn.hasMore = !initialData.last;
    }
  }, [initialData]);

  return hookReturn;
}