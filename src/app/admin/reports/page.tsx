"use client";

import { useReports } from "@/hooks/admin/useReports";
import ReportFilters from "@/components/admin/reports/ReportFilters";
import ReportSummary from "@/components/admin/reports/ReportSummary";
import ReportCharts from "@/components/admin/reports/ReportCharts";
import ProductReportTable from "@/components/admin/reports/ProoductReportTable";
import { Loader2 } from "lucide-react";
import BrandReportTable from "@/components/admin/reports/BrandReportTable";
import CategoryReportTable from "@/components/admin/reports/CategoryReportTable";
import TopSpendersTable from "@/components/admin/reports/TopSpendersTable";

export default function ReportsPage() {
  const {
    data,
    options,
    loading,
    error,
    selectedRange,
    handleRangeChange,
    handleDownloadPdf,
    refresh,
  } = useReports();

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      

      {options && (
        <ReportFilters
          ranges={options.ranges}
          selectedRange={selectedRange}
          onRangeChange={handleRangeChange}
          onDownload={handleDownloadPdf}
          loading={loading}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : data ? (
        <div className="space-y-8">
          <ReportSummary
            totalRevenue={data.totalRevenue}
            totalOrders={data.totalOrders}
            totalUsers={data.totalUsers}
            averageOrderValue={data.averageOrderValue}
          />

          <ReportCharts
            monthlyData={data.monthlyData}
            statusData={data.statusData}
          />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductReportTable products={data.topProducts} />
            <BrandReportTable brands={data.topBrands || []} />
            <CategoryReportTable categories={data.topCategories || []} />
            <TopSpendersTable spenders={data.topSpenders || []} />
          </div>

        </div>
      ) : null}
    </div>
  );
}
