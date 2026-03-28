// app/actions/product.actions.ts
"use server";

import { apiServerService } from "@/lib/api/server";
import { Product } from "@/types/open/product.type";

export async function loadMoreRelatedProducts(
  productId: number,
  page: number,
  size: number
): Promise<{
  products: Product[];
  hasMore: boolean;
  total: number;
}> {
  try {
    const { data } = await apiServerService.get<{
      content: Product[];
      totalElements: number;
      last: boolean;
    }>(`/products/${productId}/related?page=${page}&size=${size}`);
    
    return {
      products: data.content,
      hasMore: !data.last,
      total: data.totalElements,
    };
  } catch (error) {
    console.error("Error loading more related products:", error);
    return {
      products: [],
      hasMore: false,
      total: 0,
    };
  }
}