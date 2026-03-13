export interface DashboardSummary {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  newUsersToday: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  lowStockItems: Array<{
    id: number;
    name: string;
    stock: number;
    image: string;
  }>;
  salesLast7Days: Array<{
    date: string;
    value: number;
    count: number;
  }>;
  salesLast30Days: Array<{
    date: string;
    value: number;
    count: number;
  }>;
  ordersByStatus: Record<string, number>;
  topCategories: Array<{
    category: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
  }>;
  recentUsers: Array<{
    id: number;
    name: string;
    email: string;
    joinDate: string;
  }>;
}
