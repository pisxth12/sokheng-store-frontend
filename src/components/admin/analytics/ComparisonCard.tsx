import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  title: string;
  current: number;
  previous: number;
  percentage: number;
  trend: "up" | "down" | "same";
}

const colorMap = {
  up: { 
    bar: 'bg-green-500', dot: 'bg-green-500', border: 'border-green-100', 
    value: 'text-green-700', icon: TrendingUp, chip: 'increase' 
  },
  down: { 
    bar: 'bg-red-500', dot: 'bg-red-500', border: 'border-red-100', 
    value: 'text-red-700', icon: TrendingDown, chip: 'decrease' 
  },
  same: { 
    bar: 'bg-gray-500', dot: 'bg-gray-500', border: 'border-gray-100', 
    value: 'text-gray-700', icon: Minus, chip: 'stable' 
  },
};

export default function ComparisonCard({ title, current, previous, percentage, trend }: Props) {
  const safeCurrent = current ?? 0;
  const safePrevious = previous ?? 0;
  const safePercentage = percentage ?? 0;
  const isUp = trend === "up";
  const isDown = trend === "down";
  const isSame = trend === "same";
  
  const c = colorMap[trend];
  const Icon = c.icon;

  return (
    <div className={`relative bg-white rounded-2xl pt-7 pb-6 px-6 border-[1.5px] ${c.border} overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}>
      {/* Top bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${c.bar}`} />
      
      {/* Dot */}
      <span className={`block w-2 h-2 rounded-full ${c.dot} mb-3`} />
      
      {/* Title */}
      <span className="block text-[10px] tracking-widest uppercase text-gray-400 mb-3 font-medium">
        {title}
      </span>
      
      {/* Current Value & Trend */}
      <div className="flex items-center justify-between">
        <span className={`text-3xl font-extrabold tracking-tight ${c.value}`}>
          ${safeCurrent.toLocaleString()}
        </span>
        <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-500'}`}>
          {!isSame && <Icon className="w-4 h-4" />}
          <span>{isSame ? '0.0' : `${safePercentage.toFixed(1)}`}%</span>
        </div>
      </div>
      
      {/* Previous Value */}
      <p className="text-xs text-gray-400 mt-2">
        Previous: ${safePrevious.toLocaleString()}
      </p>
      
      {/* Chip */}
      <span className="absolute bottom-4 right-5 text-[9px] tracking-widest uppercase text-gray-300 font-medium">
        {c.chip}
      </span>
    </div>
  );
}