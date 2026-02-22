"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: Array<{
    date: string;
    value: number;
    count: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-lg font-bold text-blue-600">${payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">{payload[0].payload.count} orders</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const avg = data.length ? total / data.length : 0;


  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Revenue Trend</h3>
        <div className="text-sm text-gray-500">
          Avg: ${avg.toFixed(0)}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getMonth()+1}/${d.getDate()}`;
              }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}