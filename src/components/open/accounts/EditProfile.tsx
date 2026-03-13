"use client"

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/open/useAuth';
import { UpdateProfileRequest } from '@/types/open/auth.type';
import { useTranslations } from 'next-intl'; 

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateProfileRequest) => Promise<void>;
}

const EditProfileModal = ({ isOpen, onClose, onSave }: EditProfileModalProps) => {
  const t = useTranslations('EditProfile'); 
  const { user } = useAuth();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',

  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white dark:bg-darkbg  shadow-2xl animate-slideUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('title')} 
          </h2>
          <button
            onClick={onClose}
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
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-black dark:border-white  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition"
              placeholder={t('fields.fullNamePlaceholder')} 
              required
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Phone className="w-4 h-4 text-gray-400" />
              {t('fields.phoneNumber')} 
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-black dark:border-white  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition"
              placeholder={t('fields.phonePlaceholder')} 
            />
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
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-black dark:border-white  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition"
              placeholder={t('fields.addressPlaceholder')}
              
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300  hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
            >
              {t('buttons.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 dark:bg-zinc-950 cursor-pointer bg-zinc-950 text-white  transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
  );
};

export default EditProfileModal;