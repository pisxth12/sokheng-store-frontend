"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { publicPaymentApi } from "@/lib/open/payment";
import QRModal from "@/components/checkout/QRModal";
import { publicOrderApi } from "@/lib/open/order";
import { Order } from "@/types/admin/order.type";
import { QRData, PaymentStatusResponse } from "@/types/open/payment.type";
import Link from "next/link";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);

  //Confirm modal
   const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
   const [showCancelModal, setShowCancelModal] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const verificationAttemptsRef = useRef(0);
  const MAX_VERIFICATION_ATTEMPTS = 60;




  useEffect(() => {
    fetchOrder();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const data = await publicOrderApi.getOrderNumber(orderNumber);
      setOrder(data);
      if (data.status === "COMPLETED") {
        setPaymentCompleted(true);
      }
    } catch (error) {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  const startPaymentVerification = (md5: string) => {
    setIsVerifying(true);
    setVerificationStatus("Waiting for payment...");
    verificationAttemptsRef.current = 0;

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        verificationAttemptsRef.current++;
  
        const status = await publicPaymentApi.verifyPayment(orderNumber, md5);

        setVerificationStatus(status.message);

        if (status.paid) {
          handlePaymentSuccess(status);
        } else if (
          verificationAttemptsRef.current >= MAX_VERIFICATION_ATTEMPTS
        ) {
          handleVerificationTimeout();
        } else if (status.status === "EXPIRED") {
          handleExpiredQR();
        }
      } catch (error) {
        console.error(" Verification error:", error);
      }
    }, 3000);
  };

  const handlePaymentSuccess = async (status: PaymentStatusResponse) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }

    setIsVerifying(false);
    setPaymentCompleted(true);
    setVerificationStatus("Payment successful!");
    setShowQRModal(false);
    await fetchOrder();
  };

  const handleVerificationTimeout = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }
    setIsVerifying(false);
    setVerificationStatus("Payment timeout. Please try again.");
    setShowQRModal(false);
  };

  const handleExpiredQR = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }
    setIsVerifying(false);
    setVerificationStatus("QR code expired. Please generate a new one.");
    setShowQRModal(false);
  };

  const handleCloseQRModal = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }
    setIsVerifying(false);
    setShowQRModal(false);
  };

  const handleCancelClick = (orderNumber: string) => {
    setSelectedOrder(orderNumber);
    setShowCancelModal(true);
  }

  const handleCancelConfirm = useCallback(async () => {
    if (!selectedOrder) return;
      try{
        await publicOrderApi.cancelOrder(selectedOrder);
        toast.success("Cancel order successfully!")
        window.location.reload();
      }catch(error){
        console.error("Failed to to Cancel Order:", error);
      }
  },[selectedOrder]);

  const handlePayWithQR = async () => {
    try {
      setVerificationStatus("Generating QR code...");
      const qr = await publicPaymentApi.generateQR(orderNumber);
      setQrData(qr);
      setShowQRModal(true);

      startPaymentVerification(qr.md5);
    } catch (error) {
      console.error("Failed to generate QR:", error);
      setVerificationStatus("Failed to generate QR code");
    }
  };

  const isPending = order?.status === "PENDING";
  const isCancelled = order?.status === "CANCELLED";
  const isCompleted = order?.status === "COMPLETED" || paymentCompleted;

  if (loading)
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );

  if (error || !order)
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/40 text-sm">Order not found</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );

  const statusColor =
    order?.status === "COMPLETED"
      ? "text-emerald-400"
      : order?.status === "PENDING"
        ? "text-amber-400"
        : "text-white/40";

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <QRModal
        isOpen={showQRModal}
        onClose={handleCloseQRModal}
        qrString={qrData?.qrString || ""}
        amount={qrData?.amount || 0}
        orderNumber={orderNumber}
      />

      {/* Top bar */}
      <div className="border-b border-white/6 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-2"
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
          Home
        </button>
        <span className="mono text-xs text-white/25 tracking-widest uppercase">
          Order
        </span>
        <span className={`mono text-xs ${statusColor}`}>{order?.status}</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-3">
        {/* Order ID */}
        <div className="flex items-center justify-between px-1 pb-1">
          <h1 className="text-lg font-medium">Order Summary</h1>
          <span className="mono text-xs text-white/30">#{orderNumber}</span>
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-white/6 bg-white/2 overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[11px] mono text-white/30 uppercase tracking-widest">
              Items · {order?.items?.length || 0}
            </p>
          </div>

          <div className="divide-y divide-white/4">
            {order?.items?.map((item) => (
              <div
                key={item.id}
                className="item-row flex  items-center gap-4 px-5 py-3.5"
              >
                {item.productImage && (
                  <Link
                    href={`/products/${item.slug}`}
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
                  <p className="text-xs text-white/35 mt-0.5">
                    ${item.unitPrice} × {item.quantity}
                  </p>
                </div>
                <p className="mono text-sm text-white/70 shrink-0">
                  ${item.subtotal?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          {/* Total */}
          <div className="border-t border-white/6 px-5 py-4 flex justify-between items-center">
            <span className="text-sm text-white/40">Total</span>
            <span className="mono font-medium text-white">
              ${order?.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

       <div className="flex justify-between gap-5 ">
            {!isVerifying && !showQRModal && (
              <button
                onClick={()=>handleCancelClick(order.orderNumber)}
                disabled={order.status === "CANCELLED"}
                className={`pay-btn w-full py-4 ${order.status === "CANCELLED" ? "hidden" : "block"} rounded-2xl border border-white/15 text-red-400 font-medium text-sm tracking-wide
                                ${isVerifying ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Cancel order
              </button>
            )}
         {/* Verification Status */}
            {isVerifying && !showQRModal && (
              <div className="text-center py-3">
                <p className="text-sm text-white/40">{verificationStatus}</p>
              </div>
            )}

            {isPending && !paymentCompleted && (
              <button
                onClick={handlePayWithQR}
                disabled={isVerifying}
                className={`pay-btn w-full py-4 rounded-2xl border border-white/15 text-white font-medium text-sm tracking-wide
                                ${isVerifying ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isVerifying
                  ? "Processing..."
                  : `Pay $${order?.totalAmount?.toFixed(2)} with QR`} 
              </button>
            )}

            {isCancelled && (
              <div className="w-full py-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium text-center">
                ✗ This order has been cancelled
              </div>
            )}

            {isCompleted && (
              <div className="w-full py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-medium text-center">
                ✓ Payment confirmed
              </div>
            )}
       </div>
      </div>
        {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
        type="danger"
      />
    </div>
  );
}
