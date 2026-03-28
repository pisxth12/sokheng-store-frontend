"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { publicPaymentApi } from "@/lib/open/payment";
import QRModal from "@/components/checkout/QRModal";
import { publicOrderApi } from "@/lib/open/order";
import { QRData, PaymentStatusResponse } from "@/types/open/payment.type";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Order } from "@/types/open/order.type";
import { ArrowLeft, QrCode, X, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface OrderClientProps {
  initialOrder: Order | null;
  orderNumber: string;
}

export default function OrderClientPage({ initialOrder, orderNumber }: OrderClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const verificationAttemptsRef = useRef(0);
  const MAX_VERIFICATION_ATTEMPTS = 60;

  useEffect(() => {
    if (initialOrder?.status === "COMPLETED") setPaymentCompleted(true);
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [orderNumber]);

  const startPaymentVerification = (md5: string) => {
    setIsVerifying(true);
    setVerificationStatus("Waiting for payment...");
    verificationAttemptsRef.current = 0;
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        verificationAttemptsRef.current++;
        const status = await publicPaymentApi.verifyPayment(orderNumber, md5);
        setVerificationStatus(status.message);
        if (status.paid) handlePaymentSuccess(status);
        else if (verificationAttemptsRef.current >= MAX_VERIFICATION_ATTEMPTS) handleVerificationTimeout();
        else if (status.status === "EXPIRED") handleExpiredQR();
      } catch (error) {
        console.error("Verification error:", error);
      }
    }, 3000);
  };

  const handlePaymentSuccess = async (status: PaymentStatusResponse) => {
    if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = undefined; }
    setIsVerifying(false);
    setPaymentCompleted(true);
    setVerificationStatus("Payment successful!");
    setTimeout(() => { setShowQRModal(false); window.location.reload(); }, 3000);
  };

  const handleVerificationTimeout = () => {
    if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = undefined; }
    setIsVerifying(false);
    setVerificationStatus("Payment timeout. Please try again.");
    setShowQRModal(false);
  };

  const handleExpiredQR = () => {
    if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = undefined; }
    setIsVerifying(false);
    setVerificationStatus("QR code expired. Please generate a new one.");
    setShowQRModal(false);
  };

  const handleCloseQRModal = () => {
    if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = undefined; }
    setIsVerifying(false);
    setShowQRModal(false);
  };

  const handleCancelClick = (orderNumber: string) => {
    setSelectedOrder(orderNumber);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = useCallback(async () => {
    if (!selectedOrder) return;
    try {
      await publicOrderApi.cancelOrder(selectedOrder);
      toast.success("Order cancelled successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  }, [selectedOrder]);

  const handlePayWithQR = async () => {
    try {
      setVerificationStatus("Generating QR code...");
      const qr = await publicPaymentApi.generateQR(orderNumber);
      setQrData(qr);
      setShowQRModal(true);
      startPaymentVerification(qr.md5);
    } catch (error: any) {
      console.error("Failed to generate QR:", error);
      setVerificationStatus("Failed to generate QR code");
      toast.error(error.response?.data?.message || error.message || "Failed to generate QR code");
    }
  };

  useEffect(() => {
    if (!showQRModal) return;
    const timer = setTimeout(() => {
      if (showQRModal && !paymentCompleted) {
        setShowQRModal(false);
        setIsVerifying(false);
        setVerificationStatus("QR code expired");
        toast.error("QR code expired. Please try again.");
        if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = undefined; }
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [showQRModal, paymentCompleted]);

  const isPending = order?.status === "PENDING";
  const isCancelled = order?.status === "CANCELLED";
  const isCompleted = order?.status === "COMPLETED" || paymentCompleted;

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0e] flex items-center justify-center">
        <div className="w-7 h-7 border border-[#e8e8e4] dark:border-[#2a2a27] border-t-[#111110] dark:border-t-[#f5f5f3] rounded-full animate-spin" />
      </div>
    );

  if (error || !order)
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0e] flex items-center justify-center od-page-enter">
        <div className="text-center space-y-4">
          <p className="text-sm text-[#a3a39f] dark:text-[#5a5a57]">Order not found</p>
          <button
            onClick={() => router.push("/")}
            className="text-xs border border-[#e8e8e4] dark:border-[#2a2a27] text-[#6b6b67] dark:text-[#9a9a96] px-5 py-2.5 rounded-xl hover:border-[#a3a39f] dark:hover:border-[#5a5a57] transition-colors font-mono tracking-wider uppercase"
          >
            Go Home
          </button>
        </div>
      </div>
    );

  const statusClass = isCompleted
    ? "od-status od-status-completed"
    : isPending
    ? "od-status od-status-pending"
    : "od-status od-status-cancelled";

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0f0f0e] od-page-enter">

        {/* Top bar */}
        <div className="co-topbar">
          <button onClick={() => router.back()} className="co-back-btn">
            <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
            Back
          </button>
          <div className="co-steps hidden sm:flex">
            <div className="co-step done"><span className="co-step-num">✓</span>Cart</div>
            <div className="co-step-divider" />
            <div className="co-step done"><span className="co-step-num">✓</span>Review</div>
            <div className="co-step-divider" />
            <div className="co-step active"><span className="co-step-num">3</span>Confirm</div>
          </div>
          <span className="co-topbar-title">Order Details</span>
        </div>

        {/* Two-column layout - Items LEFT, Summary RIGHT */}
        <div className="od-layout">

          {/* LEFT COLUMN: Items Grid (BIG) */}
          <div className="od-col-left od-section" style={{ animationDelay: "0.12s" }}>
            <div className="od-panel">
              <div className="flex items-center  justify-between px-5 pt-5 pb-4 ">
                <span className="od-label">Items · {order?.items?.length || 0}</span>
              </div>

              <div className="od-item-grid">
                {order?.items?.map((item, idx) => (
                  <div
                    key={item.id}
                    className="od-item-card"
                    style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
                  >
                    {item.productImage && (
                      <Link href={`/${item.categorySlug}/${item.productName}`} className="od-item-img-wrap">
                        <img src={item.productImage} alt={item.productName} />
                      </Link>
                    )}
                    <div className="od-item-body">
                      <p className="od-item-name">{item.productName}</p>
                      <p className="od-item-meta">${item.unitPrice} × {item.quantity}</p>
                      <p className="od-item-price">${item.subtotal?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary + Actions (SMALL) */}
          <div className="od-col-right od-section sticky top-20" style={{ animationDelay: "0.05s" }}>
            <div className="od-left-hero">
              <div className="od-left-meta">
                <span className={statusClass}>
                  <span className="od-status-dot" />
                  {order?.status}
                </span>
                <span className="od-order-tag">#{orderNumber}</span>
              </div>
              <p className="od-placed-date">
                Placed {new Date(order?.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div className="od-divider" />

            <span className="od-col-label">Order Total</span>

            <div className="od-totals-card">
              <div className="od-total-row">
                <span>Subtotal</span>
                <span className="od-mono-sm">${(order?.totalAmount ? order.totalAmount - order.totalAmount * 0.1 : 0).toFixed(2)}</span>
              </div>
              <div className="od-total-row">
                <span>Delivery</span>
                <span className="text-emerald-500 dark:text-emerald-400 text-xs font-mono">FREE</span>
              </div>
              <div className="od-total-row">
                <span>Taxes (10%)</span>
                <span className="od-mono-sm">${(order?.totalAmount ? order.totalAmount * 0.1 : 0).toFixed(2)}</span>
              </div>
              <div className="od-total-row od-total-grand">
                <span>Total</span>
                <span className="font-mono">${order?.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              {isVerifying && !showQRModal && (
                <div className="od-verifying">
                  <div className="w-3.5 h-3.5 border border-[#e8e8e4] dark:border-[#2a2a27] border-t-[#a3a39f] dark:border-t-[#5a5a57] rounded-full animate-spin shrink-0" />
                  {verificationStatus}
                </div>
              )}

              {isPending && !paymentCompleted && (
                <button onClick={handlePayWithQR} disabled={isVerifying} className="od-pay-btn">
                  {isVerifying ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-white/30 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <QrCode className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Pay ${order?.totalAmount?.toFixed(2)} with QR
                    </>
                  )}
                </button>
              )}

              {!isVerifying && !showQRModal && !isCancelled && !isCompleted && (
                <button onClick={() => handleCancelClick(order.orderNumber)} className="od-cancel-btn">
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Cancel Order
                </button>
              )}

              {isCancelled && (
                <div className="od-banner od-banner-cancelled">
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                  This order has been cancelled
                </div>
              )}

              {isCompleted && (
                <div className="od-banner od-banner-completed">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                  Payment confirmed
                </div>
              )}
            </div>

            <div className="od-guarantee">
              <ShieldCheck className="w-3 h-3" strokeWidth={1.5} />
              Secure checkout
              <span className="od-guarantee-dot" />
              SSL encrypted
              <span className="od-guarantee-dot" />
              256-bit
            </div>
          </div>

        </div>
      </div>

      <QRModal
        isOpen={showQRModal}
        onClose={handleCloseQRModal}
        qrString={qrData?.qrString || ""}
        amount={qrData?.amount || 0}
        orderNumber={orderNumber}
      />

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
    </>
  );
}