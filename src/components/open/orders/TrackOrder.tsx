"use client";

import { useState } from "react";
import { publicOrderApi } from "@/lib/open/order";
import { Package, Mail, Phone, Search, Loader2, X, MapPin, Calendar, CreditCard, ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { OrderDetails } from "@/types/admin/order.type";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("ORD-20260320-00196");
  const [email, setEmail] = useState("seth.dev.1100@gmail.com");
  const [phone, setPhone] = useState("0969851100");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await publicOrderApi.trackGuestOrder({
        orderNumber,
        email,
        phone
      });
      setOrder(response);
      setIsModalOpen(true);
    } catch (err: any) {
      let errorMessage = err.response?.data?.error || "Order not found";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "DELIVERED": return "bg-green-500";
      case "CANCELLED": return "bg-red-500";
      case "PENDING": return "bg-yellow-500";
      case "PROCESSING": return "bg-blue-500";
      case "SHIPPED": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "DELIVERED": return "Delivered";
      case "CANCELLED": return "Cancelled";
      case "PENDING": return "Pending";
      case "PROCESSING": return "Processing";
      case "SHIPPED": return "Shipped";
      default: return status;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-white rounded-full mb-4">
              <Package className="w-8 h-8 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Find Your Order
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your order details to check the status
            </p>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800  shadow-lg p-6 mb-8">
            <div className="space-y-4">
              {/* Order Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Number
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g., ORD-20240320-001"
                    className="w-full pl-11 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-s focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent bg-gray-50 dark:bg-gray-900/50 transition"
                    required
                  />
                </div>
              </div>

              {/* Email OR Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-s focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent bg-gray-50 dark:bg-gray-900/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+855 12 345 678"
                      className="w-full pl-11 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-s focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent bg-gray-50 dark:bg-gray-900/50 transition"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Enter your order number and either email or phone number used during checkout
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !orderNumber || (!email && !phone)}
                className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-semibold rounded-s transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-s p-4">
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#212121]  max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-[#212121] border-b border-gray-200 dark:border-gray-800 p-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)} animate-pulse`} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-s">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order Number</p>
                  <Link href={`/orders/${order.orderNumber}`} className="text-lg font-mono font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition">
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                    order.status === "DELIVERED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    order.status === "CANCELLED" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-s">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.customerName}</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-s">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{order.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.phone}</p>
                </div>
                <div className="md:col-span-2 p-4 border border-gray-200 dark:border-gray-800 rounded-s">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Shipping Address</p>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{order.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Order Items</h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <Link href={`/${item.id}/${item.slug}`} key={index} className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-s transition group">
                      {item.productImage && (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${item.subtotal.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ${(item.subtotal / item.quantity).toFixed(2)} each
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-xs text-gray-400">Including taxes & fees</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <CreditCard className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Paid via KHQR</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-[#212121] border-t border-gray-200 dark:border-gray-800 p-5 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-black hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:bg-darkbg font-semibold rounded-s transition flex items-center justify-center gap-2"
              >
                Close
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}