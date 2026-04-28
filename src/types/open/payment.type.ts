export type PaymentStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';

export interface PaymentRequest {
  orderId: string;
}


export interface QRGenerationResponse {
  qrString: string;
  md5: string;
  amount: number;
  orderNumber: string;
  merchantName: string;
  merchantAccount: string;
  expirySeconds: number;
}

export interface PaymentStatusResponse {
  paid: boolean;
  orderNumber: string;
  status: PaymentStatus;
  message: string;
  amount?: number;
  paidAt?: string;
  expiryTime?: string;
}


export interface QRData {
    qrString: string;
    md5: string;
    amount: number;
    orderNumber: string;
    merchantName: string;
    merchantAccount: string;
    expirySeconds: number;
}