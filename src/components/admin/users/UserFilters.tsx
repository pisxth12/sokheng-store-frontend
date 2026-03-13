import { UserFilters as Filters, UserRole } from "@/types/admin/user.type";
import { Search, X } from "lucide-react";

interface Props{
    filters:Filters;
    onFilterChange: (filters: Partial<Filters>) => void;
    onClear: () => void;
}

export default function UserFilters({filters,onFilterChange,onClear}:Props){
    const roles: UserRole[] = ['USER', 'ADMIN'];

     return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-80 pl-10 pr-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filters.role || ''}
          onChange={(e) => onFilterChange({ role: e.target.value as UserRole || undefined })}
          className="px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
        >
          <option value="">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(filters.search || filters.role) && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      )}
    </div>
  );

}