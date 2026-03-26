// For category page - filter by brand
export type CategoryFilterParams = {
  minPrice?: number;
  maxPrice?: number;
  brandId?: number;      // Filter products in this category by brand
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
};

// For brand page - filter by category
export type BrandFilterParams = {
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;   // Filter products in this brand by category
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
};