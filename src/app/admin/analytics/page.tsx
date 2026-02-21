// "use client";

// import React from "react";
// import {
//   TrendingUp,
//   Users,
//   ShoppingCart,
//   DollarSign,
//   Eye,
//   Clock,
//   Calendar,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Mock data
// const revenueData = [
//   { name: "Jan", revenue: 4000, orders: 240 },
//   { name: "Feb", revenue: 3000, orders: 198 },
//   { name: "Mar", revenue: 5000, orders: 305 },
//   { name: "Apr", revenue: 4500, orders: 275 },
//   { name: "May", revenue: 6000, orders: 380 },
//   { name: "Jun", revenue: 5500, orders: 342 },
// ];

// const categoryData = [
//   { name: "Electronics", value: 45 },
//   { name: "Clothing", value: 30 },
//   { name: "Books", value: 15 },
//   { name: "Home", value: 10 },
// ];

// const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

// const trafficData = [
//   { name: "Mon", visitors: 1200 },
//   { name: "Tue", visitors: 1350 },
//   { name: "Wed", visitors: 1500 },
//   { name: "Thu", visitors: 1420 },
//   { name: "Fri", visitors: 1800 },
//   { name: "Sat", visitors: 2100 },
//   { name: "Sun", visitors: 1900 },
// ];

// export default function AnalyticsPage() {
//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
//           <p className="text-sm text-gray-500 mt-1">Real-time insights & trends</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg flex items-center gap-1">
//             <Clock className="w-4 h-4" />
//             Today
//           </button>
//           <button className="px-3 py-1.5 text-sm hover:bg-gray-100 rounded-lg">Week</button>
//           <button className="px-3 py-1.5 text-sm hover:bg-gray-100 rounded-lg">Month</button>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Revenue</p>
//               <p className="text-2xl font-bold text-gray-800">$45,678</p>
//               <p className="text-xs text-green-600 mt-2 flex items-center">
//                 <ArrowUp className="w-3 h-3 mr-1" />
//                 +12.5%
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <DollarSign className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Orders</p>
//               <p className="text-2xl font-bold text-gray-800">1,234</p>
//               <p className="text-xs text-green-600 mt-2 flex items-center">
//                 <ArrowUp className="w-3 h-3 mr-1" />
//                 +8.2%
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <ShoppingCart className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Visitors</p>
//               <p className="text-2xl font-bold text-gray-800">8,945</p>
//               <p className="text-xs text-green-600 mt-2 flex items-center">
//                 <ArrowUp className="w-3 h-3 mr-1" />
//                 +23.1%
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <Eye className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Conversion</p>
//               <p className="text-2xl font-bold text-gray-800">3.6%</p>
//               <p className="text-xs text-red-600 mt-2 flex items-center">
//                 <ArrowDown className="w-3 h-3 mr-1" />
//                 -1.2%
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//               <TrendingUp className="w-6 h-6 text-orange-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
//         {/* Revenue Chart */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <h3 className="font-semibold text-gray-800 mb-4">Revenue Overview</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#93C5FD" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Category Distribution */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <h3 className="font-semibold text-gray-800 mb-4">Sales by Category</h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="mt-4 space-y-2">
//             {categoryData.map((item, i) => (
//               <div key={item.name} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
//                   <span className="text-sm text-gray-600">{item.name}</span>
//                 </div>
//                 <span className="text-sm font-medium">{item.value}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Traffic Chart */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//         <h3 className="font-semibold text-gray-800 mb-4">Traffic Overview</h3>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={trafficData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="visitors" fill="#3B82F6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

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
      value: `$${data.overview.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      label: "Total Orders",
      value: data.overview.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "bg-blue-500"
    },
    {
      label: "Total Users",
      value: data.overview.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-purple-500"
    },
    {
      label: "Total Products",
      value: data.overview.totalProducts.toLocaleString(),
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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