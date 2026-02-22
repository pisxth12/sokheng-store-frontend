'use client';

import { OrderStatus } from '@/types/order.type';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: OrderStatus) => void;
  currentStatus: OrderStatus;
  orderNumber: string;
}

const statusOptions: { value: OrderStatus; label: string; description: string }[] = [
  { 
    value: 'PENDING', 
    label: 'Pending', 
    description: 'Order has been placed but not processed yet' 
  },
  { 
    value: 'PROCESSING', 
    label: 'Processing', 
    description: 'Order is being prepared' 
  },
  { 
    value: 'COMPLETED', 
    label: 'Completed', 
    description: 'Order has been completed and delivered' 
  },
  { 
    value: 'CANCELLED', 
    label: 'Cancelled', 
    description: 'Order has been cancelled' 
  },
];

export default function OrderStatusUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  orderNumber
}: Props) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }
    
    setLoading(true);
    try {
      await onConfirm(selectedStatus);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Update Order Status</h2>
            <p className="text-sm text-gray-500 mt-1">Order #{orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {statusOptions.map(({ value, label, description }) => (
            <label
              key={value}
              className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedStatus === value
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={value}
                checked={selectedStatus === value}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  selectedStatus === value
                    ? 'border-gray-900 bg-gray-900'
                    : 'border-gray-300'
                }`}>
                  {selectedStatus === value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
              </div>
            </label>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedStatus === currentStatus}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}