import apiClient from "../open/client";

export const adminProductImageApi = {
  getAll: async (productId: number) => {
    const res = await apiClient.get(`/admin/products/${productId}/image`);
    return res.data;
  },

  toggleMainImage: async (productId: number, imageId: number) => {
    const res = await apiClient.patch(
      `/admin/products/${productId}/images/${imageId}/toggle-main`,
    );
    return res.data;
  },

  reorder: async (productId: number, imageIds: number[]) => {
    const res = await apiClient.put(`/admin/products/${productId}/reorder`);
  },

  delete: async (produtId: number, imageId: number) => {
    const res = await apiClient.delete(
      `/admin/products/${produtId}/images/${imageId}`,
    );
    return res.data;
  },
};
