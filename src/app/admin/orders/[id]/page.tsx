'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOrders } from '@/hooks/admin/useOrders';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import OrderDetails from '@/components/admin/orders/OrderDetails';

export default function OrderDetailsPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const { order, loading, error, fetchOrderById, refresh } = useOrders();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <OrderDetails order={order} onUpdate={refresh} />
    </div>
  );
}