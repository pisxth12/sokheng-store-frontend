"use client";
import { UserFilters as Filters } from "@/types/admin/user.type";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClear: () => void;
}

export default function UserFilters({ filters, onFilterChange, onClear }: Props) {
  const  [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
  const timeout = setTimeout(()=> {
     if (search.length === 0) {
        onFilterChange({ search: "" });
      } else if (search.length > 2) {
        onFilterChange({ search });
      }
  },300);
  return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center bg-white border">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 pl-10 pr-3 py-2 text-sm border
                       focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* Clear Button (always visible) */}
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-2 text-sm border-black border 
                     bg-black text-white
                     hover:bg-gray-900 transition"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
}