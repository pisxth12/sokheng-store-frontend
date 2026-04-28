// components/admin/categories/CategoryStatsCards.tsx
import { Folder, FolderOpen, Archive, Package, AlertCircle } from "lucide-react";

interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  categoriesWithProducts: number;
  emptyCategories: number;
}

interface CategoryStatsCardsProps {
  stats: CategoryStats | null;
  loading?: boolean;
}

const colorMap: Record<string, { bar: string; dot: string; border: string; value: string; iconBg: string }> = {
  total: { 
    bar: 'bg-gray-500', dot: 'bg-gray-500', border: 'border-gray-100', value: 'text-gray-800', 
    iconBg: 'bg-gray-100' 
  },
  active: { 
    bar: 'bg-green-500', dot: 'bg-green-500', border: 'border-green-100', value: 'text-green-800', 
    iconBg: 'bg-green-100' 
  },
  inactive: { 
    bar: 'bg-gray-400', dot: 'bg-gray-400', border: 'border-gray-100', value: 'text-gray-500', 
    iconBg: 'bg-gray-100' 
  },
  withProducts: { 
    bar: 'bg-blue-500', dot: 'bg-blue-500', border: 'border-blue-100', value: 'text-blue-800', 
    iconBg: 'bg-blue-100' 
  },
  empty: { 
    bar: 'bg-yellow-500', dot: 'bg-yellow-500', border: 'border-yellow-100', value: 'text-yellow-800', 
    iconBg: 'bg-yellow-100' 
  },
};

const cardsConfig = [
  { 
    id: 'total', 
    label: 'Total Categories', 
    key: 'totalCategories', 
    icon: Folder, 
    chip: 'all',
    colorKey: 'total'
  },
  { 
    id: 'active', 
    label: 'Active', 
    key: 'activeCategories', 
    icon: FolderOpen, 
    chip: 'active',
    colorKey: 'active'
  },
  { 
    id: 'inactive', 
    label: 'Inactive', 
    key: 'inactiveCategories', 
    icon: Archive, 
    chip: 'inactive',
    colorKey: 'inactive'
  },
  { 
    id: 'withProducts', 
    label: 'With Products', 
    key: 'categoriesWithProducts', 
    icon: Package, 
    chip: 'stocked',
    colorKey: 'withProducts'
  },
  { 
    id: 'empty', 
    label: 'Empty', 
    key: 'emptyCategories', 
    icon: AlertCircle, 
    chip: 'empty',
    colorKey: 'empty'
  },
];

export function CategoryStatsCards({ stats, loading }: CategoryStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative bg-white rounded-2xl pt-7 pb-6 px-6 border-[1.5px] border-gray-100 animate-pulse">
            <div className="absolute top-0 left-0 right-0 h-0.75 bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-gray-200 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-16" />
            <div className="absolute bottom-4 right-5 w-12 h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cardsConfig.map(({ id, label, key, icon: Icon, chip, colorKey }) => {
        const value = stats[key as keyof CategoryStats];
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
              <Icon className={`w-3.5 h-3.5 ${c.value}`} />
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