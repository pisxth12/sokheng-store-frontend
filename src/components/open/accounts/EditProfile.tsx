"use client"

import { useState, useEffect, useCallback } from 'react';
import { X, User, Phone, MapPin, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { UpdateProfileRequest } from '@/types/open/auth.type';
import { useTranslations } from 'next-intl';
import OtpModal from './OtpModal';
import { authApi } from '@/lib/open/auth';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateProfileRequest) => Promise<void>;
  initialData: UpdateProfileRequest
}

const EditProfileModal = ({ isOpen, onClose, onSave, initialData}: EditProfileModalProps) => {
  const t = useTranslations('EditProfile'); 
  

  const [formData, setFormData] = useState<UpdateProfileRequest>({
   name: initialData?.name ||'',
    phone:  initialData?.phone ||'',
    address:  initialData?.address ||'',
  });

  

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);


  // Memoized change handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Track phone changes
    if (name === 'phone') {
      setPhoneChanged(true);
      setIsPhoneVerified(false);
    }
  }, []);

  // Handle verify button click
  const handleVerifyClick = useCallback(async () => {
    try {
     let phoneToVerify = formData.phone || '';
    if (!phoneToVerify.startsWith('+')) {
      if (phoneToVerify.startsWith('0')) {
        phoneToVerify = '+855' + phoneToVerify.substring(1);
      } else {
        phoneToVerify = '+855' + phoneToVerify;
      }
    }
    
    await authApi.sendOtp(phoneToVerify);
    setNewPhone(phoneToVerify);
    setShowOtpModal(true);
    toast.success("Verification code sent!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  }, [formData.phone]);

  // Handle OTP verification
  const handleVerifyOtp = useCallback(async (otp: string) => {
    try {
      await authApi.verifyOtp(newPhone, otp);
      setIsPhoneVerified(true);
      setShowOtpModal(false);
      toast.success("Phone verified successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      throw error;
    }
  }, [newPhone]);

  // Handle OTP resend
  const handleResendOtp = useCallback(async () => {
    await authApi.sendOtp(newPhone);
  }, [newPhone]);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if phone was changed but not verified
    if (phoneChanged && !isPhoneVerified) {
      toast.error("Please verify your new phone number first");
      return;
    }
    
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }, [formData, onSave, onClose, phoneChanged, isPhoneVerified]);

  // Memoized close handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        {/* Modal Container */}
        <div className="w-full max-w-md bg-white dark:bg-darkbg shadow-2xl animate-slideUp">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('title')} 
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 text-gray-400" />
                {t('fields.fullName')} 
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-black dark:border-white text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition"
                placeholder={t('fields.fullNamePlaceholder')} 
                required
              />
            </div>

            {/* Phone Field with Verification */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Phone className="w-4 h-4 text-gray-400" />
                {t('fields.phoneNumber')} 
              </label>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-black dark:border-white text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 pr-10"
                    placeholder={t('fields.phonePlaceholder')}
                  />
                  {isPhoneVerified && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                
                {/* Show Verify button if phone changed and not verified */}
                {phoneChanged && !isPhoneVerified && (
                  <button
                    type="button"
                    onClick={handleVerifyClick}
                    disabled={otpLoading}
                    className="px-4 py-2.5 bg-black text-white hover:bg-gray-800 transition font-medium whitespace-nowrap disabled:opacity-50"
                  >
                    {otpLoading ? "Sending..." : "Verify"}
                  </button>
                )}
              </div>
              
              {/* Warning message */}
              {phoneChanged && !isPhoneVerified && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  You need to verify your new phone number before saving
                </p>
              )}
              
              {/* Success message */}
              {isPhoneVerified && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Phone verified successfully
                </p>
              )}
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4 text-gray-400" />
                {t('fields.address')}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-black dark:border-white text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition"
                placeholder={t('fields.addressPlaceholder')}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
              >
                {t('buttons.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || (phoneChanged && !isPhoneVerified)}
                className="flex-1 px-4 py-2.5 dark:bg-zinc-950 cursor-pointer bg-zinc-950 text-white transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('buttons.saving')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('buttons.save')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <OtpModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          phone={newPhone}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
        />
      )}
    </>
  );
};

export default EditProfileModal;