"use client";

import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

interface AnalyticsStatsCardProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
  };
  loading?: boolean;
}

const colorMap: Record<string, { bar: string; dot: string; border: string; value: string; iconBg: string; iconColor: string }> = {
  revenue: { 
    bar: 'bg-green-500', dot: 'bg-green-500', border: 'border-green-100', value: 'text-green-800',
    iconBg: 'bg-green-100', iconColor: 'text-green-700'
  },
  orders: { 
    bar: 'bg-blue-500', dot: 'bg-blue-500', border: 'border-blue-100', value: 'text-blue-800',
    iconBg: 'bg-blue-100', iconColor: 'text-blue-700'
  },
  users: { 
    bar: 'bg-purple-500', dot: 'bg-purple-500', border: 'border-purple-100', value: 'text-purple-800',
    iconBg: 'bg-purple-100', iconColor: 'text-purple-700'
  },
  products: { 
    bar: 'bg-orange-500', dot: 'bg-orange-500', border: 'border-orange-100', value: 'text-orange-800',
    iconBg: 'bg-orange-100', iconColor: 'text-orange-700'
  },
};

const cardsConfig = [
  { id: 'revenue', label: 'Total Revenue', key: 'totalRevenue', icon: DollarSign, chip: 'USD', prefix: '$', colorKey: 'revenue' },
  { id: 'orders', label: 'Total Orders', key: 'totalOrders', icon: ShoppingBag, chip: 'orders', prefix: '', colorKey: 'orders' },
  { id: 'users', label: 'Total Users', key: 'totalUsers', icon: Users, chip: 'accounts', prefix: '', colorKey: 'users' },
  { id: 'products', label: 'Total Products', key: 'totalProducts', icon: Package, chip: 'items', prefix: '', colorKey: 'products' },
];

export function AnalyticsStatsCard({ stats, loading }: AnalyticsStatsCardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative bg-white rounded-2xl pt-7 pb-6 px-6 border-[1.5px] border-gray-100 animate-pulse">
            <div className="absolute top-0 left-0 right-0 h-0.75 bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-gray-200 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-24" />
            <div className="absolute bottom-4 right-5 w-12 h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cardsConfig.map(({ id, label, key, icon: Icon, chip, prefix, colorKey }) => {
        const value = stats[key as keyof typeof stats];
        const c = colorMap[colorKey];
        
        return (
          <div
            key={id}
            className={`relative bg-white rounded-2xl pt-7 pb-6 px-6 border-[1.5px] ${c.border} overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}
          >
            {/* Top bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.75 ${c.bar}`} />
            
            {/* Dot */}
            <span className={`block w-2 h-2 rounded-full ${c.dot} mb-3`} />
            
            {/* Icon */}
            <div className={`absolute top-5 right-5 p-1.5 rounded-lg ${c.iconBg}`}>
              <Icon className={`w-3.5 h-3.5 ${c.iconColor}`} />
            </div>
            
            {/* Label */}
            <span className="block text-[10px] tracking-widest uppercase text-gray-400 mb-1 font-medium">
              {label}
            </span>
            
            {/* Value */}
            <span className={`block text-4xl font-extrabold tracking-tight leading-none ${c.value}`}>
              {prefix}{value}
            </span>
            
            {/* Chip */}
            <span className="absolute bottom-4 right-5 text-[9px] tracking-widest uppercase text-gray-300 font-medium">
              {chip}
            </span>
          </div>
        );
      })}
    </div>
  );
}