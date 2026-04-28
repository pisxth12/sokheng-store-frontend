"use client";

import { MonthlyData, StatusData } from "@/types/admin/report.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Props {
  monthlyData: MonthlyData[];
  statusData: StatusData[];
}

export default function ReportCharts({ monthlyData, statusData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Bar Chart */}
      <div className="border rounded-2xl p-2 border-slate-300">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Monthly Performance
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#3b82f6"
                name="Revenue"
              />
              <Bar
                yAxisId="right"
                dataKey="orders"
                fill="#10b981"
                name="Orders"
              />
            </BarChart>
            
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      {statusData.length > 0 && (
        <div className="border rounded-2xl p-2 border-slate-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => {
                    const percentage = percent
                      ? (percent * 100).toFixed(0)
                      : "0";
                    return `${name} ${percentage}%`;
                  }}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
