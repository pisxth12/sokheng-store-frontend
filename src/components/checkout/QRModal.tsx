"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { publicPaymentApi } from "@/lib/open/payment";
import "./QRModal.css"
import { on } from "events";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrString: string;
  amount: number;
  orderNumber: string;
  merchantName?: string;
}

const QRModal = ({
  isOpen,
  onClose,
  qrString,
  amount,
  orderNumber,
  merchantName = "Vannesa Baby Shop",
}: QRModalProps) => {
  const router = useRouter();
  const [status, setStatus] = useState<"PENDING" | "PAID" | "EXPIRED" | "FAILED">("PENDING");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(120);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);


  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  

   useEffect(() => {
    if (!isOpen || status !== "PENDING") return;
    
    setCountdown(120);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto-expire when countdown reaches 0
          if (status === "PENDING") {
            setStatus("EXPIRED");
            stopPolling();
          }
          stopCountdown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => stopCountdown();
  }, [isOpen, status]);

  useEffect(() => {
    if (!isOpen || !orderNumber) {
      stopPolling();
      return;
    }
    setStatus("PENDING");
    intervalRef.current = setInterval(async () => {
      try {
        const res = await publicPaymentApi.getPaymentStatus(orderNumber);
        setStatus(res.status);
        if (res.status === "PAID") {
          stopPolling();
          setTimeout(() => {
            onClose();
            router.push(`/order-details?orderID=${orderNumber}`);
          }, 1000);
        }
        if (res.status === "EXPIRED" || res.status === "FAILED") {
          stopPolling();
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 12000);
    return () => stopPolling();
  }, [isOpen, orderNumber, onClose, router]);

  if (!isOpen) return null;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return (
    <>

      <div
        className="qr-overlay"
        onClick={() => { stopPolling(); onClose(); }}
      >
        <div className="qr-card" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="qr-header">
            <img src="/khqr_logo1.jpg" alt="KHQR" />
          </div>

          {/* Merchant + Amount */}
          <div className="qr-info">
            <p className="qr-merchant">{merchantName}</p>
            <p className="qr-amount">{formattedAmount}</p>
            {/* <p className="bg-red-200">{countdown}</p> */}
          </div>

          {/* Tear divider */}
          <div className="qr-divider">
            <hr className="qr-dashed" />
          </div>

          {/* QR + status */}
          <div className="qr-body py-6 my-3 ">

            {!qrString ? (
              <div className="qr-placeholder">
                <div className="qr-spinner" />
              </div>
            ) : status === "PAID" ? (
              <div className="qr-paid">
                <div className="qr-paid-check">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="qr-paid-label">Payment Received</span>
              </div>
            ) : (
              <div className="qr-frame">
                <QRCodeCanvas
                  value={qrString}
                  size={220}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#111111"
                  includeMargin={false}
                />
                <div className="qr-logo-overlay">
                  <img src="/khqr.png" alt="KHQR" />
                </div>
              </div>
            )}
            {(status === "EXPIRED" || status === "FAILED") && (
              <div className={`qr-status expired`}>
                <span className="qr-pulse" />
                {status === "EXPIRED" ? "QR Expired" : "Payment Failed"}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default QRModal;