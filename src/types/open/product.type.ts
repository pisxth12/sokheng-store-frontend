export interface Product{
    id: number;
    name: string;
    description: string;
    price: number;
    discountPercent: number;
    salePrice?: number;
    isOnSale: boolean;
    stock: number;
    soldCount: number;
    slug: string;
    brandName: string;
    categoryName: string;
    categorySlug: string;
    mainImage: string;
    images: ProductImage[];
}

export interface ProductDetail extends Product {
    description: string;
    sku: string;          
    categoryId: number;           
    categorySlug: string;         
    brandId?: number;             
    brandSlug?: string;                          
    images: ProductDetailImage[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

export interface ProductDetailImage extends ProductImage{
   altText?: string;
}

export interface ProductSuggestion {
  id: number;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  mainImage: string;
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




//  Add these for filters
export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface FilterState {
  sortBy: string;
  sortOrder: string;
  minPrice: string;
  maxPrice: string;
  categoryId: string;
  brandId?: string;
}

export interface PriceRange {
  min: number;
  max: number;
}


export interface ProductsWithPriceRangeResponse {
  items: Product[];                   
  pagination: {
    page: number;                     
    pageSize: number;                 
    total: number;                    
    totalPages: number;               
    hasMore: boolean;                 
  };
  filters: {
    minPrice: number;                 
    maxPrice: number;                 
  };
}