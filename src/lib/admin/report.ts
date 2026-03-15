import apiClient from "@/lib/api/client";

export const reportService = {
  getReportData: async (range: string = "30days") => {
    const response = await apiClient.get("/admin/reports/data", {
      params: { range },
    });
    return response.data;
  },

  getReportOptions: async () => {
    const response = await apiClient.get("/admin/reports/options");
    return response.data;
  },

  downloadPdf: (range: string = "30days") => {
    // Use full backend URL, not through Next.js API route
    window.open(`/api/v1/admin/reports/pdf?range=${range}`, "_blank");
  },
};
