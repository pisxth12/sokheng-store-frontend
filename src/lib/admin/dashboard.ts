import { DashboardSummary } from "@/types/admin/dashboard.type";
import apiClient from "../api/client";

export const adminDashboardApi = {
  getSummary: async () => {
    const res = await apiClient<DashboardSummary>("/admin/dashboard/summary");
    return res.data;
  },
};
