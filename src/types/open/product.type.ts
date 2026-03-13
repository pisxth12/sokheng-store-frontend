export interface Product{
    id: number;
    name: string;
    description: string;
    price: number;
    discountPercent: number;
    salePrice?: number;
    saleEndDate?: string;
    currentPrice: number;
    isOnSale: boolean;
    stock: number;
    soldCount: number;
    sku: string;
    slug: string;
    isActive: boolean;
    isFeatured: boolean;
    categoryId: number;
    categoryName: string;
    categorySlug: string;
    mainImage: string;
    images: ProductImage[];
    createdAt: string;
    updatedAt: string;

}
export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isMain: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface ProductSuggestion {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
}

