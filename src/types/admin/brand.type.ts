export interface CategoryInfo {
  id: number;
  title: string;
  slug: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
  categories: CategoryInfo[];
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrandSelection{
  id: number;
  name: string;
}

export interface BrandSimple {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  isActive: boolean;
}

export interface BrandResponse extends Brand {
  message?: string;
}

export interface CreateBrandRequest {
  name: string;
  slug?: string;
  description?: string;
  logo: File | null;
  isActive?: boolean;
  categoryIds?: number[];
}

export interface UpdateBrandRequest {
  name?: string;
  slug?: string;
  description?: string;
  logo?: File | null;
  isActive?: boolean;
  categoryIds?: number[];
}

export interface BrandStats {
  totalBrands: number;
  activeBrands: number;
  inactiveBrands: number;
  brandsWithProducts: number;
  emptyBrands: number;


}