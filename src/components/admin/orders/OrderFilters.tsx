'use client';

import { OrderStatus } from '@/types/order.type';
import { Filter, X } from 'lucide-react';

interface Props {
  currentStatus?: OrderStatus;
  onStatusChange: (status?: OrderStatus) => void;
  onClear: () => void;
}

const statuses: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function OrderFilters({ currentStatus, onStatusChange, onClear }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange(undefined)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !currentStatus
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          
          {statuses.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentStatus === value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {currentStatus && (
          <button
            onClick={onClear}
            className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}