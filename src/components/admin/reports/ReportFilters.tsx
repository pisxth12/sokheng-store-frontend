"use client";

import { RangeOption } from "@/types/admin/report.type";

interface Props {
  ranges: RangeOption[];
  selectedRange: string;
  onRangeChange: (range: string) => void;
  onDownload: () => void;
  loading?: boolean;
}

export default function ReportFilters({
  ranges,
  selectedRange,
  onRangeChange,
  onDownload,
  loading,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <select
        value={selectedRange}
        onChange={(e) => onRangeChange(e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {ranges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>

      <button
        onClick={onDownload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? "Loading..." : "Download PDF"}
      </button>
    </div>
  );
}
