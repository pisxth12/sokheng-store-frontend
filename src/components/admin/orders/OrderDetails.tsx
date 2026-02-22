'use client';

import OrderStatusBadge from './OrderStatusBadge';
import OrderItemsTable from './OrderItemsTable';
import OrderStatusUpdateModal from './OrderStatusUpdateModal';
import DeleteOrderDialog from './DeleteOrderDialog';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Order } from '@/types/order.type';

interface Props {
  order: Order;
  onUpdate: () => void;
}

export default function OrderDetails({ order, onUpdate }: Props) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!order) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleStatusUpdate = async (status: string) => {
    console.log('Update status:', status);
    onUpdate();
  };

  const handleDelete = async () => {
    console.log('Delete order:', order.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber || 'N/A'}</h1>
            <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Update Status
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Order Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{order.customerName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-600">{order.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-600">{order.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <div className="mt-1">
                <OrderStatusBadge status={order.status || 'PENDING'} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className="font-medium text-gray-900 capitalize">
                {order.paymentStatus ? order.paymentStatus.toLowerCase() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="text-gray-600">{order.paymentMethod || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Shipping Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-gray-600">{order.address || 'N/A'}</p>
            </div>
            {order.note && (
              <div>
                <p className="text-sm text-gray-500">Note</p>
                <p className="text-gray-600">{order.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <OrderItemsTable items={order.items || []} />

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-2 max-w-sm ml-auto">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">Free</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OrderStatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusUpdate}
        currentStatus={order.status || 'PENDING'}
        orderNumber={order.orderNumber || 'N/A'}
      />

      <DeleteOrderDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        orderNumber={order.orderNumber || 'N/A'}
      />
    </div>
  );
}