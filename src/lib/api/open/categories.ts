import apiClient from "./client";

export const publicCategoriesApi = {
    getTop: async (limit: number, options?: { signal?: AbortSignal }) => {
        const res = await apiClient.get("/categories/top");
        return res.data;
    },
}