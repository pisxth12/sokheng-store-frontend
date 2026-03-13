"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { publicPaymentApi } from "@/lib/api/open/payment";
import QRModal from "@/components/checkout/QRModal";

export default function PaymentPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    
    const [qrData, setQrData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('PENDING');
    const [message, setMessage] = useState('');
    const [showQR, setShowQR] = useState(true); 

    useEffect(() => {
        if (orderId) {
            loadQR();
        }
    }, [orderId]);

    const loadQR = async () => {
    try {
        console.log('🔵 Loading QR for order:', orderId);
        
        
        const statusCheck = await publicPaymentApi.getPaymentStatus(orderId);
        
        if (statusCheck.paid) {
            router.push(`/order/${orderId}`);
            return;
        }
        
      
        const qr = await publicPaymentApi.generateQR(orderId);
        setQrData(qr);
        setLoading(false);
        startPaymentVerification(qr.md5);
        
    } catch (err) {
        console.error('❌ Failed to load QR:', err);
        setError('Failed to load payment QR code');
        setLoading(false);
    }
};
    const startPaymentVerification = (md5: string) => {
        const interval = setInterval(async () => {
            try {
                const result = await publicPaymentApi.verifyPayment(orderId, md5);
                
                setPaymentStatus(result.status);
                setMessage(result.message);
                
                if (result.paid) {
                    clearInterval(interval);
                    
                    setShowQR(false);
                    
                    setTimeout(() => {
                        router.push(`/order/${orderId}`);
                    }, 1500);
                }
            } catch (error) {
                console.error('Verification failed:', error);
            }
        }, 3000);

        setTimeout(() => clearInterval(interval), 300000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-purple-600 px-6 py-3 rounded-lg"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'PAID') {
        return (
            <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-green-400 mb-4">Payment Successful!</h1>
                    <p className="text-gray-400 mb-6">Your payment has been confirmed.</p>
                    <p className="text-sm text-gray-500">Redirecting to order page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {showQR && (
                <QRModal
                    isOpen={true}
                    
                    onClose={() => router.push('/orders')}
                    qrString={qrData?.qrString || ''}
                    amount={qrData?.amount || 0}
                    orderNumber={orderId}
                />
            )}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full">
                <p className="text-sm text-white/60">
                    Status: {paymentStatus} • {message || 'Waiting for payment...'}
                </p>
            </div>
        </div>
    );
}