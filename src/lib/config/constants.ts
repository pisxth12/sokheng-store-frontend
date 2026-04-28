// lib/config/constants.ts
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  VERSION: 'v1',
  FULL_URL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1`,
  ENDPOINTS: {
    BANNERS: '/banners',
    CATEGORIES: '/categories/top',
    FEATURED: '/products/featured',
    BRANDS: '/brands',              
    BRANDS_HOMEPAGE: '/brands/homepage',     
    BRAND_BY_SLUG: (slug: string) => `/brands/slug/${slug}`,
  }
} as const;

export const PAGINATION = {
    HOMEPAGE_BRANDS: 8,  
} as const;

export const CACHE_TIME = {
  BANNER: 3600, // 1 hour
  CATEGORY: 3600, // 1 hour
  BRAND: 3600, // 1 hour
  PRODUCT: 300, // 5 minutes
  CART: 300, // 5 minutes
} as const;

export const CACHE_TIME_MS = {
  BANNER: CACHE_TIME.BANNER * 1000,
  CATEGORY: CACHE_TIME.CATEGORY * 1000,
  BRAND: CACHE_TIME.BRAND * 1000,
  PRODUCT: CACHE_TIME.PRODUCT * 1000,
  CART: CACHE_TIME.CART * 1000,
} as const;