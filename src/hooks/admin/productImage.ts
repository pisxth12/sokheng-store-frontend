import apiClient from "@/lib/api/open/client"
import { ProductImage } from "@/types/product.type"

export const adminProductImage = {
    getByProductId: async (productId: number) => {
        const res = await apiClient.get<ProductImage[]>(`/admin/products/${productId}/images`);
        return res.data;
    },

    toggleMain: async (productId: number, imageId: number) => {
        const res = await apiClient.patch(`/admin/products/${productId}/images/${imageId}/toggle-main`);
        return res.data;
    },

    delete: async(productId: number, imageId: number) => {
        const res = await apiClient.delete(`/admin/products/${productId}/images/${imageId}`);
        return res.data;
    },

    reorder: async (productId: number, imageIds: number[]) => {
        const res = await apiClient.put(`/admin/products/${productId}/images/reorder`, {imageIds});
        return res.data;
    },

    updateAltText: async (productId: number, imageId: number, altText: string) => {
        const res = await apiClient.put(`/admin/products/${productId}/images/${imageId}/alt-text`, {altText});
        return res.data;
    }
}