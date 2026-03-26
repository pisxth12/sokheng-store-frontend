"use client"

import './orders.css'
import { useOrders } from '@/hooks/open/useOrders'
import { Package, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STATUS_CONFIG = {
    'COMPLETED': {
        dot: 'bg-emerald-500',
        badge: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60',
        label: 'Completed'
    },
    'PENDING': {
        dot: 'bg-amber-400',
        badge: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/60',
        label: 'Pending'
    },
    'PROCESSING': {
        dot: 'bg-sky-500',
        badge: 'text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/60',
        label: 'Processing'
    },
    'CANCELLED': {
        dot: 'bg-rose-400',
        badge: 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/60',
        label: 'Cancelled'
    },
} as const

const FALLBACK_STATUS = {
    dot: 'bg-gray-400',
    badge: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    label: ''
}

const getStatus = (status: string) =>
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? { ...FALLBACK_STATUS, label: status }

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    })

export default function MyOrdersPage() {
    const {
        orders,
        loading,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        canGoNext,
        canGoPrevious
    } = useOrders()

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0f0f0f]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-stone-300 dark:border-stone-700 border-t-stone-800 dark:border-t-stone-200 rounded-full animate-spin" />
                    <span className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-600 font-medium">
                        Loading
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="font-body min-h-screen transition-colors duration-300">
            <div className="max-w-2xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-600 font-medium mb-1">
                        Account
                    </p>
                    <h1 className="font-display text-3xl font-light text-stone-900 dark:text-stone-100">
                        My Orders
                    </h1>
                </div>

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="space-y-3  dark:bg-stone-80 rounded-lg ">
                        {orders.map((order, index) => {
                            const status = getStatus(order.status)
                            return (
                                <Link
                                    key={index}
                                    href={`/order-details?orderID=${order.orderNumber}`}
                                    className="order-card  fade-in block bg-white dark:bg-darkbg  rounded-xl border border-stone-200/70 dark:border-stone-800/80 overflow-hidden hover:border-stone-300 dark:hover:border-stone-700 shadow-sm hover:shadow-md dark:shadow-none"
                                >
                                    {/* Top row: status + date | total + arrow */}
                                    <div className="flex items-center justify-between px-5 pt-4 pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${status.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                {status.label}
                                            </span>
                                            <span className="text-[11px] text-stone-400 dark:text-stone-600">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-display text-lg font-light text-stone-900 dark:text-stone-100">
                                                ${order.totalAmount.toFixed(2)}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-700" />
                                        </div>
                                    </div>

                                    {/* Order number */}
                                    <div className="px-5 mb-3">
                                        <p className="text-[11px] font-medium text-stone-400 tracking-widest uppercase">
                                            {order.orderNumber}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="mx-5 border-t border-stone-100 dark:border-stone-800/80" />

                                    {/* Items */}
                                    <div className="px-5 py-3 space-y-2.5">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    {item.productImage ? (
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            className="w-9 h-9 rounded-lg object-cover bg-stone-100 dark:bg-stone-800 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                                                            <Package className="w-4 h-4 text-stone-400 dark:text-stone-600" />
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-stone-700 dark:text-stone-300 font-medium truncate max-w-45">
                                                        {item.productName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 shrink-0">
                                                    <span className="text-xs text-stone-400 dark:text-stone-600">
                                                        ×{item.quantity}
                                                    </span>
                                                    <span className="text-sm font-medium text-stone-800 dark:text-stone-200 w-16 text-right">
                                                        ${item.subtotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-20 fade-in">
                            <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center mx-auto mb-5">
                                <Package className="w-6 h-6 text-stone-400 dark:text-stone-600" />
                            </div>
                            <h3 className="font-display text-xl font-light text-stone-800 dark:text-stone-200 mb-2">
                                No orders yet
                            </h3>
                            <p className="text-sm text-stone-400 dark:text-stone-600">
                                Start shopping to see your orders here
                            </p>
                        </div>
                    )
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            disabled={!canGoPrevious}
                            onClick={goToPrevPage}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                                       text-stone-600 dark:text-stone-400
                                       bg-white dark:bg-[#1a1a1a]
                                       border border-stone-200 dark:border-stone-800
                                       hover:bg-stone-50 dark:hover:bg-stone-900
                                       disabled:opacity-30 disabled:cursor-not-allowed
                                       transition-all duration-150"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <span className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-600 font-medium">
                            {currentPage + 1} / {totalPages}
                        </span>

                        <button
                            disabled={!canGoNext}
                            onClick={goToNextPage}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                                       text-stone-600 dark:text-stone-400
                                       bg-white dark:bg-[#1a1a1a]
                                       border border-stone-200 dark:border-stone-800
                                       hover:bg-stone-50 dark:hover:bg-stone-900
                                       disabled:opacity-30 disabled:cursor-not-allowed
                                       transition-all duration-150"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}