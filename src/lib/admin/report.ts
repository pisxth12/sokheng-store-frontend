import apiClient from "@/lib/api/client";

export const reportService = {
  getReportData: async (range: string = "30days") => {
    const response = await apiClient.get("/admin/reports/data", {
      params: { range },
    });

    console.log("Response URL:", response.config.url);
    return response.data;
  },

  getReportOptions: async () => {
    const response = await apiClient.get("/admin/reports/options");
    return response.data;
  },

  downloadPdf: (range: string = "30days") => {
     console.log("Downloading PDF for range:", range); 
    window.open(`/api/v1/admin/reports/pdf?range=${range}`, "_blank");
  },
};
