

"use client";

import CategorySales from "@/components/admin/analytics/CategorySale";
import RevenueChart from "@/components/admin/analytics/charts/RevenueChart";
import StatusChart from "@/components/admin/analytics/charts/StatusChart";
import ComparisonCard from "@/components/admin/analytics/ComparisonCard";
import TopProducts from "@/components/admin/analytics/TopProducts";
import { useAnalytics } from "@/hooks/admin/useAnalytics";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUp,
  ArrowDown
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

  const stats = [
  {
    label: "Total Revenue",
    value: data?.overview?.totalRevenue ? `$${data.overview.totalRevenue.toLocaleString()}` : "$0",
    icon: DollarSign,
    color: "bg-green-500"
  },
  {
    label: "Total Orders",
    value: data?.overview?.totalOrders?.toLocaleString() || "0",
    icon: ShoppingBag,
    color: "bg-blue-500"
  },
  {
    label: "Total Users",
    value: data?.overview?.totalUsers?.toLocaleString() || "0",
    icon: Users,
    color: "bg-purple-500"
  },
  {
    label: "Total Products",
    value: data?.overview?.totalProducts?.toLocaleString() || "0",
    icon: Package,
    color: "bg-orange-500"
  }
];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Track your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

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

      {/* Top Products */}
      <TopProducts products={data.topProducts} />
    </div>
  );
}