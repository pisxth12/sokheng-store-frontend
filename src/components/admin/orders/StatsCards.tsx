"use client";

interface StatsCardsOrderProps {
  stats: {
    totalOrders: number;
    totalOrdersGrowth: number;
    totalRevenue: number;
    totalRevenueGrowth: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    avgOrderValue: number;
    avgOrderValueGrowth: number;
  };
}

const cards = (stats: StatsCardsOrderProps['stats']) => [
  { 
    label: 'Total Orders', 
    value: stats.totalOrders.toLocaleString(), 
    chip: 'orders', 
    growth: stats.totalOrdersGrowth,
    color: 'blue'
  },
  { 
    label: 'Revenue', 
    value: `$${stats.totalRevenue.toLocaleString()}`, 
    chip: 'USD', 
    growth: stats.totalRevenueGrowth,
    color: 'green'
  },
  { 
    label: 'Orders Status', 
    value: '', 
    chip: 'status',
    statusData: {
      completed: stats.completedOrders,
      pending: stats.pendingOrders,
      cancelled: stats.cancelledOrders
    },
    color: 'purple'
  },
  { 
    label: 'Avg. Order Value', 
    value: `$${stats.avgOrderValue.toFixed(2)}`, 
    chip: 'per order', 
    growth: stats.avgOrderValueGrowth,
    color: 'orange'
  },
];

const colorMap: Record<string, { bar: string; dot: string; border: string; value: string }> = {
  blue:   { bar: 'bg-blue-500',   dot: 'bg-blue-500',   border: 'border-blue-100',   value: 'text-blue-700'   },
  green:  { bar: 'bg-green-500',  dot: 'bg-green-500',  border: 'border-green-100',  value: 'text-green-800'  },
  purple: { bar: 'bg-purple-500', dot: 'bg-purple-500', border: 'border-purple-100', value: 'text-purple-800' },
  orange: { bar: 'bg-orange-500', dot: 'bg-orange-500', border: 'border-orange-100', value: 'text-orange-700' },
};

export default function StatsCardsOrder({ stats }: StatsCardsOrderProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards(stats).map(({ label, value, chip, growth, statusData, color }) => {
        const c = colorMap[color];
        const isPositive = growth !== undefined && growth >= 0;
        
        return (
          <div
            key={label}
            className={`relative bg-white rounded-2xl pt-7 pb-6 px-6 border-[1.5px] ${c.border} overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}
          >
            {/* Top bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.75 ${c.bar}`} />
            
            {/* Dot */}
            <span className={`block w-2 h-2 rounded-full ${c.dot} mb-3`} />
            
            {/* Label */}
            <span className="block text-[10px] tracking-widest uppercase text-gray-400 mb-1 font-medium">
              {label}
            </span>
            
            {/* Value or Status */}
            {statusData ? (
              <div className="flex gap-2 mt-1 mb-2">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ {statusData.completed}
                </span>
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                  ⏳ {statusData.pending}
                </span>
                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  ✗ {statusData.cancelled}
                </span>
              </div>
            ) : (
              <span className={`block text-4xl font-extrabold tracking-tight leading-none ${c.value}`}>
                {value}
              </span>
            )}
            
            {/* Growth indicator */}
            {growth !== undefined && (
              <span className={`block text-[11px] mt-2 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
              </span>
            )}
            
            {/* Chip */}
            <span className="absolute bottom-4 right-5 text-[9px] tracking-widest uppercase text-gray-300 font-medium">
              {chip}
            </span>
          </div>
        );
      })}
    </div>
  );
}