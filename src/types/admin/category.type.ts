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
