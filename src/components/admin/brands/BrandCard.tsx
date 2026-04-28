import { Brand } from "@/types/admin/brand.type";
import { Edit, Trash2, Power, Layers } from "lucide-react";
import Image from "next/image";

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
  onAddCategories: (brandId: number, categoryIds: number[]) => Promise<void>;
  onRemoveCategories: (brandId: number, categoryIds: number[]) => Promise<void>;
}

export default function BrandCard({
  brand,
  onEdit,
  onDelete,
  onToggle,
}: BrandCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Logo */}
      <div className="aspect-square relative bg-gray-50 p-4">
        {brand.logoUrl ? (
          <Image
            src={brand.logoUrl}
            alt={brand.name}
            fill
            className="object-contain p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-300">
              {brand.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-gray-900">{brand.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {brand.productCount} products
            </p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            brand.isActive 
              ? "bg-green-100 text-green-700" 
              : "bg-gray-100 text-red-700"
          }`}>
            {brand.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Categories */}
        {brand.categories && brand.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {brand.categories.slice(0, 3).map((cat) => (
              <span
                key={cat.id}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {cat.title}
              </span>
            ))}
            {brand.categories.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{brand.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(brand)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit brand"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onToggle(brand.id)}
            className={`p-2 rounded-lg transition-colors ${
              brand.isActive 
                ? "hover:bg-yellow-100" 
                : "hover:bg-green-100"
            }`}
            title={brand.isActive ? "Deactivate" : "Activate"}
          >
            <Power className={`w-4 h-4 ${
              brand.isActive ? "text-red-700" : "text-green-600"
            }`} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${brand.name}?`)) {
                onDelete(brand.id);
              }
            }}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors ml-auto"
            title="Delete brand"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}