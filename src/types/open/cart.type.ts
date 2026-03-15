

export interface CartItemResponse {
    id: number;
    productId: number;
    slug: string;
    productName: string;
    productImage?: string | null;
    price: number;
    quantity: number;
    totalPrice: number;
    stock: number;
}

export interface CartResponse {
    id: number;
    userId?: number;
    sessionId?: string
    totalItems: number;
    totalPrice: number;
    items: CartItemResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface CartCountResponse {
    totalItems: number;      
    totalPrice?: number;      
}

export interface AddToCartRequest {
    productId: number;
    quantity: number;
}

export interface UpdateCartItemRequest{
    quantity:  number;
}


export interface CheckoutRequest{
    customerName: string;
    email: string;
    phone: string;
    address?: string;
    note?: string;
    items: CartItemResponse[];
 
}

