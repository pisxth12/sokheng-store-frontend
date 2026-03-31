export interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
}

export interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

export interface TopBrand {
  name: string;
  sold: number;
  revenue: number;
}

export interface TopCategory {
  name: string;
  sold: number;
  revenue: number;
}

export interface TopSpender {
  fullName: string;
  email: string;
  totalSpent: number;
  orders: number;
}

export interface ReportData {
  generatedAt: string;
  dateRange: string;
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageOrderValue: number;
  monthlyData: MonthlyData[];
  statusData: StatusData[];
  topProducts: TopProduct[];
  topBrands: TopBrand[];
  topCategories: TopCategory[];
  topSpenders: TopSpender[];
}

export interface RangeOption {
  value: string;
  label: string;
}

export interface ReportOptions {
  ranges: RangeOption[];
  defaultRange: string;
  formats: string[];
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    averageOrderValue: number;
  };
}
