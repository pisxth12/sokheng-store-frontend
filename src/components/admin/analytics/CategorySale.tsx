
import { TrendingUp } from "lucide-react";

interface Props {
  data: Array<{
    category: string;
    sales: number;
    revenue: number;
    percentage: number;
  }>;
}

const BAR_COLORS = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
];

export default function CategorySales({ data }: Props) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 w-full  font-[Geist,sans-serif]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-1">
            Performance
          </p>
          <h3 className="text-base font-semibold text-stone-900 leading-none">
            Sales by Category
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1.5 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {data.length} categories
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-5">
        {data.map((item, i) => (
          <div key={item.category}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                <span className="text-sm font-medium text-stone-800">{item.category}</span>
                <span className="text-xs text-stone-400">{item.sales} units</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-stone-900 tabular-nums">
                  ${item.revenue.toLocaleString()}
                </span>
                <span className="text-xs text-stone-400 tabular-nums w-8 text-right">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                style={{ width: `${(item.revenue / totalRevenue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between items-center">
        <span className="text-xs font-medium tracking-widest uppercase text-stone-400">
          Total Revenue
        </span>
        <span className="text-base font-semibold text-stone-900 tabular-nums">
          ${totalRevenue.toLocaleString()}
        </span>
      </div>

    </div>
  );
}