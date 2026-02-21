import { ArrowUp, ArrowDown } from "lucide-react";

interface Props {
  title: string;
  current: number;
  previous: number;
  percentage: number;
  trend: "up" | "down" | "same";
}

export default function ComparisonCard({ title, current, previous, percentage, trend }: Props) {
  // ✅ Add null checks with default values
  const safeCurrent = current ?? 0;
  const safePrevious = previous ?? 0;
  const safePercentage = percentage ?? 0;

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-900">
          ${safeCurrent.toLocaleString()}
        </p>
        <div className={`flex items-center gap-1 text-sm ${
          trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
        }`}>
          {trend === "up" && <ArrowUp className="w-4 h-4" />}
          {trend === "down" && <ArrowDown className="w-4 h-4" />}
          <span>{safePercentage.toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Previous: ${safePrevious.toLocaleString()}
      </p>
    </div>
  );
}