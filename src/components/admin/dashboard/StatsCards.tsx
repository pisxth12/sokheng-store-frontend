import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from "lucide-react";

interface Props {
  data: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    todayOrders: number;
    lowStockCount: number;
  };
}

const stats = [
  { 
    key: 'totalRevenue', 
    label: 'Revenue', 
    icon: DollarSign, 
    gradient: 'from-green-500 to-emerald-500',
    lightBg: 'bg-green-50',
    textColor: 'text-green-600',
    format: (v: number) => v ? `$${v.toLocaleString()}` : '$0',  // ✅ Added null check
    change: '+12.5%',
    trend: 'up'
  },
  { 
    key: 'totalOrders', 
    label: 'Orders', 
    icon: ShoppingCart, 
    gradient: 'from-blue-500 to-indigo-500',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-600',
    format: (v: number) => v ? v.toLocaleString() : '0',  // ✅ Added null check
    change: '+8.2%',
    trend: 'up'
  },
  { 
    key: 'totalProducts', 
    label: 'Products', 
    icon: Package, 
    gradient: 'from-purple-500 to-pink-500',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-600',
    format: (v: number) => v ? v.toLocaleString() : '0',  // ✅ Added null check
    change: '+5.3%',
    trend: 'up'
  },
  { 
    key: 'totalUsers', 
    label: 'Users', 
    icon: Users, 
    gradient: 'from-orange-500 to-amber-500',
    lightBg: 'bg-orange-50',
    textColor: 'text-orange-600',
    format: (v: number) => v ? v.toLocaleString() : '0',  // ✅ Added null check
    change: '+23.1%',
    trend: 'up'
  },
  { 
    key: 'todayOrders', 
    label: "Today's Orders", 
    icon: TrendingUp, 
    gradient: 'from-indigo-500 to-purple-500',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    format: (v: number) => v ? v.toLocaleString() : '0',  // ✅ Added null check
    change: '+3',
    trend: 'up'
  },
  { 
    key: 'lowStockCount', 
    label: 'Low Stock', 
    icon: AlertCircle, 
    gradient: 'from-red-500 to-rose-500',
    lightBg: 'bg-red-50',
    textColor: 'text-red-600',
    format: (v: number) => v ? v.toLocaleString() : '0',  // ✅ Added null check
    change: 'Alert',
    trend: 'down'
  },
];

const TrendIndicator = ({ trend, change }: { trend: string; change: string }) => {
  if (trend === 'up') {
    return (
      <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <ArrowUp className="w-3 h-3" />
        <span>{change}</span>
      </div>
    );
  }
  if (trend === 'down') {
    return (
      <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
        <ArrowDown className="w-3 h-3" />
        <span>{change}</span>
      </div>
    );
  }
  return (
    <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
      {change}
    </div>
  );
};

export const StatsCards = ({ data }: Props) => {
  return (
    <>
      {/* Header with total summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500">Your store performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(({ key, label, icon: Icon, gradient, lightBg, textColor, format, change, trend }) => {
          const value = data[key as keyof typeof data];
          
          return (
            <div
              key={key}
              className="group relative bg-white  shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative p-5">
                {/* Header with icon and menu */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl ${lightBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Value with null check */}
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {format ? format(value) : (value ?? 0).toLocaleString()}
                  </p>
                </div>

                {/* Label and trend */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{label}</p>
                  <TrendIndicator trend={trend} change={change} />
                </div>

                {/* Progress bar (with null check) */}
                <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${Math.min(100, ((value ?? 0) / 1000) * 100)}%`,
                      opacity: 0.7
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick insights footer (with null checks) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
          <p className="text-sm text-blue-600 font-medium mb-1">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900">
            ${(data.totalRevenue ?? 0).toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">↑ 12.5% from last month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
          <p className="text-sm text-purple-600 font-medium mb-1">Average Order Value</p>
          <p className="text-xl font-bold text-gray-900">
            ${(((data.totalRevenue ?? 0) / (data.totalOrders ?? 1))).toFixed(2)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">↑ 5.2% vs last month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl">
          <p className="text-sm text-orange-600 font-medium mb-1">Conversion Rate</p>
          <p className="text-xl font-bold text-gray-900">3.2%</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-500">↓ 0.5% from last month</span>
          </div>
        </div>
      </div>
    </>
  );
};