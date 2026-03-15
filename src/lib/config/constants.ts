// lib/config/constants.ts
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  VERSION: 'v1',
  FULL_URL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1`,
  ENDPOINTS: {
    BANNERS: '/banners',
    CATEGORIES: '/categories/top',
    FEATURED: '/products/featured',
  }
} as const;

export const CACHE_TIME = {
  BANNER: 3600, // 1 hour
  CATEGORY: 3600, // 1 hour
  PRODUCT: 300, // 5 minutes
  CART: 300, // 5 minutes
} as const;