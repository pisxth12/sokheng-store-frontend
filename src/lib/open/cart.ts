import {
  AddToCartRequest,
  CartResponse,
  UpdateCartItemRequest,
  CheckoutRequest,
} from "@/types/open/cart.type";
import apiClient from "../api/client";
import { CheckoutResponse } from "@/types/open/checkout";

export const publicCartApi = {
  // GET /api/v1/cart - Get current cart
  getCart: async (): Promise<CartResponse> => {
    const res = await apiClient.get<CartResponse>("/cart");
    return res.data;
  },

  // POST /api/v1/cart/add - Add item to cart
  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    const res = await apiClient.post<CartResponse>("/cart/add", data);
    return res.data;
  },

  // PUT /api/v1/cart/update/{itemId} - Update item quantity (FIXED URL)
  updateCartItem: async (
    itemId: number,
    data: UpdateCartItemRequest,
  ): Promise<CartResponse> => {
    // FIXED: Changed from '/cart/items/${itemId}' to '/cart/update/${itemId}'
    const res = await apiClient.put<CartResponse>(
      `/cart/update/${itemId}`,
      data,
    );
    return res.data;
  },

  // DELETE /api/v1/cart - Clear entire cart
  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart");
  },

  // POST /api/v1/cart/merge - Merge guest cart with user cart
  mergeCart: async (): Promise<CartResponse> => {
    const res = await apiClient.post<CartResponse>("/cart/merge");
    return res.data;
  },

  // POST /api/v1/cart/checkout - Checkout (FIXED: added data parameter)
  checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const res = await apiClient.post<CheckoutResponse>("/cart/checkout", data);
    return res.data;
  },

  // GET /api/v1/cart/count - Get cart item count
  getCartItemCount: async (): Promise<number> => {
    const res = await apiClient.get<number>("/cart/count");
    return res.data;
  },

  // Helper: Remove item (set quantity to 0)
  removeFromCart: async (itemId: number): Promise<CartResponse> => {
    return publicCartApi.updateCartItem(itemId, { quantity: 0 });
  },
};
