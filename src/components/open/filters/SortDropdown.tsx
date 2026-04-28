// components/open/filters/SortDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const SORT_OPTIONS: SortOption[] = [
  { value: "recommend", label: "Recommended", sortBy: "recommend", sortOrder: "desc" },
  { value: "createdAt-desc", label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  { value: "createdAt-asc", label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
  { value: "price-asc", label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { value: "price-desc", label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
];

interface SortDropdownProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = SORT_OPTIONS.find(
    opt => opt.sortBy === sortBy && opt.sortOrder === sortOrder
  ) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onSortChange(option.sortBy, option.sortOrder);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Sort: {currentOption.label}
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                currentOption.value === option.value
                  ? "text-blue-600 font-medium bg-blue-50"
                  : "text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}