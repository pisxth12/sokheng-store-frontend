'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/admin/useOrders';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  
  
  const { order, loading, error, fetchOrderById, deleteOrder, updateOrderStatus } = useOrders();

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateOrderStatus(id, status);
      await fetchOrderById(id);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this order?')) return;
    try {
      await deleteOrder(id);
      router.push('/admin/orders');
    } catch (error) {
      alert('Failed to delete order');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error || !order) return <div className="p-8">Order not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-light">Order {order.orderNumber}</h1>
        </div>
        <div className="flex gap-2">
          <select
            value={order.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="px-3 py-1 border border-gray-300 text-sm"
          >
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            onClick={handleDelete}
            className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Customer</p>
          <p className="font-medium">{order.customerName}</p>
          <p className="text-sm text-gray-600 mt-2">{order.email}</p>
          <p className="text-sm text-gray-600">{order.phone}</p>
        </div>

        <div className="border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Order Details</p>
          <p className="text-sm">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="text-sm">Payment: {order.paymentMethod || 'N/A'}</p>
          <p className="text-sm">Status: {order.paymentStatus || 'N/A'}</p>
        </div>

        <div className="border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Shipping</p>
          <p className="text-sm">{order.address || 'No address'}</p>
          {order.note && <p className="text-sm text-gray-500 mt-2">Note: {order.note}</p>}
        </div>
      </div>

      {/* Items Table */}
      <div className="border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Qty</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">{item.productName}</td>
                <td className="px-4 py-3">${item.unitPrice}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3 text-right">${item.subtotal}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-right font-medium">Total:</td>
              <td className="px-4 py-3 text-right font-bold">${order.totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}