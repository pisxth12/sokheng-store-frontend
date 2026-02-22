export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
     productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
     id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderResponse  {
  message: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface OrderListResponse {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}
