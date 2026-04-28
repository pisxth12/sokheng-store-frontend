// components/admin/products/ProductStatsCards.tsx
import { Package, CheckCircle, XCircle, AlertTriangle, Ban, Star } from "lucide-react";

interface ProductStatsCardsProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    lowStock: number;
    outOfStock: number;
    featuredProducts: number;
  };
  loading?: boolean;
}

const colorMap: Record<string, { bar: string; dot: string; border: string; value: string; iconBg: string; iconColor: string }> = {
  total: { 
    bar: 'bg-gray-500', dot: 'bg-gray-500', border: 'border-gray-100', value: 'text-gray-800',
    iconBg: 'bg-gray-100', iconColor: 'text-gray-600'
  },
  active: { 
    bar: 'bg-green-500', dot: 'bg-green-500', border: 'border-green-100', value: 'text-green-800',
    iconBg: 'bg-green-100', iconColor: 'text-green-700'
  },
  inactive: { 
    bar: 'bg-gray-400', dot: 'bg-gray-400', border: 'border-gray-100', value: 'text-gray-500',
    iconBg: 'bg-gray-100', iconColor: 'text-gray-500'
  },
  lowStock: { 
    bar: 'bg-amber-500', dot: 'bg-amber-500', border: 'border-amber-100', value: 'text-amber-800',
    iconBg: 'bg-amber-100', iconColor: 'text-amber-700'
  },
  outOfStock: { 
    bar: 'bg-red-500', dot: 'bg-red-500', border: 'border-red-100', value: 'text-red-800',
    iconBg: 'bg-red-100', iconColor: 'text-red-700'
  },
  featured: { 
    bar: 'bg-purple-500', dot: 'bg-purple-500', border: 'border-purple-100', value: 'text-purple-800',
    iconBg: 'bg-purple-100', iconColor: 'text-purple-700'
  },
};

const cardsConfig = [
  { id: 'total', label: 'Total Products', key: 'totalProducts', icon: Package, chip: 'all', colorKey: 'total' },
  { id: 'active', label: 'Active', key: 'activeProducts', icon: CheckCircle, chip: 'active', colorKey: 'active' },
  { id: 'inactive', label: 'Inactive', key: 'inactiveProducts', icon: XCircle, chip: 'inactive', colorKey: 'inactive' },
  { id: 'lowStock', label: 'Low Stock', key: 'lowStock', icon: AlertTriangle, chip: '<10', colorKey: 'lowStock' },
  { id: 'outOfStock', label: 'Out of Stock', key: 'outOfStock', icon: Ban, chip: '0', colorKey: 'outOfStock' },
  { id: 'featured', label: 'Featured', key: 'featuredProducts', icon: Star, chip: '⭐', colorKey: 'featured' },
];

export function ProductStatsCards({ stats, loading }: ProductStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative bg-white rounded-2xl pt-7 pb-6 px-6 border-[1.5px] border-gray-100 animate-pulse">
            <div className="absolute top-0 left-0 right-0 h-0.75 bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-gray-200 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-12" />
            <div className="absolute bottom-4 right-5 w-8 h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cardsConfig.map(({ id, label, key, icon: Icon, chip, colorKey }) => {
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
              {value.toLocaleString()}
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