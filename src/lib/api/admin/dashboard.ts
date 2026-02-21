import { DashboardSummary } from "@/types/dashboard.type";
import apiClient from "../open/client";

export const adminDashboardApi = {
    getSummary: async () => {
        const res = await apiClient<DashboardSummary>("/admin/dashboard/summary");
        return res.data;
    },
}