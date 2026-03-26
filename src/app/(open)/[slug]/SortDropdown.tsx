// components/open/filters/SortDropdown.tsx
"use client"

import { useState } from "react";

interface SortOption {
  value: string;
  label: string;
  order: "asc" | "desc";
}

const sortOptions: SortOption[] = [
  { value: "createdAt", label: "Newest", order: "desc" },
  { value: "price", label: "Price: Low to High", order: "asc" },
  { value: "price", label: "Price: High to Low", order: "desc" },
  { value: "name", label: "Name: A to Z", order: "asc" },
  { value: "name", label: "Name: Z to A", order: "desc" },
];

interface SortDropdownProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentOption = sortOptions.find(
    opt => opt.value === sortBy && opt.order === sortOrder
  ) || sortOptions[0];
  
  const handleSelect = (option: SortOption) => {
    onSortChange(option.value, option.order);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Sort: {currentOption.label}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {sortOptions.map((option) => (
              <button
                key={`${option.value}-${option.order}`}
                onClick={() => handleSelect(option)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  currentOption.value === option.value && currentOption.order === option.order
                    ? "text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}