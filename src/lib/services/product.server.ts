// lib/api/product.server.ts
import "server-only";
import { apiServerService } from "../api/server";
import { Product, ProductDetail } from "@/types/open/product.type";

export async function getFeaturedProducts(): Promise<Product[]>{
  try {
    return (
      (await apiServerService.get<Product[]>("/products/featured", {
        cacheTime: 300, // 5 minite
      })) ?? []
    );
  } catch {
    return [];
  }
}


export async function getRelatedProducts(
  productId: number,
  page: number = 0,
  size: number = 8
) {
  try {
    const data = await apiServerService.get<{
      content: Product[];
      totalElements: number;
      last: boolean;
    }>(`/products/${productId}/related`, {
      cacheTime: 60 * 60, // Cache for 1 hour
    });
    
    return {
      products: data.content,
      total: data.totalElements,
      hasMore: !data.last,
    };
  } catch (error) {
    console.error("Error fetching related products:", error);
    return {
      products: [],
      total: 0,
      hasMore: false,
    };
  }
}

// Product by ID
export async function getProductById(id: number): Promise<Product | null> {
  try {
    return await apiServerService.get<Product>(`/products/${id}`, {
      cacheTime: 300,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Product by Slug
export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    return await apiServerService.get<ProductDetail>(`/products/slug/${slug}`, {
      cacheTime: 300,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

// Category Products
export async function getCategoryProducts(
  categorySlug: string,
  page: number = 0,
  size: number = 12
) {
  try {
    const data = await apiServerService.get<{
      content: Product[];
      totalElements: number;
      last: boolean;
    }>(`/categories/${categorySlug}/products?page=${page}&size=${size}`, {
      cacheTime: 300,
    });
    
    return {
      products: data.content,
      total: data.totalElements,
      hasMore: !data.last,
    };
  } catch (error) {
    console.error("Error fetching category products:", error);
    return {
      products: [],
      total: 0,
      hasMore: false,
    };
  }
}

// Search Products
export async function searchProducts(
  query: string,
  page: number = 0,
  size: number = 20
) {
  try {
    const data = await apiServerService.get<{
      content: Product[];
      totalElements: number;
      last: boolean;
    }>(`/products/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`, {
      cacheTime: 60, // 1 minute for search
    });
    
    return {
      products: data.content,
      total: data.totalElements,
      hasMore: !data.last,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      products: [],
      total: 0,
      hasMore: false,
    };
  }
}