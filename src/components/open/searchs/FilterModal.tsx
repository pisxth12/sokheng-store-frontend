import { useTranslations } from "next-intl";
import { useState } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters?: {
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: string;
  }
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  onApply, 
  currentFilters = {} 
}: FilterModalProps) {
  const t = useTranslations('FilterModal');
  const [filters, setFilters] = useState({
    minPrice: currentFilters.minPrice || "",
    maxPrice: currentFilters.maxPrice || "",
    categoryId: currentFilters.categoryId || "",
    sortBy: currentFilters.sortBy || "createdAt",
    sortOrder: currentFilters.sortOrder || "desc"
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-darkbg rounded-lg w-full max-w-md p-6">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{t('title')}</h2>
            <button onClick={onClose}>✕</button>
          </div>

          <div className="space-y-4">
            {/* Price Range */}
            <div>
              <label className="block mb-2">{t('priceRange.label')}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder={t('priceRange.min')}
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="border p-2 rounded w-1/2"
                />
                <input
                  type="number"
                  min="0"
                  placeholder={t('priceRange.max')}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="border p-2 rounded w-1/2"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block mb-2">{t('sortBy.label')}</label>
                <select
                value={filters.sortBy === "recommend" ? "recommend" : `${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "recommend") {
                    setFilters({...filters, sortBy: "recommend", sortOrder: "desc"});
                  } else {
                    const [sortBy, sortOrder] = value.split('-');
                    setFilters({...filters, sortBy, sortOrder});
                  }
                }}
                className="border p-2 rounded w-full"
              >
                <option className="dark:bg-darkbg" value="recommend">{t('sortBy.options.recommend')}</option>
                <option className="dark:bg-darkbg" value="createdAt-desc">{t('sortBy.options.newest')}</option>
                <option className="dark:bg-darkbg" value="createdAt-asc">{t('sortBy.options.oldest')}</option>
                <option className="dark:bg-darkbg" value="price-asc">{t('sortBy.options.priceLowHigh')}</option>
                <option className="dark:bg-darkbg" value="price-desc">{t('sortBy.options.priceHighLow')}</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-2 border rounded"
              >
                {t('buttons.cancel')}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2 bg-black text-white rounded"
              >
                 {t('buttons.apply')} 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}