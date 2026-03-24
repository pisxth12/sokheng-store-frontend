// components/open/filters/FilterModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Category, Brand, FilterState, PriceRange } from "@/types/open/product.type";
import { X, RotateCcw } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Partial<FilterState>) => void;
  currentFilters: FilterState;
  categories: Category[];
  brands: Brand[];
  priceRange: PriceRange;
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  onApply, 
  currentFilters,
  categories,
  brands,
  priceRange
}: FilterModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(currentFilters.categoryId);
  const [selectedBrand, setSelectedBrand] = useState<string>(currentFilters.brandId);
  const [minPrice, setMinPrice] = useState<number>(
    currentFilters.minPrice ? Number(currentFilters.minPrice) : priceRange.min
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    currentFilters.maxPrice ? Number(currentFilters.maxPrice) : priceRange.max
  );
  
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(currentFilters.categoryId);
      setSelectedBrand(currentFilters.brandId);
      setMinPrice(currentFilters.minPrice ? Number(currentFilters.minPrice) : priceRange.min);
      setMaxPrice(currentFilters.maxPrice ? Number(currentFilters.maxPrice) : priceRange.max);
    }
  }, [isOpen, currentFilters, priceRange]);

  // Calculate percentage for slider positioning
  const getPercentage = (value: number) => {
    return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
  };

  // Handle slider drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!sliderRef.current || !isDragging) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.min(Math.max(0, x), rect.width);
    const percentage = x / rect.width;
    let newValue = priceRange.min + percentage * (priceRange.max - priceRange.min);
    newValue = Math.round(newValue * 100) / 100;

    if (isDragging === "min") {
      const newMin = Math.min(newValue, maxPrice - 0.01);
      setMinPrice(Math.max(priceRange.min, newMin));
    } else if (isDragging === "max") {
      const newMax = Math.max(newValue, minPrice + 0.01);
      setMaxPrice(Math.min(priceRange.max, newMax));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, minPrice, maxPrice]);

  const handleApply = () => {
    onApply({
      categoryId: selectedCategory,
      brandId: selectedBrand,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  };

  const minPercent = getPercentage(minPrice);
  const maxPercent = getPercentage(maxPrice);

  if (!isOpen) return null;

  // Get selected category name for display
  const selectedCategoryName = categories.find(c => c.id.toString() === selectedCategory)?.name;
  const selectedBrandName = brands.find(b => b.id.toString() === selectedBrand)?.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3 py-1.5 text-sm rounded-sm transition-all ${
                    selectedCategory === ""
                      ? "border-2 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id.toString())}
                    className={`px-3 py-1.5 text-sm rounded-sm transition-all ${
                      selectedCategory === cat.id.toString()
                        ? "border-2 text-white shadow-md"
                        : " dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Brand
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBrand("")}
                  className={`px-3 py-1.5 text-sm rounded-sm transition-all ${
                    selectedBrand === ""
                      ? "border-2 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  All
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id.toString())}
                    className={`px-3 py-1.5 text-sm rounded-sm transition-all ${
                      selectedBrand === brand.id.toString()
                        ? "border-2 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Price Range Slider */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Price Range
            </label>
            
           
            {/* Slider Container */}
            <div className="relative pt-2 pb-6">
              <div
                ref={sliderRef}
                className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-sm cursor-pointer"
              >
                {/* Selected Range */}
                <div
                  className="absolute h-full bg-blue-600 rounded-sm"
                  style={{
                    left: `${minPercent}%`,
                    right: `${100 - maxPercent}%`,
                  }}
                />
                
                {/* Min Thumb */}
                <div
                  className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-sm shadow-md cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform"
                  style={{ left: `${minPercent}%` }}
                  onMouseDown={() => setIsDragging("min")}
                />
                
                {/* Max Thumb */}
                <div
                  className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-sm shadow-md cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform"
                  style={{ left: `${maxPercent}%` }}
                  onMouseDown={() => setIsDragging("max")}
                />
              </div>
              
              {/* Price Labels */}
              <div className="flex justify-between mt-4">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Min</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${minPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Max</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${maxPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Range Info */}
            <div className="text-xs text-gray-400 text-center mt-2">
              Range: ${priceRange.min.toFixed(2)} - ${priceRange.max.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}