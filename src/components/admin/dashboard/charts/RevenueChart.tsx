"use client";

import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  ChevronDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Props {
  data: Array<{ date: string; value: number; count?: number }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const prevValue = payload[0].payload.prevValue;
    const percentChange = prevValue ? ((value - prevValue) / prevValue * 100).toFixed(1) : null;
    
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900">${value.toLocaleString()}</p>
        {percentChange && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${
            Number(percentChange) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {Number(percentChange) >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(Number(percentChange))}% from previous
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({ data }: Props) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Calculate metrics
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = data.length ? total / data.length : 0;
  const max = Math.max(...data.map(d => d.value));
  const maxDay = data.find(d => d.value === max)?.date;

  // Format data with previous value for comparison
  const enhancedData = data.map((item, index) => ({
    ...item,
    prevValue: index > 0 ? data[index - 1].value : null
  }));

  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header with metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Revenue Overview</h3>
            <p className="text-2xl font-bold text-gray-900">${total.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total ({timeframe})</p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {timeframes.find(t => t.value === timeframe)?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => {
                    setTimeframe(tf.value as any);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    timeframe === tf.value ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mini metrics cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Average</p>
          <p className="text-sm font-bold text-gray-900">${average.toFixed(0)}</p>
          <p className="text-[10px] text-gray-400">per day</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Highest</p>
          <p className="text-sm font-bold text-gray-900">${max.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">{maxDay}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Growth</p>
          <p className="text-sm font-bold text-green-600">+23.5%</p>
          <p className="text-[10px] text-gray-400">vs last period</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={enhancedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => `$${value}`}
              width={60}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            />
            
            {/* Reference line for average */}
            <ReferenceLine 
              y={average} 
              stroke="#9ca3af" 
              strokeDasharray="3 3" 
              strokeWidth={1}
              label={{ 
                value: 'Avg', 
                position: 'right', 
                fill: '#9ca3af', 
                fontSize: 10 
              }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <span className="text-xs text-gray-500">Average</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium text-green-600">+12.3% vs last month</span>
        </div>
      </div>
    </div>
  );
};