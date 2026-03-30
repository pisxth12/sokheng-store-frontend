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

export function CategoryStatsCards({ stats, loading }: CategoryStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: "Total Categories",
      value: stats.totalCategories,
      icon: Folder,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      label: "Active",
      value: stats.activeCategories,
      icon: FolderOpen,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Inactive",
      value: stats.inactiveCategories,
      icon: Archive,
      color: "text-gray-400",
      bg: "bg-gray-50",
    },
    {
      label: "With Products",
      value: stats.categoriesWithProducts,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Empty",
      value: stats.emptyCategories,
      icon: AlertCircle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} rounded-2xl p-4 transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-2">
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}