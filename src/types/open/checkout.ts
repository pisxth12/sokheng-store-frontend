// types/open/checkout.type.ts
export interface CheckoutResponse {
    order: {
        id: number;
        orderNumber: string;
        customerName: string;
        email: string;
        phone: string;
        address: string;
        totalAmount: number;
        status: string;
        items: any[];
        createdAt: string;
    };
    payment: {
        id: number;
        paymentNumber: string;
        amount: number;
        method: string;
        status: string;
    };
    message: string;
}