"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Link from "next/link";
import EditProfileModal from "@/components/open/accounts/EditProfile";
import { UpdateProfileRequest } from "@/types/open/auth.type";
import { Backpack, Edit2, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { CartItemResponse, CartResponse } from "@/types/open/cart.type";
import { User } from "@/types/open/user.type";
import { useAuth } from "@/hooks/open/useAuth";
import { EmptyItems } from "@/components/ui/EmptyItems";
import { checkout } from "../actions/cart.actions";


interface Props {
  initialUser: User;
  cart: CartResponse;
}

export default function CheckoutClient({ initialUser, cart }: Props) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localUser, setLocalUser] = useState(initialUser);
  const { updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState("");

  const isAuthenticated = !!initialUser;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const result = await checkout({
        customerName: localUser.name,
        email: localUser.email,
        phone: localUser.phone || "",
        address: localUser.address || "",
        note: note || "",
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

  const handleSaveProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      setIsUpdating(true);
      try {
        await updateProfile(data);
        setLocalUser((prev) => ({ ...prev!, ...data }));
        setIsEditModalOpen(false);
        window.location.reload();
      } catch (error) {
        console.error(error);
      } finally {
        setIsUpdating(false);
      }
    },
    [updateProfile]
  );

  if (cart?.items?.length === 0)
    return <EmptyItems icon={Backpack} title="Your cart is empty" description="" buttonLink="/products" />;
  if (!isAuthenticated) return null;

  const subtotal = cart?.items?.reduce((sum: number, i: CartItemResponse) => sum + i.totalPrice, 0) || 0;

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0f0f0e] co-page-enter">

        {/* Top bar */}
        <div className="co-topbar">
          <button onClick={() => router.back()} className="co-back-btn">
            <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
            Back
          <span className="co-topbar-title">Checkout</span>
          </button>
          <div className="co-steps">  
            <div className="co-step done"><span className="co-step-num">✓</span>Cart</div>
            <div className="co-step-divider" />
            <div className="co-step active"><span className="co-step-num">2</span>Review</div>
            <div className="co-step-divider" />
            <div className="co-step"><span className="co-step-num">3</span>Confirm</div>
          </div>
        </div>

        {/* Grid: left = items+note, right = user+summary */}
        <div className="max-w-primary mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── LEFT: Items then Note ── */}
          <div className="space-y-4 co-section-enter">

            {/* Items */}
            <div className="co-panel rounded-checkout overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b ">
                <span className="co-label">
                  Order · {cart?.items?.length} {cart?.items?.length === 1 ? "item" : "items"}
                </span>
                <Link href="/cart" className="co-edit-link">Edit cart</Link>
              </div>

              {cart?.items?.map((item: CartItemResponse, idx: number) => (
                <div
                  key={item.id}
                  className="co-item-row flex items-center gap-4 px-5 py-4"
                  style={{ animationDelay: `${0.08 + idx * 0.05}s` }}
                >
                  {item.productImage ? (
                    <Link href={`/${item.categorySlug}/${item.slug}`} className="co-item-img w-14 h-14 shrink-0">
                      <img src={item.productImage} alt={item.productName} />
                    </Link>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#f7f7f5] dark:bg-[#1a1a18] shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#111110] dark:text-[#f5f5f3] truncate">{item.productName}</p>
                    <p className="text-xs font-mono text-[#a3a39f] dark:text-[#5a5a57] mt-0.5">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <span className="text-sm font-mono text-[#111110] dark:text-[#f5f5f3] shrink-0">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Note — directly below items */}
            <div className="co-panel rounded-checkout p-5">
              <p className="co-label mb-3">Order note</p>
              <textarea
                className="co-note"
                rows={3}
                placeholder="Any special instructions or delivery notes…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* ── RIGHT: Deliver to + Summary + CTA ── */}
          <div className="space-y-4 co-section-enter" style={{ animationDelay: "0.1s" }}>

            {/* Deliver to */}
            <div className="co-panel rounded-checkout p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="co-label">Deliver to</span>
                <button onClick={() => setIsEditModalOpen(true)} className="co-deliver-edit">
                  <Edit2 className="w-3 h-3" strokeWidth={1.5} />
                  Edit
                </button>
              </div>
              <p className="text-sm font-medium text-[#111110] dark:text-[#f5f5f3] mb-1">
                {localUser?.name || "Customer"}
              </p>
              <p className={`text-xs leading-relaxed ${!localUser?.address ? "co-missing" : "text-[#6b6b67] dark:text-[#9a9a96]"}`}>
                {localUser?.address || "⚠ No address — please add one"}
              </p>
              <p className={`text-xs font-mono mt-0.5 ${!localUser?.phone ? "co-missing" : "text-[#a3a39f] dark:text-[#5a5a57]"}`}>
                {localUser?.phone || "⚠ No phone — please add one"}
              </p>
              <div className="h-px bg-[#f0f0ee] dark:bg-[#232320] mt-3 mb-2" />
              <p className="text-xs font-mono text-[#a3a39f] dark:text-[#5a5a57]">{localUser?.email}</p>
            </div>

            {/* Summary */}
            <div className="co-panel rounded-checkout p-5">
              <p className="co-label mb-4">Summary</p>

              <div className="space-y-2.5">
                <div className="co-total-row">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="co-total-row">
                  <span>Delivery</span>
                  <span className="text-emerald-500 dark:text-emerald-400 text-xs font-mono">FREE</span>
                </div>
              </div>

              <div className="h-px bg-[#f0f0ee] dark:bg-[#232320] my-4" />

              <div className="flex items-baseline justify-between">
                <span className="co-grand-total">Total</span>
                <span className="co-grand-mono">${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="place-btn w-full py-4 mt-5  flex items-center justify-center gap-2.5"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border border-white/30 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
                    Placing order…
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" strokeWidth={2} />
                    Place order · ${subtotal.toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  {["Visa", "MC", "Amex", "PayPal"].map((c) => (
                    <span key={c} className="co-badge">{c}</span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#a3a39f] dark:text-[#3a3a37]" strokeWidth={1.5} />
                  <div className="co-guarantee">
                    <span>Secure</span>
                    <span className="co-guarantee-dot" />
                    <span>Free returns</span>
                    <span className="co-guarantee-dot" />
                    <span>SSL</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-[#a3a39f] dark:text-[#5a5a57]">
              Need help?{" "}
              <a href="/contact" className="text-[#111110] dark:text-[#f5f5f3] underline underline-offset-2 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={{ name: localUser.name, phone: localUser.phone, address: localUser.address }}
      />
    </>
  );
}