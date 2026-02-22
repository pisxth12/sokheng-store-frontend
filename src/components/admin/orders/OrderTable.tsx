'use client';

import { OrderListResponse } from '@/types/order.type';
import OrderStatusBadge from './OrderStatusBadge';
import { Eye } from 'lucide-react';
import Link from 'next/link';

interface Props {
  orders: OrderListResponse[];
  onDelete?: (id: number) => void;
}

export default function OrderTable({ orders, onDelete }: Props) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order #</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Customer</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Total</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <span className="font-medium text-gray-900">{order.orderNumber}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600">{order.customerName}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600">{formatDate(order.createdAt)}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
              </td>
              <td className="px-6 py-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}