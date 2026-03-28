export interface CheckoutResponse {
    order: {
        orderNumber: string;
        totalAmount: number;
        status: string;
        createdAt: string;
        items: Array<{
            productId: number;
            productName: string;
            quantity: number;
            price: number;
            productImage?: string;
        }>;
    };
    message: string;
}