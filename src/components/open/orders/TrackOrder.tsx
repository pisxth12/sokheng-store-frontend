"use client";

import { useState } from "react";
import { publicOrderApi } from "@/lib/open/order";
import { Package, Mail, Phone, Search, Loader2 } from "lucide-react";
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
    } catch (err: any) {
      let errorMessage = err.response.data.error;
        setError(errorMessage);  
    } finally {
      setLoading(false);
    }
  };

  // const OrderStatus = 

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
        <div className="space-y-4">
          {/* Order Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order Number
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-20240320-001"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Email OR Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+855 12 345 678"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Please enter your order number and either email or phone number used during checkout.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !orderNumber || (!email && !phone)}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Track Order
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-8">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-800">
            <div>
              <button onClick={() => window.location.href = `/orders/${order.orderNumber}`} className="text-lg cursor-pointer hover:text-blue-400 font-semibold">{order.orderNumber}</button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.status === "DELIVERED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
              order.status === "CANCELLED" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}>
              {order.status}
            </span>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
              <p className="font-medium mt-1">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
              <p className="text-sm mt-1">{order.email}</p>
              <p className="text-sm">{order.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Shipping Address</p>
              <p className="text-sm mt-1">{order.address}</p>
            </div>
            
          </div>

          {/* Order Items */}
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-3 mb-6">
            {order.items.map((item, index) => (
              <Link href={`/products/${item.slug}`} key={index} className="flex gap-3 py-2 border-b dark:border-gray-800 last:border-0">
                {item.productImage && (
                  <img 
                    src={item.productImage} 
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.subtotal)}
                </p>
              </Link>
            ))}
          </div>

          {/* Order Total */}
          <div className="flex justify-between items-center pt-4 border-t dark:border-gray-800">
            <span className="font-semibold">Total Amount</span>
            <span className="text-xl font-bold">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}