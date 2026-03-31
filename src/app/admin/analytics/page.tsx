"use client";

import { AnalyticsStatsCard } from "@/components/admin/analytics/AnalyticsStatsCard";
import CategorySales from "@/components/admin/analytics/CategorySale";
import RevenueChart from "@/components/admin/analytics/charts/RevenueChart";
import StatusChart from "@/components/admin/analytics/charts/StatusChart";
import ComparisonCard from "@/components/admin/analytics/ComparisonCard";
import TopBrands from "@/components/admin/analytics/TopBrands";
import TopProducts from "@/components/admin/analytics/TopProducts";
import { useAnalytics } from "@/hooks/admin/useAnalytics";
import { 
   
  DollarSign, 
  ShoppingBag, 
  Users,
  Package,
  Loader2,
} from "lucide-react";

export default function AnalyticsPage() {
  const { data, loading, error, refresh } = useAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error || "No data available"}</p>
        <button 
          onClick={refresh}
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = {
    totalRevenue: data?.overview?.totalRevenue || 0,
    totalOrders: data?.overview?.totalOrders || 0,
    totalUsers: data?.overview?.totalUsers || 0,
    totalProducts: data?.overview?.totalProducts || 0,
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      

      {/* Stats Grid */}
     <AnalyticsStatsCard stats={stats} />

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3  gap-4">
        <ComparisonCard 
          title="Today vs Yesterday"
          current={data.todayVsYesterday.current}
          previous={data.todayVsYesterday.previous}
          percentage={data.todayVsYesterday.percentageChange}
          trend={data.todayVsYesterday.trend}
        />
        <ComparisonCard 
          title="This Week vs Last Week"
          current={data.thisWeekVsLastWeek.current}
          previous={data.thisWeekVsLastWeek.previous}
          percentage={data.thisWeekVsLastWeek.percentageChange}
          trend={data.thisWeekVsLastWeek.trend}
        />
        <ComparisonCard 
          title="This Month vs Last Month"
          current={data.thisMonthVsLastMonth.current}
          previous={data.thisMonthVsLastMonth.previous}
          percentage={data.thisMonthVsLastMonth.percentageChange}
          trend={data.thisMonthVsLastMonth.trend}
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={data.monthlySales} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart data={data.ordersByStatus} />
        <CategorySales data={data.salesByCategory} />
      </div>
   {/* Three Column Layout for Products & Brands */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div >
          <TopProducts products={data.topProducts} />
        </div>
        <div>
          <TopBrands brands={data.topBrands} />
        </div>
      </div>
    </div>
  );
}