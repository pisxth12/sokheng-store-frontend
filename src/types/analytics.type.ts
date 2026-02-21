export interface AnalyticsData {
    overview: {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
   dailySales: Array<{
    date: string;
    value: number;
    count: number;
  }>;
  weeklySales: Array<{
    date: string;
    value: number;
    count: number;
  }>;
  monthlySales: Array<{
    date: string;
    value: number;
    count: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    revenue: number;
    percentage: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    image: string;
    sold: number;
    revenue: number;
  }>;
  todayVsYesterday: Comparison;
  thisWeekVsLastWeek: Comparison;
  thisMonthVsLastMonth: Comparison;
}


export interface Comparison {
  current: number;
  previous: number;
  percentageChange: number;
  trend: "up" | "down" | "same";
}