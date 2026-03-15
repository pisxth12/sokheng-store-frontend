import { WishlistResponse } from "@/types/open/wishlist.types";
import apiClient from "../api/client";

export const publicWishlistApi = {
  getAll: async (): Promise<WishlistResponse> => {
    const res = await apiClient.get<WishlistResponse>("/wishlist");
    return res.data;
  },

  add: async (productId: number): Promise<WishlistResponse> => {
    const res = await apiClient.post<WishlistResponse>(
      `/wishlist/add/${productId}`,
    );
    return res.data;
  },

  remove: async (productId: number): Promise<WishlistResponse> => {
    const res = await apiClient.delete<WishlistResponse>(
      `/wishlist/remove/${productId}`,
    );
    return res.data;
  },

  check: async (productId: number): Promise<boolean> => {
    const res = await apiClient.get<boolean>(`/wishlist/check/${productId}`);
    return res.data;
  },

  count: async (): Promise<number> => {
    const res = await apiClient.get<number>("/wishlist/count");
    return res.data;
  },

  moveToCart: async (
    productId: number,
    quantity: number,
  ): Promise<WishlistResponse> => {
    const res = await apiClient.post<WishlistResponse>(
      `/wishlist/move-to-cart/${productId}`,
      { quantity },
    );
    return res.data;
  },
};
