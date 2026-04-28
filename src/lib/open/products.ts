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
import { BrandFilterParams, CategoryFilterParams } from "@/types/open/product-filter.type";



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
      `/products/all?${params.toString()}`
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
    brandId?: number,
  ): Promise<ProductsWithPriceRangeResponse> => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", page.toString());
    params.set("size", size.toString());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (minPrice !== undefined) params.set("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.set("maxPrice", maxPrice.toString());
    if (categoryId) params.set("categoryId", categoryId.toString());
    if (brandId) params.set("brandId", brandId.toString());

    const res = await apiClient.get<ProductsWithPriceRangeResponse>(
      `/products/search?${params.toString()}`
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

    // Get by category
  getProductsByBrand: async (
    brandSlug: string,
    page: number = 0,
    size: number = 32,
  ) => {
    const res = await apiClient.get<PageResponse<Product>>(
      `/products/${brandSlug}/brand?page=${page}&size=${size}`,
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
      `/products/${categorySlug}/category?page=${page}&size=${size}`,
    );
    return res.data;
  },

  


  
    getProductsByBrandWithFilters: async (
      brandSlug: string,
      filters: BrandFilterParams = {}
    ): Promise<ProductsWithPriceRangeResponse> => {
      const params = new URLSearchParams();
      params.set("page", (filters.page ?? 0).toString());
      params.set("size", (filters.size ?? 32).toString());
      if (filters.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString());
      if (filters.categoryId !== undefined) params.set("categoryId", filters.categoryId.toString());
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);

      const res = await apiClient.get<ProductsWithPriceRangeResponse>(
        `/brands/${brandSlug}/products/filtered?${params.toString()}`
      );
      return res.data;
    },

    getProductsByCategoryWithFilters: async (
      categorySlug: string,
      filters: CategoryFilterParams = {}
    ): Promise<ProductsWithPriceRangeResponse> => {
      const params = new URLSearchParams();
      params.set("page", (filters.page ?? 0).toString());
      params.set("size", (filters.size ?? 32).toString());
      if (filters.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString());
      if (filters.brandId !== undefined) params.set("brandId", filters.brandId.toString());
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);

      const res = await apiClient.get<ProductsWithPriceRangeResponse>(
        `/categories/${categorySlug}/products/filtered?${params.toString()}`
      );
      return res.data;
    },
};

