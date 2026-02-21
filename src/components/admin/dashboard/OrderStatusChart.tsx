"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  data: Record<string, number>;
}

const STATUS_CONFIG = {
  PENDING: {
    color: '#f59e0b',
    lightColor: '#fef3c7',
    icon: Clock,
    label: 'Pending',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200'
  },
  PROCESSING: {
    color: '#3b82f6',
    lightColor: '#dbeafe',
    icon: ShoppingBag,
    label: 'Processing',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200'
  },
  COMPLETED: {
    color: '#10b981',
    lightColor: '#d1fae5',
    icon: CheckCircle,
    label: 'Completed',
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
    borderClass: 'border-green-200'
  },
  CANCELLED: {
    color: '#ef4444',
    lightColor: '#fee2e2',
    icon: XCircle,
    label: 'Cancelled',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-200'
  },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const config = STATUS_CONFIG[data.name as keyof typeof STATUS_CONFIG];
    
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900 mb-1">{config?.label || data.name}</p>
        <p className="text-lg font-bold" style={{ color: config?.color }}>
          {data.value} orders
        </p>
      </div>
    );
  }
  return null;
};

export const OrderStatusChart = ({ data }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
    config: STATUS_CONFIG[name as keyof typeof STATUS_CONFIG] || {
      color: '#9ca3af',
      label: name,
      bgClass: 'bg-gray-50',
      textClass: 'text-gray-700',
      borderClass: 'border-gray-200'
    }
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header with total */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Orders by Status</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total orders</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.config.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        {chartData.map((item) => {
          const Icon = item.config.icon || ShoppingBag;
          const percentage = ((item.value / total) * 100).toFixed(1);
          
          return (
            <div
              key={item.name}
              className={`flex items-center gap-3 p-3 rounded-xl ${item.config.bgClass} border ${item.config.borderClass} hover:shadow-sm transition-shadow cursor-pointer`}
              onMouseEnter={() => setActiveIndex(chartData.findIndex(d => d.name === item.name))}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.config.bgClass}`}>
                <Icon className={`w-5 h-5 ${item.config.textClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">{item.config.label}</p>
                <p className="text-base font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">{percentage}%</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.config.color }} />
            </div>
          );
        })}
      </div>

      {/* Quick summary */}
      <div className="mt-4 pt-3 text-center">
        <p className="text-xs text-gray-400">
          {chartData.filter(d => d.value > 0).length} statuses active
        </p>
      </div>
    </div>
  );
};