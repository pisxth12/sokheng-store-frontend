import {
  Brand,
  Category,
  PageResponse,
  Product,
  ProductDetail,
  ProductSuggestion,
  ProductsWithPriceRangeResponse,
} from "@/types/open/product.type";
import apiClient from "../api/client";

export const publicProductApi = {

 
  getAllProductsFilter: async (
    page: number = 0,
    size: number = 32,
    sortBy?: string,
    sortOrder?: string,
    minPrice?: number,
    maxPrice?: number,
    categoryId?: number,
    brandId?: number,
  ): Promise<ProductsWithPriceRangeResponse> => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("size", size.toString());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (minPrice !== undefined) params.set("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.set("maxPrice", maxPrice.toString());
    if (categoryId) params.set("categoryId", categoryId.toString());
    if (brandId) params.set("brandId", brandId.toString());

    const res = await apiClient.get<ProductsWithPriceRangeResponse>(
      `/products?${params.toString()}`
    );
    return res.data;
  },

  getCategoryNames: async (): Promise<Category[]> => {
    const res = await apiClient.get<Category[]>("/categories/name");
    return res.data;
  },

  getBrandNames: async (): Promise<Brand[]> => {
    const res = await apiClient.get<Brand[]>("/brands/name");
    return res.data;
  },

  // Get all products with pagination
  getAllProducts: async (page: number = 0 , size: number = 32) => {
    const res = await apiClient.get<PageResponse<Product>>(
      `/products?page=${page}&size=${size}`,
    );
    return res.data;
  },

  // Get by category
  getProductsByCategory: async (
    categorySlug: string,
    page: number = 0,
    size: number = 32,
  ) => {
    const res = await apiClient.get<PageResponse<Product>>(
      `/categories/${categorySlug}/products?page=${page}&size=${size}`,
    );
    return res.data;
  },

  // Get by category
  getProductsByBrand: async (
    brandSlug: string,
    page: number = 0,
    size: number = 32,
  ) => {
    const res = await apiClient.get<PageResponse<Product>>(
      `/brands/${brandSlug}/products?page=${page}&size=${size}`,
    );
    return res.data;
  },
  


  //Get featured
  getFeatured: async (options?: { signal?: AbortSignal }) => {
    const res = await apiClient.get<Product[]>("/products/featured", {
      signal: options?.signal,
    });
    return res.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    page: number = 0,
    size: number = 32,
    sortBy?: string,
    sortOrder?: string,
    minPrice?: number,
    maxPrice?: number,
    categoryId?: number,
  ) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", page.toString());
    params.set("size", size.toString());
    if (sortBy) {
      params.set("sortBy", sortBy);
      if (sortOrder) {
        params.set("sortOrder", sortOrder);
      } else {
        params.set("sortOrder", "desc");
      }
    }
    if (minPrice) params.set("minPrice", minPrice.toString());
    if (maxPrice) params.set("maxPrice", maxPrice.toString());
    if (categoryId) params.set("categoryId", categoryId.toString());

    const res = await apiClient.get<PageResponse<Product>>(
      `/products/search?${params.toString()}`,
    );
    return res.data;
  },

  getSuggestions: async (query: string): Promise<ProductSuggestion[]> => {
    if (!query || query.length < 2) return [];

    const res = await apiClient.get<ProductSuggestion[]>(
      `/products/suggestions?q=${encodeURIComponent(query)}`,
    );
    return res.data;
  },

  // Single product - no pagination
  getProductBySlug: async (slug: string) => {
    const res = await apiClient.get<ProductDetail>(`/products/slug/${slug}`);
    return res.data;
  },

  //Get related products
  getRelatedProducts: async (
    productId: number,
    page: number,
    size: number = 4,
  ) => {
    const res = await apiClient.get<PageResponse<Product>>(
      `/products/${productId}/related?page=${page}&size=${size}`,
    );
    return res.data;
  },

  // Get product by ID
  getProductById: async (id: number) => {
    const res = await apiClient.get<Product>(`/products/${id}`);
    return res.data;
  },
};
