"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Clock, Package, CheckCircle, XCircle } from "lucide-react";

interface Props {
  data: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = {
  PENDING:    "#f59e0b",
  PROCESSING: "#6366f1",
  COMPLETED:  "#10b981",
  CANCELLED:  "#f43f5e",
};

const BG_COLORS = {
  PENDING:    "bg-amber-50 text-amber-500",
  PROCESSING: "bg-indigo-50 text-indigo-500",
  COMPLETED:  "bg-emerald-50 text-emerald-500",
  CANCELLED:  "bg-rose-50 text-rose-500",
};

const STATUS_ICONS = {
  PENDING:    Clock,
  PROCESSING: Package,
  COMPLETED:  CheckCircle,
  CANCELLED:  XCircle,
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "Pending",
  PROCESSING: "Processing",
  COMPLETED:  "Completed",
  CANCELLED:  "Cancelled",
};

export default function StatusChart({ data }: Props) {
  const chartData = data.filter((d) => d.count > 0);
  const total = chartData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 w-full ">

      {/* Header */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-400 mb-1">
          Overview
        </p>
        <h3 className="text-base font-semibold text-stone-900 tracking-tight">
          Orders by Status
        </h3>
      </div>

      {/* Donut + center label */}
      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={COLORS[entry.status as keyof typeof COLORS] ?? "#d1d5db"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e7e5e4",
                fontSize: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              formatter={(value: any | undefined, name: any) => [
                `${value ?? 0} orders`,
                STATUS_LABEL[name] ?? name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-stone-900 tabular-nums leading-none">
            {total}
          </span>
          <span className="text-[11px] text-stone-400 font-medium mt-0.5 tracking-wide">
            total
          </span>
        </div>
      </div>

      {/* Legend rows */}
      <div className="mt-4 space-y-2.5">
        {chartData.map((item) => {
          const Icon = STATUS_ICONS[item.status as keyof typeof STATUS_ICONS] ?? Package;
          const iconCls = BG_COLORS[item.status as keyof typeof BG_COLORS] ?? "bg-stone-100 text-stone-400";
          return (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconCls}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-stone-700">
                  {STATUS_LABEL[item.status] ?? item.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-stone-900 tabular-nums">
                  {item.count}
                </span>
                <span className="text-xs text-stone-400 tabular-nums w-10 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-400">
          Total Orders
        </span>
        <span className="text-base font-semibold text-stone-900 tabular-nums tracking-tight">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}