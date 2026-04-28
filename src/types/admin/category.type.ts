export interface Category {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  title: string;
  image: string;
  description: string;
  isActive: boolean;
}

export interface CategoryResponse extends Category {
  message: string;
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  categoriesWithProducts: number;
  emptyCategories: number;
}

export interface CategorySelect{
  id: number;
  name: string;
}
