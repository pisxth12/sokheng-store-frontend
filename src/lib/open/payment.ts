import {
  PaymentRequest,
  PaymentStatusResponse,
  QRGenerationResponse,
} from "@/types/open/payment.type";
import apiClient from "../api/client";

export const publicPaymentApi = {
  // Generate QR code for payment
  generateQR: async (orderNumber: string): Promise<QRGenerationResponse> => {
    // Make sure this matches your backend exactly!
    const response = await apiClient.post("/khqr/generate", {
      orderNumber: orderNumber,
    });
    return response.data;
  },

  // Verify payment status (POST version)
  verifyPayment: async (
    orderNumber: string,
    md5: string,
  ): Promise<PaymentStatusResponse> => {
    try {
      const response = await apiClient.get<PaymentStatusResponse>(
        `/khqr/verify/${orderNumber}?md5=${md5}`,
      );
      return response.data;
    } catch (error) {
      console.error("Verify payment error:", error);
      throw error;
    }
  },

  // Get payment status (GET version)
  getPaymentStatus: async (
    orderNumber: string,
  ): Promise<PaymentStatusResponse> => {
    try {
      const response = await apiClient.get<PaymentStatusResponse>(
        `/khqr/status/${orderNumber}`,
      );
      return response.data;
    } catch (error) {
      console.error("Get payment status error:", error);
      throw error;
    }
  },
};
