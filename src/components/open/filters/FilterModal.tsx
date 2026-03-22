"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import "./FilterModal.css";

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
  };
}

const SORT_OPTIONS = [
  { value: "recommend",      label: "Recommended" },
  { value: "createdAt-desc", label: "Newest first" },
  { value: "createdAt-asc",  label: "Oldest first" },
  { value: "price-asc",      label: "Price: low to high" },
  { value: "price-desc",     label: "Price: high to low" },
];

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters = {},
}: FilterModalProps) {
  const t = useTranslations("FilterModal");
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: currentFilters.minPrice || "",
    maxPrice: currentFilters.maxPrice || "",
    categoryId: currentFilters.categoryId || "",
    sortBy: currentFilters.sortBy || "createdAt",
    sortOrder: currentFilters.sortOrder || "desc",
  });

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 300);
  };

 const handleApply = () => {
  setClosing(true);
  setTimeout(() => { setClosing(false); onApply(filters); }, 300);
  
};

  const handleReset = () => {
    setFilters({ minPrice: "", maxPrice: "", categoryId: "", sortBy: "createdAt", sortOrder: "desc" });
  };

  const currentSortValue =
    filters.sortBy === "recommend"
      ? "recommend"
      : `${filters.sortBy}-${filters.sortOrder}`;

  const handleSortSelect = (value: string) => {
    if (value === "recommend") {
      setFilters({ ...filters, sortBy: "recommend", sortOrder: "desc" });
    } else {
      const [sb, so] = value.split("-");
      setFilters({ ...filters, sortBy: sb, sortOrder: so });
    }
  };

  const modal = (
    <>
      {/* Dimmed overlay */}
      <div className="fm-overlay" onClick={handleClose} />

      {/* Slide-in panel */}
      <div className={`fm-panel ${closing ? "fm-panel--closing" : ""}`}>

        {/* Header */}
        <div className="fm-header">
          <h2 className="fm-title">{t("title")}</h2>
          <button className="fm-close" onClick={handleClose} aria-label="Close">
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="fm-body">

          {/* Price Range */}
          <div>
            <span className="fm-section-label">{t("priceRange.label")}</span>
            <div className="fm-price-row">
              <div className="fm-input-wrap">
                <span className="fm-currency">$</span>
                <input
                  type="number"
                  min="0"
                  placeholder={t("priceRange.min")}
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="fm-input"
                />
              </div>
              <div className="fm-input-wrap">
                <span className="fm-currency">$</span>
                <input
                  type="number"
                  min="0"
                  placeholder={t("priceRange.max")}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="fm-input"
                />
              </div>
            </div>
          </div>

          <div className="fm-divider" />

          {/* Sort options */}
          <div>
            <span className="fm-section-label">{t("sortBy.label")}</span>
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
            {t("buttons.apply")}
          </button>
        </div>

      </div>
    </>
  );

  return createPortal(modal, document.body);
}