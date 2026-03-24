// lib/api/product.server.ts
import "server-only";
import { apiServerService } from "../api/server";
import { PageResponse, Product, ProductDetail, ProductsWithPriceRangeResponse } from "@/types/open/product.type";




export interface GetProductsFilters {
  sortBy?: string;
  sortOrder?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  brandId?: number;
}

export async function getProductsWithFilter(
  page: number = 0,
  size: number = 32,
  filters?: GetProductsFilters
): Promise<ProductsWithPriceRangeResponse> {
  try {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("size", size.toString());
    
    if (filters?.sortBy) params.set("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters?.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString());
    if (filters?.categoryId) params.set("categoryId", filters.categoryId.toString());
    if (filters?.brandId) params.set("brandId", filters.brandId.toString());

    const data = await apiServerService.get<{
      products: PageResponse<Product>;
      minPrice: number;
      maxPrice: number;
      hasMore: boolean;
    }>(`/products/all?${params.toString()}`, {
      cacheTime: 300,
    });
    
    return {
      products: data.products,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      hasMore: data.hasMore,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: size,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalPages: 0,
        totalElements: 0,
        first: true,
        size: size,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 0,
        empty: true,
      },
      minPrice: 0,
      maxPrice: 1000,
      hasMore: false,
    };
  }
}



export async function getProducts(page: number = 0, size: number = 32) {
  try {
    const data = await apiServerService.get<PageResponse<Product>>(
      `/products?page=${page}&size=${size}`,
      { cacheTime: 300 }
    );
    
    return {
      products: data.content,
      total: data.totalElements,
      hasMore: !data.last,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      total: 0,
      hasMore: false,
    };
  }
}

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
    const data = await apiServerService.get<PageResponse<Product>>(
      `/products/${productId}/related?page=${page}&size=${size}`,
      { cacheTime: 3600 }
    );
    
    return {
      products: data.content,
      total: data.totalElements,
      hasMore: !data.last,
    };
  } catch (error) {
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
    const data = await apiServerService.get<PageResponse<Product>>(
      `/categories/${categorySlug}/products?page=${page}&size=${size}`,
      { cacheTime: 300 }
    );
    
    return {
      products: data.content,
      total: data.totalElements,
      hasMore: !data.last,
    };
  } catch (error) {
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
  size: number = 32,
  sortBy: string = "createdAt",
  sortOrder: string = "desc",
  minPrice?: number,
  maxPrice?: number,
  categoryId?: number
) {
  try {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", page.toString());
    params.set("size", size.toString());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (minPrice) params.set("minPrice", minPrice.toString());
    if (maxPrice) params.set("maxPrice", maxPrice.toString());
    if (categoryId) params.set("categoryId", categoryId.toString());

    const data = await apiServerService.get<PageResponse<Product>>(
      `/products/search?${params.toString()}`,
      { cacheTime: 60 }
    );
    
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