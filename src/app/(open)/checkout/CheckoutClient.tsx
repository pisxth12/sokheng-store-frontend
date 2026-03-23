"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import EmptyCart from "@/components/ui/EmptyCart";
import Link from "next/link";
import EditProfileModal from "@/components/open/accounts/EditProfile";
import { UpdateProfileRequest } from "@/types/open/auth.type";
import { Edit } from "lucide-react";
import { useCart } from "@/hooks/open/useCart";

import { CartItemResponse, CartResponse } from "@/types/open/cart.type";
import { User } from "@/types/open/user.type";
import { useAuth } from "@/hooks/open/useAuth";

interface Props {
  initialUser: User;
  cart: CartResponse;
}

export default function CheckoutClient({ initialUser, cart }: Props) {
  const router = useRouter();
  const { checkout } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localUser, setLocalUser] = useState(initialUser);
  const { updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  



  const isAuthenticated = !!initialUser;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const result = await checkout({
        customerName: localUser.name,
        email: localUser.email,
        phone: localUser.phone || "",
        address: localUser.address || "",
        note: "",
        items: cart.items,
      });
      router.push(`/order-details?orderID=${result.order.orderNumber}`);
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveProfile = useCallback(async (data: UpdateProfileRequest) => {
    setIsUpdating(true);
    try {
       await updateProfile(data);
      setLocalUser(prev => ({ ...prev!, ...data }));
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }finally{
      setIsUpdating(false);
    }

  }, [updateProfile]);

  if (cart?.items?.length === 0) return <EmptyCart />;
  if (!isAuthenticated) return null;

  const subtotal =
    cart?.items?.reduce((sum: number, i: CartItemResponse) => sum + i.totalPrice, 0) || 0;

  return (
    <>
      <div className="min-h-screen bg-[#080808] text-white">
        {/* Top bar */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="hover:text-white text-sm transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 2L4 7L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
          <span className="mono text-xs tracking-widest uppercase">
            Checkout
          </span>
          <div className="w-12" />
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10 space-y-3">
          {/* Delivery to */}
          <div className="rounded-2xl border bg-white/2 p-5">
            <div className="flex justify-between">
              <p className="text-[11px] mono uppercase tracking-widest mb-3">
                Deliver to
              </p>
              <Edit
                onClick={() => setIsEditModalOpen(true)}
                className="w-4 h-4 cursor-pointer hover:text-slate-400"
              />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-white">
                  {localUser?.name || "Customer"}
                </p>
                <p
                  className={`text-sm mt-0.5 ${!localUser?.address ? "text-red-500 animate-pulse" : ""}`}
                >
                  {localUser?.address || "No address on file"}
                </p>
                <p
                  className={`text-sm ${!localUser?.phone ? "text-red-500 animate-pulse" : ""}`}
                >
                  {localUser?.phone || "No phone"}
                </p>
              </div>
              <span className="text-[11px] mono border rounded-full px-2.5 py-0.5">
                {localUser?.email}
              </span>
            </div>
          </div>

          {/* Order items */}
          <div className="rounded-2xl border bg-white/2 overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <p className="text-[11px] mono uppercase tracking-widest">
                Order · {cart?.items?.length || 0} items
              </p>
            </div>

            <div className="divide-y divide-white/4">
              {cart?.items?.map((item: CartItemResponse) => (
                <div
                  key={item.id}
                  className="item-row flex items-center gap-4 px-5 py-3.5"
                >
                  {item.productImage && (
                    <Link
                      href={`/${item.categorySlug}/${item.slug}`}
                      className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 shrink-0"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs mt-0.5">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="mono text-sm shrink-0">
                    ${item.totalPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t px-5 py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span className="mono text-emerald-400/70">Free</span>
              </div>
              <div className="flex justify-between font-medium text-white pt-1 border-t">
                <span>Total</span>
                <span className="mono">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="place-btn w-full py-4 rounded-2xl border text-white font-medium text-sm tracking-wide"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                Placing order…
              </span>
            ) : (
              `Place Order · $${subtotal.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={{
          name: localUser.name,
          phone: localUser.phone,
          address: localUser.address,
        }}
      />
    </>
  );
}
