"use client"

import { useState, useEffect, useRef } from 'react';
import { X, Smartphone, Key, RotateCw, CheckCircle, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

const OtpModal = ({ isOpen, onClose, phone, onVerify, onResend }: OtpModalProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [success, setSuccess] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && timer > 0 && !success) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer, success]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setSuccess(false);
      setTimer(60);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode: string) => {
    setLoading(true);
    setError('');
    
    try {
      await onVerify(otpCode);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await onResend();
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      handleVerify(pastedData);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
     <div className="fixed inset-0 z-1000000000000  flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white dark:bg-[#212121] shadow-2xl animate-slideUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verify Phone Number
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          
          {/* Success State */}
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Verified!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Phone number verified successfully
              </p>
            </div>
          ) : (
            <>
              {/* Phone Info */}
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {phone}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                  </p>
                </div>
              )}

              {/* OTP Input */}
              <div 
                className="flex justify-center gap-2 mb-6"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-semibold bg-gray-50 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 rounded"
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Timer & Resend */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${timer > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} rounded-full`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                
                {timer === 0 && (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-sm text-pink-600 dark:text-pink-400 hover:underline font-medium disabled:opacity-50 flex items-center gap-1"
                  >
                    <RotateCw className="w-4 h-4" />
                    Resend Code
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerify(otp.join(''))}
                  disabled={otp.some(d => d === '') || loading}
                  className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-b-2xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Didn't receive the code? Check your phone number or try again later
          </p>
        </div>
      </div>
    </div>
  )


  return createPortal(modalContent, document.body);
};

export default OtpModal;