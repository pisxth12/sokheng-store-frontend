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
    const { cart, loading, updateQuantity, removeItem, itemCount,  getItemQuantity } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [visible, setVisible] = useState(false);
    const t = useTranslations("Cart");

    


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
                className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm cart-backdrop-in"
                onClick={onClose}
            />

            {/* Panel */}
            <div className={[
                "absolute right-0 top-0 bottom-0 w-full max-w-md",
                "flex flex-col shadow-2xl",
                "bg-gray-50 dark:bg-zinc-950",
                visible ? "cart-panel-enter" : "cart-panel-exit",
            ].join(" ")}>

                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-amber-400 via-orange-500 to-rose-500" />

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                            {itemCount > 0 ? (
                                <>
                                   {t('title', { count: itemCount > 99 ? '99+' : itemCount })}
                                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 cart-badge-pop">
                                        {itemCount > 99 ? "99+" : itemCount}
                                    </span>
                                </>
                            ) : (
                                `${t('cartWithCount', { count: '0'})}`
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={onClose} 
                        className="group p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all duration-200 active:scale-90"
                        aria-label="Close cart"
                    > 
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 group-hover:rotate-90 transition-all duration-200" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4 overflow-hidden">
                    {loading ? (
                        /* Skeleton */
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
                                    <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-zinc-800 animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-2 pt-1">
                                        <div className="h-3 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse w-3/4" />
                                        <div className="h-3 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse w-1/3" />
                                        <div className="h-7 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse w-1/2 mt-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !cart?.items?.length ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                            {/* <div className="cart-empty-float p-5 rounded-2xl bg-gray-100 dark:bg-zinc-900">
                                <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-zinc-600" />
                            </div> */}
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{t('nothingHere')}</p>
                            </div>
                            <button
                                onClick={handleMove}
                                
                                className="mt-2 flex items-center gap-2 px-5 py-2.5  border border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-200 active:scale-95"
                            >
                                {t('browseProducts')} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        /* Items list */
                        <div className="space-y-1">
                            {cart.items.map((item, i) => (
                                <div
                                    key={item.id}
                                    className={[
                                        "flex gap-4 py-4 border-b border-gray-100 dark:border-zinc-800/70",
                                        
                                        i === 0 ? "cart-item-enter [animation-delay:0ms]"    : "",
                                        i === 1 ? "cart-item-enter [animation-delay:55ms]"   : "",
                                        i === 2 ? "cart-item-enter [animation-delay:110ms]"  : "",
                                        i === 3 ? "cart-item-enter [animation-delay:165ms]"  : "",
                                        i  >= 4 ? "cart-item-enter [animation-delay:220ms]"  : "",
                                        removingId === item.id ? "cart-item-exit" : "",
                                    ].join(" ")}
                                >
                                    {/* Image */}
                                    <Link
                                        href={`/products/${item.slug}`}
                                        onClick={onClose}
                                        className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-zinc-900 hover:opacity-90 transition-opacity ring-1 ring-black/5 dark:ring-white/5"
                                    >
                                        {item.productImage ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-7 h-7 text-gray-300 dark:text-zinc-700" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate leading-snug">
                                            {item.productName}
                                        </p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                                            ${item.price.toFixed(2)}
                                        </p>

                                        {/* Qty controls */}
                                        <div className="flex items-center gap-1.5 mt-2.5">
                                            <button
                                                disabled={item.quantity === 1}
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-90"
                                            >
                                                <Minus className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                                            </button>
                                            <span className="w-7 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <button
                                                disabled={item.quantity >= item.stock}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className={`w-7 h-7 ${item.quantity >= item.stock ? "opacity-30 cursor-not-allowed" : ""} flex items-center justify-center rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-150 active:scale-90`}
                                            >
                                                <Plus className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                                            </button>

                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 active:scale-90 group"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-600 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total */}
                                    <div className="shrink-0 text-right pt-0.5">
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            ${item.totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart?.items && cart.items.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-zinc-800 px-5 py-5 space-y-4 bg-white dark:bg-zinc-950">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('subtotal')}</span>
                            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                ${cart?.totalPrice?.toFixed(2) || "0.00"}
                            </span>
                        </div>

                        <button
                            onClick={handleProceedToCheckout}
                            className="cart-shimmer-btn group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white dark:text-gray-900 text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                        >
                                {t('checkout')}
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>

                        <p className="text-xs text-center text-gray-400 dark:text-zinc-600">
                            {t('taxShipping')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};