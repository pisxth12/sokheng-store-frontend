export interface ProductImage {
      id: number;
    imageUrl: string;
    altText?: string;
    sortOrder: number;
    isMain: boolean;
    createdAt?: string;
}


export interface Product{
   id: number;
    name: string;
    description?: string;
    price: number;
    salePrice?: number;
    saleEndDate?: string;
    currentPrice?: number;
    isOnSale?: boolean;
    stock: number;
    soldCount?: number;
    sku?: string;
    slug?: string;
    isActive: boolean;
    isFeatured: boolean;
    categoryId: number;
    categoryName?: string;
    images: ProductImage[];
    mainImage?: string;
    createdAt?: string;
    updatedAt?: string;   
}

export interface ProdductCreateRequest {
     name: string;
    description?: string;
    price: number;
    salePrice?: number;
    saleEndDate?: string;
    stock: number;
    slug?: string;
    isFeatured: boolean;
    categoryId: number;
    images?: File[];
    altTexts?: string[];
}

export interface ProductUpdateRequest {
      name?: string;
    description?: string;
    price?: number;
    salePrice?: number;
    saleEndDate?: string;
    stock?: number;
    slug?: string;
    isFeatured?: boolean;
    isActive?: boolean;
    categoryId?: number;
    newImages?: File[];
    newAltTexts?: string[];
    deleteImageIds?: number[];
    setMainImageId?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}