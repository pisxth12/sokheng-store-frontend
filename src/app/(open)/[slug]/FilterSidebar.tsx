// components/open/filters/FilterSidebar.tsx
"use client"

import { Category, Brand } from "@/types/open/product.type";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useEffect, useRef } from "react";

interface FilterSidebarProps {
  // For brand pages
  categories?: Category[];
  loadingCategories?: boolean;
  selectedCategoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
  

  // For category pages
  brands?: Brand[];
  loadingBrands?: boolean;
  selectedBrandId?: string;
  onBrandChange?: (brandId: string) => void;
  
  // Common filters
  minPrice?: string;
  maxPrice?: string;
  onPriceChange?: (minPrice: string, maxPrice: string) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({
  categories,
  loadingCategories,
  selectedCategoryId,
  onCategoryChange,
  brands,
  loadingBrands,
  selectedBrandId,
  onBrandChange,
  minPrice = "",
  maxPrice = "",
  onPriceChange,
  onClearFilters,
}: FilterSidebarProps) {
  
  //For closing the offcanvas on mobile after applying filters
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
  },[])

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceChange?.(minPrice, maxPrice);
  };
  
  return (
    <div className="space-y-6">
      {/* Price Filter */}
      {onPriceChange && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
          <form onSubmit={handlePriceSubmit} className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Min ($)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Max ($)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => onPriceChange(minPrice, e.target.value)}
                  placeholder="Any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </form>
        </div>
      )}
      
      {/* Category Filter (for brand pages) */}
      {categories && onCategoryChange && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          {loadingCategories ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={selectedCategoryId === ""}
                  onChange={() => onCategoryChange("")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategoryId === category.id.toString()}
                    onChange={() => onCategoryChange(category.id.toString())}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Brand Filter (for category pages) */}
      {brands && onBrandChange && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Brands</h3>
          {loadingBrands ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  value=""
                  checked={selectedBrandId === ""}
                  onChange={() => onBrandChange("")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">All Brands</span>
              </label>
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    value={brand.id}
                    checked={selectedBrandId === brand.id.toString()}
                    onChange={() => onBrandChange(brand.id.toString())}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{brand.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Clear All Button */}
      <button
        onClick={onClearFilters}
        className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}