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

export function ProductStatsCards({ stats, loading }: ProductStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      label: "Active",
      value: stats.activeProducts,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Inactive",
      value: stats.inactiveProducts,
      icon: XCircle,
      color: "text-gray-400",
      bg: "bg-gray-50",
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
      icon: Ban,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Featured",
      value: stats.featuredProducts,
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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