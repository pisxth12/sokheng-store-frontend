import { CategorySelect, CategoryStats } from "@/types/admin/category.type";
import apiClient from "../api/client";

export const adminCategoryApi = {
  getAll: async (page = 0, size = 12) => {
    const res = await apiClient.get(
      "/admin/categories?page=" + page + "&size=" + size,
    );
    return res.data;
  },
  selectCategories: async () :Promise<CategorySelect[]> => {
    const res = await apiClient.get<CategorySelect[]>("/admin/categories/selections");
    return res.data;
  },

  getStats: async () => {
    const res = await apiClient.get<CategoryStats>("/admin/categories/stats");
    return res.data;
  },

  search: async (q: string, page = 0, size = 12) => {
    const response = await apiClient.get(
      `/admin/categories/search?q=${q}&page=${page}&size=${size}`,
    );
    return response.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get(`/admin/categories/${id}`);
    return res.data;
  },

  create: async (data: FormData) => {
    const res = await apiClient.post("/admin/categories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  update: async (id: number, data: FormData) => {
    const res = await apiClient.put(`/admin/categories/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`/admin/categories/${id}`);
    return res.data;
  },

  toggleStatus: async (id: number) => {
    await apiClient.patch(`/admin/categories/${id}/toggle-status`);
  },
};
