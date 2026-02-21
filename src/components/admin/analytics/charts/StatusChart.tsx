"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Clock, Package, CheckCircle, XCircle } from "lucide-react";

interface Props {
  data: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = {
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  COMPLETED: "#22c55e",
  CANCELLED: "#ef4444",
};

const STATUS_ICONS = {
  PENDING: Clock,
  PROCESSING: Package,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
};

export default function StatusChart({ data }: Props) {
  const chartData = data.filter(d => d.count > 0);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-4">Orders by Status</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell 
                  key={entry.status} 
                  fill={COLORS[entry.status as keyof typeof COLORS] || "#9ca3af"} 
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {chartData.map((item) => {
          const Icon = STATUS_ICONS[item.status as keyof typeof STATUS_ICONS] || Package;
          return (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[item.status as keyof typeof COLORS] }} />
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{item.status}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
                <span className="text-xs text-gray-500 w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}