'use client'

import { CartResponse } from "@/types/open/cart.type";

interface OrderSummaryProps {
  cart: CartResponse | null;
  showItems?: boolean;
}

export const OrderSummary = ({ cart, showItems = false }: OrderSummaryProps) => {
  const subtotal = cart?.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (!cart?.items?.length) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#252525]">
        <p className="text-gray-400 text-center">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-xl border border-[#252525] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#252525]">
        <h2 className="font-medium flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-600/20 rounded-lg flex items-center justify-center text-sm">
            🛒
          </span>
          Order Summary
        </h2>
      </div>

      {/* Items (optional - can be hidden on mobile) */}
      {showItems && (
        <div className="p-4 border-b border-[#252525] max-h-60 overflow-y-auto">
          <p className="text-sm text-gray-400 mb-3">Items ({cart.items.length})</p>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="text-gray-200 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <span className="text-purple-400 font-medium">
                  ${item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-gray-200">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Shipping</span>
          <span className="text-green-400">Free</span>
        </div>
        
        {/* Total */}
        <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-[#252525]">
          <span className="text-gray-200">Total</span>
          <span className="text-purple-400">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};