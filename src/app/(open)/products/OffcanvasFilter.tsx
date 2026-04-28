// components/open/filters/OfcanvasFilter.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Category, Brand, FilterState, PriceRange } from "@/types/open/product.type";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import "./OffcanvasFilter.css";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Partial<FilterState>) => void;
  currentFilters: FilterState;
  categories: Category[];
  brands?: Brand[];
  priceRange: PriceRange;
  showCategoryFilter?: boolean;
  showBrandFilter?: boolean;
}

const SORT_OPTIONS = [
  { value: "recommend", label: "Recommended" },
  { value: "createdAt-desc", label: "Newest first" },
  { value: "createdAt-asc", label: "Oldest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export default function OffcanvasFilter({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  categories = [],
  brands = [],
  priceRange,
  showCategoryFilter = true,
  showBrandFilter = true,

}: FilterModalProps) {
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>(currentFilters.categoryId);
  const [selectedBrand, setSelectedBrand] = useState<string>(currentFilters.brandId || "");
  const [minPrice, setMinPrice] = useState<number>(
    currentFilters.minPrice ? Number(currentFilters.minPrice) : priceRange.min
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    currentFilters.maxPrice ? Number(currentFilters.maxPrice) : priceRange.max
  );
  const [sortBy, setSortBy] = useState<string>(currentFilters.sortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState<string>(currentFilters.sortOrder || "desc");

  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  //for close offcanvas when clicking outside
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(!isOpen) return;
    const handleEscKey = (event: KeyboardEvent) => {
      if(event.key === "Escape"){
         handleClose();
      }
    }
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  },[isOpen,onClose])

  useEffect(() => {
    if(!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if(panelRef.current && !panelRef.current.contains(event.target as Node)){
         handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },[isOpen,onClose])



  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(currentFilters.categoryId);
      setSelectedBrand(currentFilters.brandId || "");
      setMinPrice(currentFilters.minPrice ? Number(currentFilters.minPrice) : priceRange.min);
      setMaxPrice(currentFilters.maxPrice ? Number(currentFilters.maxPrice) : priceRange.max);
      setSortBy(currentFilters.sortBy || "createdAt");
      setSortOrder(currentFilters.sortOrder || "desc");
    }
  }, [isOpen, currentFilters, priceRange]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Calculate percentage for slider
      const getPercentage = (value: number) => {
          const min = priceRange.min;
          const max = priceRange.max;
          // If no valid range, return center position (50%)
          if (max <= min) return 50;
          let percent = ((value - min) / (max - min)) * 100;
          return Math.min(100, Math.max(0, percent));
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

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  const handleApply = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onApply({
        categoryId: selectedCategory,
        brandId: selectedBrand,
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        sortBy,
        sortOrder,
      });
    }, 300);
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const currentSortValue = sortBy === "recommend" ? "recommend" : `${sortBy}-${sortOrder}`;

  const handleSortSelect = (value: string) => {
    if (value === "recommend") {
      setSortBy("recommend");
      setSortOrder("desc");
    } else {
      const [sb, so] = value.split("-");
      setSortBy(sb);
      setSortOrder(so);
    }
  };

  const minPercent = getPercentage(minPrice);
  const maxPercent = getPercentage(maxPrice);


  

  const modal = (
    <>
      <div  className={`fm-overlay ${closing ? "fm-overlay--closing" : ""}`} onClick={handleClose} />
      <div ref={panelRef} className={`fm-panel ${closing ? "fm-panel--closing" : ""}`}>
        {/* Header */}
        <div className="fm-header">
          <h2 className="fm-title">Filters</h2>
          <button className="fm-close" onClick={handleClose} aria-label="Close">
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="fm-body">
          {/* Category Filter */}
          { showCategoryFilter  && categories.length > 0 && (
            <div>
              <span className="fm-section-label">Category</span>
              <div className="fm-chips">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`fm-chip ${selectedCategory === "" ? "fm-chip--active" : ""}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id.toString())}
                    className={`fm-chip ${selectedCategory === cat.id.toString() ? "fm-chip--active" : ""}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brand Filter */}
          { showBrandFilter && brands.length > 0 && (
            <div>
              <span className="fm-section-label">Brand</span>
              <div className="fm-chips">
                <button
                  onClick={() => setSelectedBrand("")}
                  className={`fm-chip ${selectedBrand === "" ? "fm-chip--active" : ""}`}
                >
                  All
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id.toString())}
                    className={`fm-chip ${selectedBrand === brand.id.toString() ? "fm-chip--active" : ""}`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}


            

          {/* Price Range Slider */}
          <div>
            <span className="fm-section-label">Price Range</span>
            <div className="fm-price-slider">
              <div className="fm-slider-container">
                <div className="fm-slider-track" ref={sliderRef}>
                  <div
                    className="fm-slider-range"
                    style={{
                      left: `${minPercent}%`,
                      right: `${100 - maxPercent}%`,
                    }}
                  />
                  <div
                    className="fm-slider-thumb"
                    style={{ left: `${minPercent}%` }}
                    onMouseDown={() => setIsDragging("min")}
                  />
                  <div
                    className="fm-slider-thumb"
                    style={{ left: `${maxPercent}%` }}
                    onMouseDown={() => setIsDragging("max")}
                  />
                </div>
              </div>
              <div className="fm-price-labels">
                <div className="fm-price-label">
                  <span>Min</span>
                  <span className="fm-price-value">${minPrice.toFixed(2)}</span>
                </div>
                <div className="fm-price-label">
                  <span>Max</span>
                  <span className="fm-price-value">${maxPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="fm-price-range-info">
                ${priceRange.min.toFixed(2)} — ${priceRange.max.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="fm-divider" />

          {/* Sort options */}
          <div>
            <span className="fm-section-label">Sort by</span>
            <div className="fm-sort-grid">
              {SORT_OPTIONS.map((opt) => {
                const active = currentSortValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    className={`fm-sort-option ${active ? "fm-sort-option--active" : ""}`}
                    onClick={() => handleSortSelect(opt.value)}
                  >
                    <span className="fm-sort-radio">
                      <span className="fm-sort-radio-dot" />
                    </span>
                    <span className="fm-sort-text">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fm-footer">
          <button className="fm-btn-reset" onClick={handleReset}>
            Reset
          </button>
          <button className="fm-btn-apply" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}