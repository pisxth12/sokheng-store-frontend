'use client';

import { OrderItem } from '@/types/order.type';
import { Package } from 'lucide-react';
import Image from 'next/image';

interface Props {
  items: OrderItem[];
}

export default function OrderItemsTable({ items }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-900">Order Items</h3>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
            <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{item.productName}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600">{formatCurrency(item.unitPrice)}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600">{item.quantity}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 border-t border-gray-200">
          <tr>
            <td colSpan={3} className="px-6 py-4 text-right font-medium text-gray-700">
              Subtotal:
            </td>
            <td className="px-6 py-4 text-right font-bold text-gray-900">
              {formatCurrency(subtotal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}