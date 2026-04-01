"use client";

import { useState, useEffect, useRef } from "react";
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip
);

interface ChartDataPoint {
  date: string;
  value: number;
  count: number;
}

interface Props {
  dailySales: ChartDataPoint[];
  weeklySales: ChartDataPoint[];
  monthlySales: ChartDataPoint[];
}

type Timeframe = "7d" | "30d" | "90d";

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

function formatCurrency(n: number) {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function computeStats(data: ChartDataPoint[]) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const avg = data.length ? total / data.length : 0;
  const peak = data.reduce((a, b) => (a.value > b.value ? a : b), data[0] ?? { value: 0, date: "—", count: 0 });
  const orders = data.reduce((s, d) => s + d.count, 0);
  const half = Math.floor(data.length / 2);
  const prevTotal = data.slice(0, half).reduce((s, d) => s + d.value, 0);
  const currTotal = data.slice(half).reduce((s, d) => s + d.value, 0);
  const pct = prevTotal ? Math.round(((currTotal - prevTotal) / prevTotal) * 100) : 0;
  return { total, avg, peak, orders, pct };
}

export default function RevenueChart({
  dailySales = [],
  weeklySales = [],
  monthlySales = [],
}: Props) {
  const [timeframe, setTimeframe] = useState<Timeframe>("7d");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const getDataset = (tf: Timeframe) => {
    switch (tf) {
      case "7d": return dailySales;
      case "30d": return weeklySales;
      case "90d": return monthlySales;
      default: return dailySales;
    }
  };

  const data = getDataset(timeframe);
  const stats = data.length ? computeStats(data) : null;

  const isDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const REV_COLOR = "#3b82f6";
  const ORD_COLOR = "#10b981";
  const GRID_COLOR = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const TICK_COLOR = isDark ? "#888" : "#999";

  function buildConfig(d: ChartDataPoint[]): ChartConfiguration<"line"> {
    return {
      type: "line",
      data: {
        labels: d.map((p) => p.date),
        datasets: [
          {
            label: "Revenue",
            data: d.map((p) => p.value),
            borderColor: REV_COLOR,
            backgroundColor: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.05)",
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: REV_COLOR,
            pointBorderColor: isDark ? "#1a1a1a" : "#fff",
            pointBorderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: "y",
          },
          {
            label: "Orders",
            data: d.map((p) => p.count),
            borderColor: ORD_COLOR,
            backgroundColor: "transparent",
            borderWidth: 1.5,
            pointRadius: 2,
            pointHoverRadius: 5,
            pointBackgroundColor: ORD_COLOR,
            borderDash: [5, 3],
            fill: false,
            tension: 0.4,
            yAxisID: "y2",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? "#1c1c1e" : "#fff",
            borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
            borderWidth: 1,
            titleColor: isDark ? "#fff" : "#111",
            bodyColor: isDark ? "#aaa" : "#555",
            padding: 12,
            callbacks: {
              label: (ctx) => {
                if (ctx.datasetIndex === 0) return `  Revenue: ${formatCurrency(ctx.parsed.y || 0)}`;
                return `  Orders: ${ctx.parsed.y}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: GRID_COLOR },
            border: { display: false },
            ticks: { color: TICK_COLOR, font: { size: 11 }, maxTicksLimit: 8 },
          },
          y: {
            position: "left",
            grid: { color: GRID_COLOR },
            border: { display: false },
            ticks: {
              color: TICK_COLOR,
              font: { size: 11 },
              callback: (v) => formatCurrency(Number(v)),
            },
          },
          y2: {
            position: "right",
            grid: { drawOnChartArea: false },
            border: { display: false },
            ticks: { color: ORD_COLOR, font: { size: 11 } },
          },
        },
        animation: { duration: 500, easing: "easeInOutQuart" },
      },
    };
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, buildConfig(data));
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data.labels = data.map((p) => p.date);
    chart.data.datasets[0].data = data.map((p) => p.value);
    chart.data.datasets[1].data = data.map((p) => p.count);
    chart.update();
  }, [timeframe, dailySales, weeklySales, monthlySales]);

  if (!data.length) {
    return (
      <div className="bg-white p-8 rounded-xl border text-center">
        <p className="text-gray-500">No data available for this period</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Revenue Overview</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-gray-900">
              {stats ? formatCurrency(stats.total) : "—"}
            </p>
            {stats && (
              <span className={`text-xs ${stats.pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.pct >= 0 ? '↑' : '↓'} {Math.abs(stats.pct)}%
              </span>
            )}
          </div>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                timeframe === tf.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-lg font-semibold text-gray-900">{stats ? formatCurrency(stats.total) : "—"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Average / Day</p>
          <p className="text-lg font-semibold text-gray-900">{stats ? formatCurrency(stats.avg) : "—"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Peak Day</p>
          <p className="text-lg font-semibold text-gray-900">{stats ? formatCurrency(stats.peak.value) : "—"}</p>
          <p className="text-xs text-gray-400">{stats?.peak.date}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-lg font-semibold text-gray-900">{stats ? stats.orders.toLocaleString() : "—"}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <canvas ref={canvasRef} />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-600">Orders</span>
        </div>
      </div>
    </div>
  );
}