"use client"
import './css/cartSidebar.css'
import { useAuth } from "@/hooks/open/useAuth";
import { useCart } from "@/hooks/open/useCart";
import { Trash2, ShoppingBag, Plus, Minus, X, ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CartSideBar = ({ isOpen, onClose }: Props) => {
    const { cart, loading, updateQuantity, removeItem, itemCount,  loadCart, isCartLoaded } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [visible, setVisible] = useState(false);
    const t = useTranslations("Cart");

     useEffect(() => {
        if (isOpen) {
            loadCart();
        }
    }, [isOpen, loadCart]);

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true));
            document.body.style.overflow = "hidden";
        } else {
            setVisible(false);
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const handleProceedToCheckout = () => {
        router.push(isAuthenticated ? "/checkout" : "/checkout/guest");
        onClose();
    };

    const handleMove = () => {
        router.push("/products");
        onClose();
    };

    const handleRemove = (id: number) => {
        setRemovingId(id);
        setTimeout(() => {
            removeItem(id);
            setRemovingId(null);
        }, 320);
    };

    if (!isOpen) return null;

   return (
    <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        />

        {/* Panel */}
        <div className={[
            "absolute right-0 top-0 bottom-0 w-full max-w-md",
            "flex flex-col shadow-xl",
            "bg-[#F9F9F9] dark:bg-[#1A1A1A]",
            "transform transition-transform duration-300 ease-out",
            visible ? "translate-x-0" : "translate-x-full",
        ].join(" ")}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-[#666666] dark:text-[#AAAAAA]" />
                    <h2 className="text-base font-semibold text-[#222222] dark:text-[#FFFFFF]">
                        {itemCount > 0 ? (
                            <>
                                {t('title', { count: itemCount > 99 ? '99+' : itemCount })}
                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-[#222222] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#222222] rounded-full">
                                    {itemCount > 99 ? "99+" : itemCount}
                                </span>
                            </>
                        ) : (
                            t('cartWithCount', { count: '0' })
                        )}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-[#EEEEEE] dark:hover:bg-[#2A2A2A] transition-colors"
                >
                    <X className="w-5 h-5 text-[#666666] dark:text-[#AAAAAA]" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
                {loading ? (
                    /* Skeleton */
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                                <div className="w-20 h-20 rounded-lg bg-[#E5E5E5] dark:bg-[#2A2A2A] animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded w-1/4 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !cart?.items?.length ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <ShoppingBag className="w-12 h-12 text-[#CCCCCC] dark:text-[#444444] mb-4" />
                        <p className="text-[#222222] dark:text-[#FFFFFF] font-medium mb-2">
                            {t('nothingHere')}
                        </p>
                        <button
                            onClick={handleMove}
                            className="mt-4 px-6 py-2 bg-[#222222] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#222222] text-sm font-medium rounded-lg hover:bg-[#444444] dark:hover:bg-[#EEEEEE] transition-colors"
                        >
                            {t('browseProducts')}
                        </button>
                    </div>
                ) : (
                    /* Items list */
                    <div className="space-y-4">
                        {cart.items.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] p-3 rounded-lg last:border-0"
                                style={{ animation: `fadeIn 0.3s ease-out ${index * 0.1}s both` }}
                            >
                                {/* Product image */}
                                <Link
                                    href={`/products/${item.slug}`}
                                    onClick={onClose}
                                    className="w-20 h-20 rounded-lg overflow-hidden bg-[#F0F0F0] dark:bg-[#2A2A2A] shrink-0"
                                >
                                    {item.productImage ? (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="w-6 h-6 text-[#AAAAAA] dark:text-[#666666]" />
                                        </div>
                                    )}
                                </Link>

                                {/* Product details */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/products/${item.slug}`}
                                        onClick={onClose}
                                        className="text-sm font-medium text-[#222222] dark:text-[#FFFFFF] hover:underline line-clamp-2"
                                    >
                                        {item.productName}
                                    </Link>
                                    
                                    <p className="text-sm font-semibold text-[#222222] dark:text-[#FFFFFF] mt-1">
                                        ${item.price.toFixed(2)}
                                    </p>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-7 h-7 flex items-center justify-center rounded border border-[#CCCCCC] dark:border-[#444444] hover:bg-[#F0F0F0] dark:hover:bg-[#2A2A2A] disabled:opacity-30 transition-colors"
                                        >
                                            <Minus className="w-3 h-3 text-[#222222] dark:text-[#FFFFFF]" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium text-[#222222] dark:text-[#FFFFFF]">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}
                                            className="w-7 h-7 flex items-center justify-center rounded border border-[#CCCCCC] dark:border-[#444444] hover:bg-[#F0F0F0] dark:hover:bg-[#2A2A2A] disabled:opacity-30 transition-colors"
                                        >
                                            <Plus className="w-3 h-3 text-[#222222] dark:text-[#FFFFFF]" />
                                        </button>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="ml-auto w-7 h-7 flex items-center justify-center rounded hover:bg-[#FFE5E5] dark:hover:bg-[#441111] transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-[#999999] dark:text-[#666666] hover:text-[#FF4444] dark:hover:text-[#FF6666]" />
                                        </button>
                                    </div>
                                </div>

                                {/* Item total */}
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-[#222222] dark:text-[#FFFFFF]">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {cart?.items && cart.items.length > 0 && (
                <div className="border-t border-[#E5E5E5] dark:border-[#2A2A2A] px-5 py-4 bg-[#F9F9F9] dark:bg-[#1A1A1A]">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[#666666] dark:text-[#AAAAAA]">Subtotal</span>
                        <span className="text-lg font-semibold text-[#222222] dark:text-[#FFFFFF]">
                            ${cart.totalPrice?.toFixed(2) || "0.00"}
                        </span>
                    </div>

                    <button
                        onClick={handleProceedToCheckout}
                        className="w-full py-3 bg-[#222222] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#222222] text-sm font-medium rounded-lg hover:bg-[#444444] dark:hover:bg-[#EEEEEE] transition-colors"
                    >
                        {t('checkout')}
                    </button>

                    <p className="text-xs text-center text-[#999999] dark:text-[#666666] mt-3">
                        {t('taxShipping')}
                    </p>
                </div>
            )}
        </div>

      
    </div>
);


};