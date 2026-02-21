import { create } from "domain";
import apiClient from "../open/client";
import { PageResponse, Product } from "@/types/product.type";

export const adminProductApi = {
    getAll: async (page = 0, size = 10) => {
        const res = await apiClient.get<PageResponse<Product>>(`/admin/products?page=${page}&size=${size}`);
        return res.data;
    },
    getById: async (id: number) => {
        const res = await apiClient.get<Product>(`/admin/products/${id}`);
        return res.data;
    },

    search: async (q: string, page = 0, size = 10) => {
        const response = await apiClient.get<PageResponse<Product>>(`/admin/products/search?q=${q}&page=${page}&size=${size}`);
        return response.data;
    },
    create: async (data: FormData) => {
        const res = await apiClient.post<Product>("/admin/products", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    update: async (id: number, data: FormData) => {
        const res = await apiClient.put<Product>(`/admin/products/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },


    delete: async (id: number) => {
        const res = await apiClient.delete(`/admin/products/${id}`);
        return res.data;
    },

    toggleStatus: async (id: number) => {
        await apiClient.patch<Product>(`/admin/products/${id}/toggle-status`);
        // return res.data;
    },

    toggleFeatured: async(id: number) => {
        await apiClient.patch<Product>(`/admin/products/${id}/toggle-featured`);
        // return res.data;
    },

    clearDiscount: async(productId: number) => {
        const res = await apiClient.patch(`/admin/products/${productId}/clear-sale`);
        return res.data;

    }












}