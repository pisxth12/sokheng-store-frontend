"use client";

// Stats Cards Component
export const StatsCardsOrder = ({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500">Total Orders</p>
        <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
        <p className={`text-xs ${stats.totalOrdersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stats.totalOrdersGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.totalOrdersGrowth).toFixed(1)}%
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500">Revenue</p>
        <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
        <p className={`text-xs ${stats.totalRevenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stats.totalRevenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.totalRevenueGrowth).toFixed(1)}%
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500">Orders Status</p>
        <div className="flex gap-2 text-sm mt-1">
          <span className="text-green-600">✓ {stats.completedOrders}</span>
          <span className="text-yellow-600">⏳ {stats.pendingOrders}</span>
          <span className="text-red-600">✗ {stats.cancelledOrders}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Completed / Pending / Cancelled</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500">Avg. Order Value</p>
        <p className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</p>
        <p className={`text-xs ${stats.avgOrderValueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stats.avgOrderValueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.avgOrderValueGrowth).toFixed(1)}%
        </p>
      </div>
    </div>
  );
};