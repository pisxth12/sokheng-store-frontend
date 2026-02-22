'use client';

import { OrderStatus } from "@/types/order.type";

interface Props {
  status: OrderStatus;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700'
  },
  PROCESSING: {
    label: 'Processing',
    className: 'bg-blue-100 text-blue-700'
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700'
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700'
  }
};

export default function OrderStatusBadge({ status }: Props) {
  const config = statusConfig[status] || statusConfig.PENDING;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}