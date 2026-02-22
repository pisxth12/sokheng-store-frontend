'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function OrderSearchBar({ onSearch, initialValue = '' }: Props) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by order number or customer name..."
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Search
      </button>
    </form>
  );
}