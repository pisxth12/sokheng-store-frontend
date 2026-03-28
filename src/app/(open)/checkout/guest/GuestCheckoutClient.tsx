"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRModal from "@/components/checkout/QRModal";
import { authApi } from "@/lib/open/auth";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
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
        // Check cooldown
        if (cooldown > 0) {
            toast.error(`Please wait ${cooldown} seconds before trying again`);
            return;
        }
        
        // Prevent multiple rapid requests
        if (isSendingOtp) {
            return;
        }
        
        const formattedPhone = formatPhone(formData.phone);
        
        console.log('Sending OTP to:', formattedPhone);
        
        if (!formattedPhone || formattedPhone.length < 12 || formattedPhone.length > 13) {
            setError("Please enter a valid phone number (e.g., 0987654355)");
            return;
        }
        
        setError(null);
        setIsSendingOtp(true);
        
        try {
            // Send the formatted phone number
            await authApi.sendOtp(formattedPhone);
            setShowOtpModal(true);
            toast.success("OTP sent successfully!");
            setCooldown(60); // 60 seconds cooldown
        } catch (error: any) {
            console.error('Send OTP error:', error);
            if (error.response?.status === 429) {
                setError("Too many OTP requests. Please wait a few minutes before trying again.");
                toast.error("Too many attempts. Please wait a moment.");
                setCooldown(120); // 2 minutes cooldown for rate limit
            } else {
                setError(error.response?.data?.error || "Failed to send OTP");
                toast.error("Failed to send OTP");
            }
        } finally {
            setTimeout(() => {
                setIsSendingOtp(false);
            }, 1000);
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
            <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-white/40 text-sm">Your cart is empty</p>
                    <button 
                        onClick={() => router.push('/products')} 
                        className="text-sm  -white/10 px-5 py-2.5 rounded-sm hover:bg-black transition-colors"
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
        <div className="min-h-screen bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white">
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
            <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm z-10">
                <button 
                    onClick={() => router.back()} 
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back
                </button>
                <span className="text-xs tracking-widest uppercase text-gray-400 dark:text-gray-500">Guest Checkout</span>
                <div className="w-12" />
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12">
                    
                    {/* LEFT COLUMN - FORM */}
                    <div className="flex-1 md:w-3/5 space-y-6">
                        {/* Error Display */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-sm">
                                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                            </div>
                        )}

                        {/* Cart Summary Card */}
                        <div className="rounded-sm bg-gray-50 dark:bg-white/5 p-5">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Items in cart:</span>
                                <span className="text-sm text-gray-900 dark:text-white font-medium">{cart.items.length} item(s)</span>
                            </div>
                        </div>

                        {/* Information Form */}
                        <div className="rounded-sm bg-gray-50 dark:bg-white/5 p-6">
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
                                Your Information
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <input
                                        ref={nameRef}
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onKeyDown={(e) => handleKeyDown(e, emailRef as React.RefObject<HTMLElement>)}
                                        placeholder="Full name"
                                        className="w-full px-4 py-3  bg-white dark:bg-black/50 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>
                                
                                <div>
                                    <input
                                        ref={emailRef}
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onKeyDown={(e) => handleKeyDown(e, phoneRef as React.RefObject<HTMLElement>)}
                                        placeholder="Email address"
                                        className="w-full px-4 py-3  bg-white dark:bg-black/50 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>
                                
                                <div>
                                    <div className="flex gap-3">
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
                                                className={`w-full px-4 py-3  bg-white dark:bg-black/50 rounded-sm focus:outline-none focus:ring-1 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                                                    isPhoneVerified 
                                                        ? 'focus:ring-green-500 bg-green-50 dark:bg-green-500/5' 
                                                        : 'focus:ring-gray-400 dark:focus:ring-gray-500'
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

                                <div className="flex gap-5">
                                    <textarea
                                        ref={addressRef}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        onKeyDown={handleTextareaKeyDown}
                                        placeholder="Delivery address"
                                        rows={3}
                                        className="w-full px-4 py-3  bg-white dark:bg-black/50 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                                    />
                                      {/* <CustomSelect 
                                            options={["Cambodia", "Vietnam"]}
                                            placeholder="Select Country"
                                           onChange={(value) => {
                                            setFormData({...formData, address: value});
                                            }}
                                        />
                                        <CustomSelect 
                                            options={["Phnom Penh", "Battambang", "Siem Reap", "Kampot", "Sihanoukville"]}
                                            placeholder="Select Province/City"
                                            onChange={(value) => {
                                            // Handle province change
                                            setFormData({...formData, address: value});
                                            }}
                                        /> */}
                                  </div>
                                
                                <div>
                                    <textarea
                                        ref={noteRef}
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        onKeyDown={handleTextareaKeyDown}
                                        placeholder="Notes (optional)"
                                        rows={3}
                                        className="w-full px-4 py-3  bg-white dark:bg-black/50 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                                    />
                                </div>
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
                    <div className="md:w-2/5 mt-8 md:mt-0">
                        <div className="sticky top-24">
                            <div className="rounded-sm bg-gray-50 dark:bg-white/5 overflow-hidden">
                                <div className="p-5">
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        Order Summary · {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[320px] overflow-y-auto">
                                    {cart.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 p-4">
                                            {item.productImage && (
                                                <div className="w-12 h-12 rounded-sm overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                                                    <img 
                                                        src={item.productImage} 
                                                        alt={item.productName} 
                                                        className="w-full h-full object-cover"
                                                    />
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

                                <div className="p-5 flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={!canPlaceOrder}
                                className={`w-full mt-5 py-4 rounded-sm font-medium text-sm tracking-wide transition-all ${
                                    canPlaceOrder 
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98] cursor-pointer' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border border-gray-600 dark:border-gray-400 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    `Place Order · $${total.toFixed(2)}`
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 flex items-center justify-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 3L3 8L12 13L21 8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 13L3 15L12 20L21 15L19 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 9L3 11L12 16L21 11L19 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Secure checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}