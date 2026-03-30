import { PageResponse } from "@/types/admin/order.type";
import apiClient from "../api/client";
import { Brand, BrandStats, } from "@/types/admin/brand.type";

export const adminBrandApi = {
  getAll: async (
    page = 0,
    size = 10,
    sortBy = "name",
    sortDirection = "asc",
  ): Promise<PageResponse<Brand>> => {
    const res = await apiClient.get<PageResponse<Brand>>(
      `/admin/brands?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
    );
    return res.data;
  },
  getStats: async (): Promise<BrandStats> => {
    const res = await apiClient.get<BrandStats>("/admin/brands/stats");
    return res.data;
  },


  search: async (
    q: string,
    page = 0,
    size = 10,
  ): Promise<PageResponse<Brand>> => {
    const response = await apiClient.get<PageResponse<Brand>>(
      `/admin/brands/search?q=${q}&page=${page}&size=${size}`,
    );
    return response.data;
  },

  getById: async (id: number): Promise<Brand> => {
    const res = await apiClient.get<Brand>(`/admin/brands/${id}`);
    return res.data;
  },

  create: async (data: FormData): Promise<Brand> => {
    const res = await apiClient.post<Brand>("/admin/brands", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  update: async (id: number, data: FormData): Promise<Brand> => {
    const res = await apiClient.put<Brand>(`/admin/brands/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    const res = await apiClient.delete<void>(`/admin/brands/${id}`);
    return res.data;
  },

  toggleStatus: async (id: number): Promise<void> => {
    await apiClient.patch(`/admin/brands/${id}/toggle-status`);
  },

  addCategories: async (
    brandId: number,
    categoryIds: number[],
  ): Promise<Brand> => {
    const res = await apiClient.post<Brand>(
      `/admin/brands/${brandId}/categories`,
      {
        categoryIds,
      },
    );
    return res.data;
  },

  removeCategories: async (
    brandId: number,
    categoryIds: number[],
  ): Promise<Brand> => {
    const res = await apiClient.delete<Brand>(
      `/admin/brands/${brandId}/categories`,
      {
        data: { categoryIds },
      },
    );
    return res.data;
  },
};
