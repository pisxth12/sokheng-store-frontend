import { useState, useEffect } from "react";
import { reportService } from "@/lib/admin/report";
import { ReportData, ReportOptions } from "@/types/admin/report.type";

export const useReports = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [options, setOptions] = useState<ReportOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState("30days");

  const fetchData = async (range: string) => {
    setLoading(true);
    try {
      const [reportData, reportOptions] = await Promise.all([
        reportService.getReportData(range),
        reportService.getReportOptions(),
      ]);
      setData(reportData);
      setOptions(reportOptions);
      setError(null);
    } catch (err) {
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedRange);
  }, [selectedRange]);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
  };

  const handleDownloadPdf = () => {
    reportService.downloadPdf(selectedRange);
  };

  const refresh = () => {
    fetchData(selectedRange);
  };

  return {
    data,
    options,
    loading,
    error,
    selectedRange,
    handleRangeChange,
    handleDownloadPdf,
    refresh,
  };
};
