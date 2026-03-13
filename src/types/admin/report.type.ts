export interface MonthlyData{
    month: string;
    revenue: number;
    orders: number;
}

export interface StatusData {
    name: string;
    value: number;
    color: string;
}


export interface TopProduct{
    name: string;
    sold: number;
    revenue: number;
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

