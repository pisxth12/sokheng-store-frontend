"use client";

import { Cell, PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

interface StatsCardsOrderProps {
  stats: {
    totalOrders: number;
    totalOrdersGrowth: number;
    totalRevenue: number;
    totalRevenueGrowth: number;
    completedOrders: number;
    pendingOrders: number;
    processingOrders: number;
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
    label: 'Avg. Order Value', 
    value: `$${stats.avgOrderValue.toFixed(2)}`, 
    chip: 'per order', 
    growth: stats.avgOrderValueGrowth,
    color: 'orange'
  },
  { 
    label: 'Orders Status', 
    value: '', 
    chip: 'status',
    statusData: {
      completed: stats.completedOrders,
      processing: stats.processingOrders,
      pending: stats.pendingOrders,
      cancelled: stats.cancelledOrders
    },
    color: 'purple'
  },
];

const colorMap: Record<string, { bar: string; dot: string; border: string; value: string }> = {
  blue:   { bar: 'bg-blue-500',   dot: 'bg-blue-500',   border: 'border-blue-100',   value: 'text-blue-700'   },
  green:  { bar: 'bg-green-500',  dot: 'bg-green-500',  border: 'border-green-100',  value: 'text-green-800'  },
  purple: { bar: 'bg-purple-500', dot: 'bg-purple-500', border: 'border-purple-100', value: 'text-purple-800' },
  orange: { bar: 'bg-orange-500', dot: 'bg-orange-500', border: 'border-orange-100', value: 'text-orange-700' },
};

// Status colors for the donut chart
const STATUS_COLORS = {
  completed: '#10b981',  // green
   processing: '#3b82f6', // blue
  pending: '#f59e0b',    // yellow/orange
  cancelled: '#ef4444'   // red
};

export default function StatsCardsOrder({ stats }: StatsCardsOrderProps) {
  // Prepare data for donut chart
  const statusData = [
    { name: 'Completed', value: stats.completedOrders, color: STATUS_COLORS.completed },
    { name: 'processing', value: stats.processingOrders, color: STATUS_COLORS.processing },
    { name: 'Pending', value: stats.pendingOrders, color: STATUS_COLORS.pending },
    { name: 'Cancelled', value: stats.cancelledOrders, color: STATUS_COLORS.cancelled },
  ].filter(item => item.value > 0);

  const totalStatusOrders = stats.completedOrders + stats.pendingOrders + stats.cancelledOrders + stats.processingOrders;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards(stats).map(({ label, value, chip, growth, statusData: data, color }) => {
        const c = colorMap[color];
        const isPositive = growth !== undefined && growth >= 0;
        const isStatusCard = label === 'Orders Status';
        
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
            {isStatusCard ? (
              <div className="space-y-3">
                {/* Donut Chart */}
                <div className="flex justify-center">
                  <div className="relative w-16 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={18}
                          outerRadius={28}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} orders`, '']}
                          contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{totalStatusOrders}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Legend */}
                <div className="grid grid-cols-2 justify-center  gap-1 text-[10px] font-medium">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full " style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.name}</span>
                      <span className="text-gray-900 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <span className={`block text-4xl font-extrabold tracking-tight leading-none ${c.value}`}>
                {value}
              </span>
            )}
            {/* Growth indicator */}
            {growth !== undefined && (
              <span className={`block text-[11px] mt-2 font-medium  ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
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