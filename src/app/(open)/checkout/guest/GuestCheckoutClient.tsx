"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRModal from "@/components/checkout/QRModal";
import { authApi } from "@/lib/open/auth";
import toast from "react-hot-toast";
import { CheckCircle, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import OtpModal from "@/components/open/accounts/OtpModal";
import { CartResponse } from "@/types/open/cart.type";
import { checkout } from "../../actions/cart.actions";


interface GuestCheckoutClientProps {
    initialCart: CartResponse;
}

export default function GuestCheckoutClient({ initialCart }: GuestCheckoutClientProps) {
    const router = useRouter();
    const [cart] = useState<CartResponse>(initialCart);
    
    const [formData, setFormData] = useState({ 
        name: '', email: '', phone: '+855969851100', address: '' , note: ''
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
    const noteRef = useRef<HTMLTextAreaElement>(null);

    const formatPhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        if(phone.startsWith('0')){
            return "+855"+cleaned.substring(1);
        }
        if (cleaned.startsWith('855')) {
            return '+' + cleaned;
        }
        if (!phone.startsWith('+')) {
            return '+855' + cleaned;
        }
        return cleaned;
    }

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const [cooldown, setCooldown] = useState(0);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'phone') {
            setIsPhoneVerified(false);
            setError(null);
        }
    };

    const handleSendOtp = async () => {
        if (cooldown > 0) {
            toast.error(`Please wait ${cooldown} seconds before trying again`);
            return;
        }
        if (isSendingOtp) return;
        
        const formattedPhone = formatPhone(formData.phone);
        if (!formattedPhone || formattedPhone.length < 12 || formattedPhone.length > 13) {
            setError("Please enter a valid phone number (e.g., 0987654355)");
            return;
        }
        
        setError(null);
        setIsSendingOtp(true);
        
        try {
            await authApi.sendOtp(formattedPhone);
            setShowOtpModal(true);
            toast.success("OTP sent successfully!");
            setCooldown(60);
        } catch (error: any) {
            console.error('Send OTP error:', error);
            if (error.response?.status === 429) {
                setError("Too many OTP requests. Please wait a few minutes before trying again.");
                toast.error("Too many attempts. Please wait a moment.");
                setCooldown(120);
            } else {
                setError(error.response?.data?.error || "Failed to send OTP");
                toast.error("Failed to send OTP");
            }
        } finally {
            setTimeout(() => setIsSendingOtp(false), 1000);
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        try {
            const formattedPhone = formatPhone(formData.phone);
            await authApi.verifyOtp(formattedPhone, otp);
            setIsPhoneVerified(true);
            setShowOtpModal(false);
            toast.success("Phone verified successfully!");
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResendOtp = async () => {
        try {
            const formattedPhone = formatPhone(formData.phone);
            await authApi.sendOtp(formattedPhone);
            toast.success("OTP resent successfully");
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to resend OTP");
        }
    };

    const handlePlaceOrder = async () => {
        const formattedPhone = formatPhone(formData.phone);

        if (!formattedPhone || !formData.email || !formData.phone || !formData.address) {
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
                phone: formattedPhone,
                address: formData.address,
                note: formData.note,
                items: cart.items
            });
            
            toast.success("Order placed successfully!");
            router.push(`/order-details?orderID=${result.order.orderNumber}`);
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

    if (!cart?.items?.length) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0f0f0e] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-400">Your cart is empty</p>
                    <button 
                        onClick={() => router.push('/products')} 
                        className="text-sm border border-gray-200 px-5 py-2.5 rounded-sm hover:bg-gray-100 transition-colors"
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
        <div className="min-h-screen bg-white dark:bg-[#0f0f0e] co-page-enter">
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

            {/* Top bar - Same as login checkout */}
            <div className="co-topbar">
                <button onClick={() => router.back()} className="co-back-btn">
                    <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
                    Back
                </button>
                <div className="co-steps">
                    <div className="co-step done"><span className="co-step-num">✓</span>Cart</div>
                    <div className="co-step-divider" />
                    <div className="co-step active"><span className="co-step-num">2</span>Review</div>
                    <div className="co-step-divider" />
                    <div className="co-step"><span className="co-step-num">3</span>Confirm</div>
                </div>
                <span className="co-topbar-title">Guest Checkout</span>
            </div>

            {/* Grid: left = form, right = summary */}
            <div className="max-w-primary mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* LEFT COLUMN - FORM */}
                <div className="space-y-4 co-section-enter">

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-sm">
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    {/* Information Form */}
                    <div className="co-panel rounded-checkout p-6">
                        <p className="co-label mb-5">Your Information</p>
                        
                        <div className="space-y-4">
                            <input
                                ref={nameRef}
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, emailRef as React.RefObject<HTMLElement>)}
                                placeholder="Full name"
                                className="w-full px-4 py-3 bg-slate-200/50 dark:bg-black/50  rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-900 dark:text-white placeholder:text-gray-400"
                            />
                            
                            <input
                                ref={emailRef}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, phoneRef as React.RefObject<HTMLElement>)}
                                placeholder="Email address"
                                className="w-full px-4 py-3 bg-slate-200/50 dark:bg-black/50  rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-900 dark:text-white placeholder:text-gray-400"
                            />
                            
                            <div>
                                <div className="flex gap-3">
                                     <div   
                                            className="px-5 py-3 bg-gray-900/50 dark:bg-darkbg  text-white dark:text-white  flex items-center  justify-center dark:hover::bg-gray-800 rounded-sm text-sm transition-colors whitespace-nowrap"
                                        >
                                            +855
                                        </div>
                                    
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
                                            className={`w-full px-4 py-3 bg-slate-200/50 dark:bg-black/50 rounded-sm focus:outline-none focus:ring-1 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 ${
                                                isPhoneVerified 
                                                    ? 'focus:ring-green-500 bg-green-50 dark:bg-green-500/5 border-green-300' 
                                                    : ' focus:ring-gray-400'
                                            } disabled:opacity-60`}
                                        />
                                        {isPhoneVerified && (
                                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                    
                                    {!isPhoneVerified && formData.phone && formData.phone.length >= 10 && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            className="px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-sm text-sm transition-colors whitespace-nowrap"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                                {isPhoneVerified && (
                                    <p className="text-xs text-green-600 dark:text-green-500 mt-2 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Phone verified successfully
                                    </p>
                                )}
                            </div>

                            <textarea
                                ref={addressRef}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onKeyDown={handleTextareaKeyDown}
                                placeholder="Delivery address"
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-200/50 dark:bg-black/50  rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
                            />
                            
                            <textarea
                                ref={noteRef}
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                onKeyDown={handleTextareaKeyDown}
                                placeholder="Notes (optional)"
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-200/50 dark:bg-black/50  rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
                            />
                        </div>
                    </div>

                    {/* Phone Verification Reminder */}
                    {formData.phone && !isPhoneVerified && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-sm">
                            <p className="text-xs text-yellow-600 dark:text-yellow-500 text-center">
                                Please verify your phone number before placing order
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - ORDER SUMMARY */}
                <div className="space-y-4 co-section-enter sticky top-24">
                    <div className="co-panel rounded-checkout overflow-hidden">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                            <p className="co-label">
                                Order Summary · {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[320px] overflow-y-auto">
                            {cart.items.map(item => (
                                <div key={item.id} className="flex items-center  gap-4  border-0 p-4">
                                    {item.productImage && (
                                        <div className="w-12 h-12 rounded-sm overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.productName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            ${item.price} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-900 dark:text-white shrink-0">
                                        ${item.totalPrice.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 border-t border-gray-100 dark:border-gray-800">
                            <div className="co-total-row mb-2">
                                <span>Subtotal</span>
                                <span className="font-mono">${total.toFixed(2)}</span>
                            </div>
                            <div className="co-total-row mb-2">
                                <span>Delivery</span>
                                <span className="text-emerald-500 text-xs font-mono">FREE</span>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-3" />
                            <div className="flex items-baseline justify-between">
                                <span className="co-grand-total">Total</span>
                                <span className="co-grand-mono">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={!canPlaceOrder}
                        className={`place-btn w-full py-4 ${canPlaceOrder ? '' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-3.5 h-3.5 border border-white/30 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
                                Placing order…
                            </>
                        ) : (
                            <div className="flex items-center gap-1 justify-center gap-4" >
                                Place order · ${total.toFixed(2)}
                                <Lock className="w-3 h-3" strokeWidth={2} />
                            </div>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5">
                        {["Visa", "ABA", "ACELIDA", "Wing"].map((c) => (
                            <span key={c} className="co-badge">{c}</span>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-gray-400" />
                        <div className="co-guarantee">
                            <span>Secure</span>
                            <span className="co-guarantee-dot" />
                            <span>Free returns</span>
                            <span className="co-guarantee-dot" />
                            <span>SSL</span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400">
                        Need help?{" "}
                        <a href="/contact" className="text-gray-900 dark:text-white underline underline-offset-2 hover:text-red-500 transition-colors">
                            Contact us
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}