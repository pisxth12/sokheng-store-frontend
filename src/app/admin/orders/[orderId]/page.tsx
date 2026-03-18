'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/admin/useOrders';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId  = parseInt(params.orderId as string);
  
  
  const { order, loading, error, fetchOrderById, deleteOrder, updateOrderStatus , goToDetails} = useOrders();

  useEffect(() => {
    if (orderId) fetchOrderById(orderId);
  }, [orderId]);

  console.log(orderId );
  

  
  
  const handleStatusUpdate = async (status: string) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this order?')) return;
    try {
      await deleteOrder(orderId );
      router.push('/admin/orders');
    } catch (error: any) {
      console.log(error);
    }
  };

  if (!order) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors inline-block"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  


  if (loading) return <LoadingSpinner/>
  



  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Navigation and Actions - Stack on mobile */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-light">Order {order.orderNumber}</h1>
        </div>
        
        {/* Actions - Full width on mobile */}
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={order.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 text-sm rounded-lg focus:outline-none focus:border-black"
          >
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            onClick={handleDelete}
            className="flex-1 sm:flex-none px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-sm rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Order Info - Stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Customer Card */}
        <div className="border border-gray-200 p-4 rounded-lg bg-white">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Customer</p>
          <p className="font-medium text-gray-900">{order.customerName}</p>
          <p className="text-sm text-gray-600 mt-2 break-words">{order.email}</p>
          <p className="text-sm text-gray-600">{order.phone}</p>
        </div>

        {/* Order Details Card */}
        <div className="border border-gray-200 p-4 rounded-lg bg-white">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Order Details</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-500">Date:</span>{' '}
              <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Payment:</span>{' '}
              <span className="text-gray-900">{order.paymentMethod || 'N/A'}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Status:</span>{' '}
              <span className="text-gray-900">{order.paymentStatus || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* Shipping Card */}
        <div className="border border-gray-200 p-4 rounded-lg bg-white">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Shipping</p>
          <p className="text-sm text-gray-900 break-words">{order.address || 'No address provided'}</p>
          {order.note && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="text-gray-500">Note:</span> {order.note}
            </p>
          )}
        </div>
      </div>

      {/* Items Table - Scrollable on mobile */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Mobile Summary Card (shown only on mobile) */}
        <div className="block md:hidden p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Order Items Summary</h3>
          <p className="text-xs text-gray-500 mt-1">
            {order.items?.length || 0} item(s) • Total: ${order.totalAmount?.toFixed(2)}
          </p>
        </div>

        {/* Table Wrapper - Horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] md:min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="text-sm text-gray-900">{item.productName}</div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-gray-600">
                    ${item.unitPrice?.toFixed(2)}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-right font-medium text-gray-900">
                    ${item.subtotal?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan={3} className="px-3 sm:px-4 py-3 text-right text-sm font-medium text-gray-700">
                  Total:
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-base sm:text-lg font-bold text-gray-900">
                  ${order.totalAmount?.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Items List Alternative (if you prefer cards instead of table) */}
        <div className="block md:hidden p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => goToDetails(order.orderId)}
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Manage Order Items
          </button>
        </div>
      </div>

      {/* Back to Orders Link - Mobile friendly */}
      <div className="mt-6 text-center sm:text-left">
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Orders
        </Link>
      </div>
    </div>
  );
}