"use client";

import { TopSpender } from "@/types/admin/report.type";
import { useCallback, useState } from "react";

interface Props {
  spenders: TopSpender[];
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

const AVATAR_COLORS = [
  "bg-violet-50 text-violet-700",
  "bg-sky-50 text-sky-700",
  "bg-teal-50 text-teal-700",
  "bg-rose-50 text-rose-700",
  "bg-amber-50 text-amber-700",
  "bg-lime-50 text-lime-700",
  "bg-fuchsia-50 text-fuchsia-700",
];

function CustomerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0 ${color}`}
    >
      {initials}
    </span>
  );
}

function SpendBar({ value, max }: { value: number; max: number }) {
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

export default function TopSpendersTable({ spenders }: Props) {
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);

  const toggleEmail = useCallback((email: string) => {
    setExpandedEmail((prev) => (prev === email ? null : email));
  }, []);

  if (!spenders || spenders.length === 0) return null;

  const maxSpent = Math.max(...spenders.map((s) => s.totalSpent));
  const totalOrders = spenders.reduce((sum, s) => sum + s.orders, 0);
  const totalSpent = spenders.reduce((sum, s) => sum + s.totalSpent, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">
            Top Spenders
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {spenders.length} customers · {totalOrders.toLocaleString()} orders
          </p>
        </div>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          by total spent
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
                Customer
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                Orders
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider pr-6">
                Total Spent
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {spenders.map((spender, index) => {
              const rank = index + 1;
              const name = spender.fullName || "Unknown";
              const isExpanded = expandedEmail === spender.email;
              const isLongEmail = spender.email.length > 20;
              const spentPct =
                totalSpent > 0 ? (spender.totalSpent / totalSpent) * 100 : 0;

              return (
                <tr
                  key={index}
                  className="group hover:bg-gray-50/60 transition-colors duration-100"
                >
                  {/* Rank */}
                  <td className="px-4 py-3.5">
                    <RankBadge rank={rank} />
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={name} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-gray-800 leading-tight truncate">
                          {name}
                        </span>
                        {/* Email row */}
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-gray-400 truncate max-w-[140px]">
                            {isExpanded || !isLongEmail
                              ? spender.email
                              : spender.email.slice(0, 20) + "…"}
                          </span>
                          {isLongEmail && (
                            <button
                              onClick={() => toggleEmail(spender.email)}
                              className="text-[11px] text-gray-400 hover:text-gray-600 underline underline-offset-2 shrink-0 transition-colors"
                            >
                              {isExpanded ? "less" : "more"}
                            </button>
                          )}
                        </div>
                        {/* Spend share bar */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="h-1 w-14 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-300 rounded-full"
                              style={{ width: `${spentPct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {spentPct.toFixed(0)}% of spend
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Orders */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-medium text-gray-700 tabular-nums">
                        {spender.orders}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        avg $
                        {(spender.totalSpent / spender.orders).toLocaleString(
                          "en-US",
                          { minimumFractionDigits: 0, maximumFractionDigits: 0 }
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Total spent + bar */}
                  <td className="px-4 py-3.5 pr-6">
                    <SpendBar value={spender.totalSpent} max={maxSpent} />
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
                {totalOrders.toLocaleString()}
              </td>
              <td className="px-4 py-3 pr-6 text-right text-xs font-semibold text-gray-700 tabular-nums">
                $
                {totalSpent.toLocaleString("en-US", {
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