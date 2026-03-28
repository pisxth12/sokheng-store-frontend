export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    phone: string;
    email: string;
    totalAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    items: OrderItem[];
    createdAt: string;
}
export interface OrderPageResponse {
    content: Order[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface TrackOrderResponse {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: number;
    productId: number;
    slug: string;
    productName: string;
    quantity: number;
    subtotal: number;
    unitPrice: number;
    productImage?: string;
  }>;
}