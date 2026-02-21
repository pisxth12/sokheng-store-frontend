import { AnalyticsData } from "@/types/analytics.type"
import apiClient from "../open/client"

export const adminAnalyticsApi = {
    // Get all analytics data for dashboard
    getDashboard: async () => {
        const res = await apiClient.get<AnalyticsData>(`/admin/analytics/dashboard`)
        return res.data
    },
    

    // Get sales data for charts
  getSalesData: async (days: number = 30) => {
    const res = await apiClient.get(`/admin/analytics/sales?days=${days}`);
    return res.data;
  },

    // Get top products
  getTopProducts: async (limit: number = 10) => {
    const res = await apiClient.get(`/admin/analytics/top-products?limit=${limit}`);
    return res.data;
  },

  // Get category sales
  getCategorySales: async () => {
    const res = await apiClient.get("/admin/analytics/categories");
    return res.data;
  },

}