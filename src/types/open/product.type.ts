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
    mainImage: string;
    images: ProductImage[];
}

export interface ProductDetail extends Product {
   description: string;          
    categoryId: number;           
    categorySlug: string;         
    brandId?: number;             
    brandSlug?: string;           
    isFeatured: boolean;          
    createdAt: string;            
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


