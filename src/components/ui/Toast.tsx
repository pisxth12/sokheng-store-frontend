// components/ui/Toast.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';

interface ToastProps {
  id: string;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
  onClose: (id: string) => void;
}

export function Toast({ id, product, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    const timer = setTimeout(() => handleClose(), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif", width: '20rem' }}
      className={`transform mt-12 transition-all duration-300 ease-out ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-[#111110] border border-[#e8e8e4] dark:border-[#2a2a27] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

        {/* ── Header ── */}
      

        {/* ── Product row ── */}
        <div className="p-4 flex gap-3">
          {/* Image */}
          <div className="w-14 h-[4.5rem] flex-shrink-0 overflow-hidden bg-[#f7f7f5] dark:bg-[#1a1a18]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={16} strokeWidth={1} className="text-[#c8c8c4] dark:text-[#3a3a37]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <p
              className="text-sm text-[#111110] dark:text-[#f5f5f3] line-clamp-2 leading-snug"
              style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, letterSpacing: '-0.01em' }}
            >
              {product.name}
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-[#111110] dark:text-[#f5f5f3]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[0.68rem] tracking-[0.06em] text-[#a3a39f] dark:text-[#5a5a57]">
                Qty {product.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          <Link
            href="/cart"
            onClick={handleClose}
            className="flex items-center justify-center gap-1.5 h-9 text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[#6b6b67] dark:text-[#9a9a96] bg-[#f7f7f5] dark:bg-[#1a1a18] border border-[#e8e8e4] dark:border-[#2a2a27] hover:border-[#111110] dark:hover:border-[#f5f5f3] hover:text-[#111110] dark:hover:text-[#f5f5f3] transition-all"
          >
            <ShoppingBag size={12} strokeWidth={1.5} />
            View cart
          </Link>
          <Link
            href="/checkout"
            onClick={handleClose}
            className="flex items-center justify-center gap-1.5 h-9 text-[0.68rem] font-medium tracking-[0.1em] uppercase text-white dark:text-[#111110] bg-[#111110] dark:bg-[#f5f5f3] hover:opacity-80 transition-opacity"
          >
            Checkout
            <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>

        {/* ── Progress bar ── */}
        <div className="h-px bg-[#e8e8e4] dark:bg-[#2a2a27]">
          <div
            className="h-full bg-[#111110] dark:bg-[#f5f5f3] origin-left"
            style={{ animation: 'toast-shrink 5s linear forwards' }}
          />
        </div>

      </div>

      <style>{`
        @keyframes toast-shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}