'use client'

import { CartResponse } from "@/types/open/cart.type";

interface OrderTotalProps {
  cart: CartResponse | null;
  showBreakdown?: boolean;
  className?: string;
}

export const OrderTotal = ({ cart, showBreakdown = true, className = '' }: OrderTotalProps) => {
  const subtotal = cart?.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  const shipping = 0; // Free shipping
  const tax = 0; // No tax
  const total = subtotal + shipping + tax;

  return (
    <div className={`bg-[#1A1A1A] rounded-xl p-4 border border-[#252525] ${className}`}>
      {showBreakdown ? (
        // Detailed breakdown
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shipping</span>
            <span className="text-green-400">Free</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tax</span>
            <span className="text-white">$0.00</span>
          </div>

          {/* Total */}
          <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t border-[#252525]">
            <span className="text-gray-200">Total</span>
            <span className="text-purple-400">${total.toFixed(2)}</span>
          </div>

          {/* Payment info */}
          <p className="text-xs text-gray-500 text-center pt-2">
            💳 Secure payment
          </p>
        </div>
      ) : (
        // Compact version - just total
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total</span>
          <span className="text-2xl font-bold text-purple-400">
            ${total.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};