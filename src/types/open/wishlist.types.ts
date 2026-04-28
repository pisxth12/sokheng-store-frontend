export interface WishlistItem {
    id: number;
    productId: number;
    productName: string;
    productSlug: string;
    categorySlug: string;
    categoryName: string;
    price: number;
    salePrice: number | null;
    discountPercent?: number;
    isOnSale?: boolean;
    mainImage: string;
    inStock: number;
    stock: number;
}

export interface WishlistResponse{
    items: WishlistItem[];
    totalItems: number;
}

export interface ApiError {
    message: string;
    status?: number;
}
