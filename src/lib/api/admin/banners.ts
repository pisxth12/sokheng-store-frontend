import apiClient from "../open/client";

export const adminBannerApi = {
  getAll: async () => {
    const res = await apiClient.get("/admin/banners");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get(`/admin/banners/${id}`);
    return res.data;
  },

  create: async (data: FormData) => {
    const res = await apiClient.post("/admin/banners", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  update: async (id: number, data: FormData) => {
    const res = await apiClient.put(`/admin/banners/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`/admin/banners/${id}`);
    return res.data;
  },

  toggleStatus: async (id: number) => {
    const res = await apiClient.patch(`/admin/banners/${id}/toggle-status`);
    return res.data;
  },

  reorder: async (ids: number[]) => {
    const res = await apiClient.put("/admin/banners/reorder", ids);
    return res.data;
  },
};
