"use client"
import { useCart } from "@/hooks/open/useCart"
import { useState } from "react";
import { useRouter } from "next/navigation";
import QRModal from "@/components/checkout/QRModal";

export default function GuestCheckoutPage() {
    const { cart, loading, checkout } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrData, setQrData] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlaceOrder = async () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }
        if (!cart?.items?.length) { alert('Your cart is empty'); return; }
        setIsProcessing(true);
        try {
            const result = await checkout({
                customerName: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                items: cart.items
            });
            router.push(`/orders/${result.order.orderNumber}`);
        } catch (error) {
            console.error(error);
            alert('Checkout failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center">
            <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    if (!cart?.items?.length) return (
        <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');*{font-family:'DM Sans',sans-serif}`}</style>
            <div className="text-center space-y-4">
                <p className="text-white/40 text-sm">Your cart is empty</p>
                <button onClick={() => router.push('/products')} className="text-sm border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    Continue Shopping
                </button>
            </div>
        </div>
    );

    const total = cart?.items?.reduce((sum, i) => sum + i.totalPrice, 0) || 0;
    const filled = Object.values(formData).every(v => v.trim() !== '');

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            

            <QRModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                qrString={qrData?.qrString || ''}
                amount={qrData?.amount || 0}
            />

            {/* Top bar */}
            <div className="border-b border-white/6 px-6 py-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back
                </button>
                <span className="mono text-xs text-white/25 tracking-widest uppercase">Guest Checkout</span>
                <div className="w-12" />
            </div>

            <div className="max-w-2xl mx-auto px-6 py-10 space-y-3">

                {/* Info form */}
                <div className="rounded-2xl border border-white/6 bg-white/2 px-5 pt-5 pb-2">
                    <p className="text-[11px] mono text-white/30 uppercase tracking-widest mb-4">Your Information</p>
                    <div>
                        {[
                            { name: 'name', placeholder: 'Full name', type: 'text' },
                            { name: 'email', placeholder: 'Email address', type: 'email' },
                            { name: 'phone', placeholder: 'Phone number', type: 'tel' },
                        ].map(f => (
                            <div key={f.name} className="field-wrap">
                                <input
                                    name={f.name}
                                    type={f.type}
                                    value={formData[f.name as keyof typeof formData]}
                                    onChange={handleChange}
                                    placeholder={f.placeholder}
                                    className="field"
                                />
                            </div>
                        ))}
                        <div className="field-wrap mb-2">
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Delivery address"
                                rows={2}
                                className="field resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="rounded-2xl border border-white/6 bg-white/2 overflow-hidden">
                    <div className="px-5 pt-5 pb-3">
                        <p className="text-[11px] mono text-white/30 uppercase tracking-widest">
                            Items · {cart.items.length}
                        </p>
                    </div>

                    <div className="divide-y divide-white/4">
                        {cart.items.map(item => (
                            <div key={item.id} className="item-row flex items-center gap-4 px-5 py-3.5">
                                {item.productImage && (
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 shrink-0">
                                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{item.productName}</p>
                                    <p className="text-xs text-white/35 mt-0.5">${item.price} × {item.quantity}</p>
                                </div>
                                <p className="mono text-sm text-white/70 shrink-0">${item.totalPrice.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/6 px-5 py-4 flex justify-between items-center">
                        <span className="text-sm text-white/40">Total</span>
                        <span className="mono font-medium text-white">${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !filled}
                    className="place-btn w-full py-4 rounded-2xl border border-white/15 text-white font-medium text-sm tracking-wide"
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                            Placing order…
                        </span>
                    ) : (
                        `Place Order · $${total.toFixed(2)}`
                    )}
                </button>

            </div>
        </div>
    );
}