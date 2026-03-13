"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { publicPaymentApi } from "@/lib/api/open/payment";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrString: string;
  amount: number;
  orderNumber: string; 
}

const QRModal = ({ isOpen, onClose, qrString, amount, orderNumber }: QRModalProps) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED'>('PENDING');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  
  useEffect(() => {
    if (!isOpen || !orderNumber) return;

    setStatus('PENDING');

    intervalRef.current = setInterval(async () => {
      try {
        const res = await publicPaymentApi.getPaymentStatus(orderNumber);
        console.log('Poll result:', res);
        setStatus(res.status);

        if (res.status === 'PAID') {
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            onClose();
            router.push(`/orders/${orderNumber}`);
          }, 1000); // brief delay so user sees the 
        }

        if (res.status === 'EXPIRED' || res.status === 'FAILED') {
          clearInterval(intervalRef.current!);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(intervalRef.current!);
  }, [isOpen, orderNumber]);

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}`;

  const statusConfig = {
    PENDING:  { text: 'Waiting for payment...', color: 'text-white/40',   spin: true  },
    PAID:     { text: 'Payment confirmed! ✓',   color: 'text-emerald-400', spin: false },
    EXPIRED:  { text: 'QR code expired',        color: 'text-red-400',     spin: false },
    FAILED:   { text: 'Payment failed',         color: 'text-red-400',     spin: false },
  }[status];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        .qr-modal * { font-family: 'DM Sans', sans-serif; }
        .qr-mono { font-family: 'DM Mono', monospace; }
        .qr-backdrop { animation: fadeIn 0.15s ease; }
        .qr-sheet { animation: slideUp 0.2s ease; }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      <div
        className="qr-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <div
          className="qr-modal qr-sheet w-full sm:max-w-sm bg-[#0e0e0e] border border-white/8 rounded-t-3xl sm:rounded-2xl p-6 mx-0 sm:mx-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-8 h-1 bg-white/10 rounded-full mx-auto mb-6 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] qr-mono text-white/30 uppercase tracking-widest mb-0.5">Scan to Pay</p>
              <p className="qr-mono text-xl font-medium text-white">${amount.toFixed(2)}</p>
              
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* QR */}
          <div className={` py-10 rounded-2xl flex items-center justify-center mb-4 transition-all ${status === 'PAID' ? 'bg-emerald-50' : 'bg-white'}`}>
            {!qrString ? (
              <div className="w-[220px] h-[220px] flex items-center justify-center">
                <div className="w-6 h-6 border border-black/20 border-t-black rounded-full animate-spin" />
              </div>
            ) : status === 'PAID' ? (
              <div className="w-[220px] h-[220px] flex items-center justify-center">
                <div className="text-5xl">✓</div>
              </div>
            ) : !imageError ? (
              <img src={qrImageUrl} alt="QR Code" className="w-[220px] h-[220px]" onError={() => setImageError(true)} />
            ) : (
              <div className="w-[220px] h-[220px] flex items-center justify-center text-sm text-red-400">Failed to load QR</div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {statusConfig.spin && (
              <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin flex-shrink-0" />
            )}
            <p className={`text-xs ${statusConfig.color}`}>{statusConfig.text}</p>
          </div>

          <button
            onClick={onClose}
            disabled={status === 'PAID'}
            className="w-full py-3.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default QRModal;