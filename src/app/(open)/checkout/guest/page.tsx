"use client"
import { useCart } from "@/hooks/open/useCart"
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRModal from "@/components/checkout/QRModal";
import { authApi } from "@/lib/open/auth";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import OtpModal from "@/components/open/accounts/OtpModal";

export default function GuestCheckoutPage() {
    const { cart, loading, checkout, loadCart, isCartLoaded, itemCount } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState({ 
        name: '', email: '', phone: '', address: '' 
    });
    const [showQRModal, setShowQRModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [qrData, setQrData] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);

    //  Load cart on mount if not loaded
    useEffect(() => {
        if (!isCartLoaded) {
            loadCart();
        }
    }, [isCartLoaded, loadCart]);

    //  Debug: Log cart data
    useEffect(() => {
        console.log("Cart data:", cart);
        console.log("Item count:", itemCount);
        console.log("Cart items:", cart?.items);
    }, [cart, itemCount]);

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'phone') {
            setIsPhoneVerified(false);
            setError(null);
        }
    };

    const handleSendOtp = async () => {
        if (!formData.phone || formData.phone.length < 10) {
            setError("Please enter a valid phone number");
            return;
        }
        
        setError(null);
        
        try {
            await authApi.sendOtp(formData.phone);
            setShowOtpModal(true);
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        try {
            await authApi.verifyOtp(formData.phone, otp);
            setIsPhoneVerified(true);
            setShowOtpModal(false);
            toast.success("Phone verified successfully!");
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResendOtp = async () => {
        try {
            await authApi.sendOtp(formData.phone);
            toast.success("OTP resent successfully");
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to resend OTP");
        }
    };

    const handlePlaceOrder = async () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            setError("Please fill in all required fields");
            return;
        }
        
        if (!isPhoneVerified) {
            setError("Please verify your phone number first");
            return;
        }
        
        if (!cart?.items?.length) {
            setError("Your cart is empty");
            return;
        }
        
        setIsProcessing(true);
        setError(null);
        
        try {
            const result = await checkout({
                customerName: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                items: cart.items
            });
            
            toast.success("Order placed successfully!");
            router.push(`/orders/${result.order.orderNumber}`);
            
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Checkout failed";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlePlaceOrder();
        }
    };

    //  Show loading while cart is loading
    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }


    if (!cart?.items?.length) {
        return (
            <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-white/40 text-sm">Your cart is empty</p>
                    <button 
                        onClick={() => router.push('/products')} 
                        className="text-sm border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const total = cart?.items?.reduce((sum, i) => sum + i.totalPrice, 0) || 0;
    const isFormValid = formData.name && formData.email && formData.phone && formData.address;
    const canPlaceOrder = isFormValid && isPhoneVerified && !isProcessing;

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <QRModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                qrString={qrData?.qrString || ''}
                amount={qrData?.amount || 0}
                orderNumber={qrData?.orderNumber || ''}
            />

            <OtpModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                phone={formData.phone}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
            />

            {/* Top bar */}
            <div className="border-b border-white/6 px-6 py-4 flex items-center justify-between">
                <button 
                    onClick={() => router.back()} 
                    className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back
                </button>
                <span className="mono text-xs text-white/25 tracking-widest uppercase">Guest Checkout</span>
                <div className="w-12" />
            </div>

            <div className="max-w-2xl mx-auto px-6 py-10 space-y-3">
                {/* Cart Summary */}
                <div className="rounded-2xl border border-white/6 bg-white/2 px-5 py-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-white/60">Items in cart:</span>
                        <span className="text-sm text-white">{cart.items.length} item(s)</span>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-sm text-red-400 text-center">{error}</p>
                    </div>
                )}

                {/* Info form - same as before */}
                <div className="rounded-2xl border border-white/6 bg-white/2 px-5 pt-5 pb-2">
                    <p className="text-[11px] mono text-white/30 uppercase tracking-widest mb-4">
                        Your Information
                    </p>
                    <div className="space-y-3">
                        {/* Name Field */}
                        <div className="field-wrap">
                            <input
                                ref={nameRef}
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, emailRef as React.RefObject<HTMLElement>)}
                                placeholder="Full name"
                                className="p-2 border-2 w-full border-white/6 rounded-xl focus:outline-none focus:border-white bg-white/2"
                            />
                        </div>
                        
                        {/* Email Field */}
                        <div className="field-wrap">
                            <input
                                ref={emailRef}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, phoneRef as React.RefObject<HTMLElement>)}
                                placeholder="Email address"
                                className="p-2 border-2 w-full border-white/6 rounded-xl focus:outline-none focus:border-white bg-white/2"
                            />
                        </div>
                        
                        {/* Phone Field with Verification Button */}
                        <div className="field-wrap">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        ref={phoneRef}
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onKeyDown={(e) => handleKeyDown(e, addressRef as React.RefObject<HTMLElement>)}
                                        placeholder="Phone number"
                                        disabled={isPhoneVerified}
                                        className={`p-2 ${formData.phone.length < 9 ? "border-red-300 focus:border-red-500" : "border-white/6 focus:border-white"} border-2 w-full  rounded-xl focus:outline-none  bg-white/2 disabled:opacity-50`}
                                    />
                                    {isPhoneVerified && (
                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                    )}
                                </div>
                                
                                {!isPhoneVerified && formData.phone && formData.phone.length >= 10 && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors whitespace-nowrap"
                                    >
                                        Verify
                                    </button>
                                )}
                            </div>
                            {isPhoneVerified && (
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Phone verified successfully
                                </p>
                            )}
                        </div>
                        
                        
                        

                        {/* Address Field */}
                        <div className="field-wrap mb-2">
                            <textarea
                                ref={addressRef}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onKeyDown={handleTextareaKeyDown}
                                placeholder="Delivery address (Press Enter to submit)"
                                rows={2}
                                className="p-4 border-2 w-full border-white/6 rounded-xl focus:outline-none focus:border-white bg-white/2"
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
                    disabled={!canPlaceOrder}
                    className={`w-full py-4 rounded-2xl border font-medium text-sm tracking-wide transition-colors ${
                        canPlaceOrder 
                            ? 'border-white/15 text-white hover:bg-white/5 cursor-pointer' 
                            : 'border-white/10 text-white/30 cursor-not-allowed'
                    }`}
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

                {formData.phone && !isPhoneVerified && (
                    <p className="text-xs text-center text-yellow-500/70 mt-2">
                        Please verify your phone number before placing order
                    </p>
                )}
            </div>
        </div>
    );
}