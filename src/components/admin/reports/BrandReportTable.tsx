"use client";

import { TopBrand } from "@/types/admin/report.type";

interface Props {
  brands: TopBrand[];
}

const RANK_STYLES: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-amber-50", text: "text-amber-700" },
  2: { bg: "bg-slate-100", text: "text-slate-500" },
  3: { bg: "bg-orange-50", text: "text-orange-600" },
};

function RankBadge({ rank }: { rank: number }) {
  const style = RANK_STYLES[rank];
  if (style) {
    return (
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
      >
        {rank}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-medium text-gray-400">
      {rank}
    </span>
  );
}

function BrandAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "bg-blue-50 text-blue-700",
    "bg-violet-50 text-violet-700",
    "bg-emerald-50 text-emerald-700",
    "bg-rose-50 text-rose-700",
    "bg-orange-50 text-orange-700",
    "bg-cyan-50 text-cyan-700",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold shrink-0 ${color}`}
    >
      {initials}
    </span>
  );
}

function RevenueBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-800 tabular-nums w-20 text-right">
        $
        {value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
        <div
          className="h-full bg-gray-800 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const BrandReportTable = ({ brands }: Props) => {
  if (!brands || brands.length === 0) return null;

  const maxRevenue = Math.max(...brands.map((b) => b.revenue));
  const totalSold = brands.reduce((sum, b) => sum + b.sold, 0);
  const totalRevenue = brands.reduce((sum, b) => sum + b.revenue, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">
            Top Brands
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {brands.length} brands · {totalSold.toLocaleString()} units sold
          </p>
        </div>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          by revenue
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-300 overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-20">
                Sold
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider pr-6">
                Revenue
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {brands.map((brand, index) => {
              const rank = index + 1;
              const soldPct = totalSold > 0 ? (brand.sold / totalSold) * 100 : 0;
              const revenuePct =
                totalRevenue > 0 ? (brand.revenue / totalRevenue) * 100 : 0;

              return (
                <tr
                  key={index}
                  className="group hover:bg-gray-50/60 transition-colors duration-100"
                >
                  {/* Rank */}
                  <td className="px-4 py-3.5">
                    <RankBadge rank={rank} />
                  </td>

                  {/* Brand name + avatar */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <BrandAvatar name={brand.name} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-gray-800 leading-tight truncate">
                          {brand.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1 w-14 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-300 rounded-full"
                              style={{ width: `${revenuePct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {revenuePct.toFixed(0)}% of revenue
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Units sold */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-medium text-gray-700 tabular-nums">
                        {brand.sold.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {soldPct.toFixed(0)}%
                      </span>
                    </div>
                  </td>

                  {/* Revenue + bar */}
                  <td className="px-4 py-3.5 pr-6">
                    <RevenueBar value={brand.revenue} max={maxRevenue} />
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer totals */}
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50/70">
              <td colSpan={2} className="px-4 py-3 text-xs font-medium text-gray-400">
                Total
              </td>
              <td className="px-4 py-3 text-right text-xs font-semibold text-gray-700 tabular-nums">
                {totalSold.toLocaleString()}
              </td>
              <td className="px-4 py-3 pr-6 text-right text-xs font-semibold text-gray-700 tabular-nums">
                $
                {totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BrandReportTable;