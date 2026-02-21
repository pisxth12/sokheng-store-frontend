

"use client";

import { 
  DollarSign, ShoppingCart, Package, Users, 
  TrendingUp, AlertCircle, Loader2 
} from "lucide-react";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { OrderStatusChart } from "@/components/admin/dashboard/OrderStatusChart";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { RecentUsers } from "@/components/admin/dashboard/RecentUsers";
import { LowStockAlert } from "@/components/admin/dashboard/LowStockAlert";
import { RevenueChart } from "@/components/admin/dashboard/charts/RevenueChart";
import { useDashboard } from "@/hooks/admin/useDashboard";

export default function AdminDashboardPage() {
  const { data, loading, error, refresh } = useDashboard();

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
        <button onClick={refresh} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      <StatsCards data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={data.salesLast30Days} />
        </div>
        <OrderStatusChart data={data.ordersByStatus} />
      </div>

      {data.lowStockItems?.length > 0 && <LowStockAlert items={data.lowStockItems} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={data.recentOrders} />
        <RecentUsers users={data.recentUsers} />
      </div>
    </div>
  );
}