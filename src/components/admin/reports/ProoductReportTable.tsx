"use client";

import { TopProduct } from "@/types/admin/report.type";

interface Props {
  products: TopProduct[];
}

const RANK_STYLES: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "bg-amber-50", text: "text-amber-700", label: "Gold" },
  2: { bg: "bg-slate-100", text: "text-slate-500", label: "Silver" },
  3: { bg: "bg-orange-50", text: "text-orange-600", label: "Bronze" },
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

function RevenueBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-800 tabular-nums w-20 text-right">
        ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

export default function ProductReportTable({ products }: Props) {
  if (products.length === 0) return null;

  const maxRevenue = Math.max(...products.map((p) => p.revenue));
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);

  return (
    <div className="flex flex-col gap-4 ">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">
            Top Products
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {products.length} products · {totalSold.toLocaleString()} units sold
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
                Product
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
            {products.map((product, index) => {
              const rank = index + 1;
              const soldPct = totalSold > 0 ? (product.sold / totalSold) * 100 : 0;

              return (
                <tr
                  key={index}
                  className="group hover:bg-gray-50/60 transition-colors duration-100"
                >
                  {/* Rank */}
                  <td className="px-4 py-3.5">
                    <RankBadge rank={rank} />
                  </td>

                  {/* Product name */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-800 leading-tight line-clamp-1">
                        {product.name}
                      </span>
                      {/* Sold mini-bar */}
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-300 rounded-full"
                            style={{ width: `${soldPct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {soldPct.toFixed(0)}% of sales
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Units sold */}
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm font-medium text-gray-700 tabular-nums">
                      {product.sold.toLocaleString()}
                    </span>
                  </td>

                  {/* Revenue + bar */}
                  <td className="px-4 py-3.5 pr-6">
                    <RevenueBar value={product.revenue} max={maxRevenue} />
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
                {products
                  .reduce((s, p) => s + p.revenue, 0)
                  .toLocaleString("en-US", {
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
}