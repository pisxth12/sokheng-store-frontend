// app/account/AccountClient.tsx
'use client';

import { useState } from 'react';
import { User, Settings, Package, Heart, MapPin, CreditCard, LogOut, Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import EditProfileModal from "@/components/open/accounts/EditProfile";
import { useAuth } from "@/hooks/open/useAuth";
import { UpdateProfileRequest } from "@/types/open/auth.type";
import toast from "react-hot-toast";
import "./account.css";

interface AccountClientProps {
  initialUser: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  } | null;
  initialOrderCount: number;
  initialWishlistCount: number;
}

export default function AccountClient({ 
  initialUser, 
  initialOrderCount, 
  initialWishlistCount 
}: AccountClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderCount] = useState(initialOrderCount);
  const [wishlistCount] = useState(initialWishlistCount);
  const [user, setUser] = useState(initialUser);
  
  const { updateProfile, logout } = useAuth();
  const t = useTranslations('Account');

  const handleSaveProfile = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile({ name: data.name, phone: data.phone, address: data.address });
      setUser(prev => ({ ...prev!, ...data }));
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update failed:', error);
    }
  };

  const handleLogout = () => {
    if (!confirm('Are you sure you want to logout?')) return;
    logout();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="account-header mb-8">
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
            {t('page.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('page.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Left Column */}
          <div className="account-left flex-1 space-y-6">

            {/* Profile Card */}
            <div className="account-card rounded-md shadow-sm border dark:bg-darkbg border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="account-avatar w-12 h-12 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center">
                    <User className="w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold dark:text-white">{user.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="account-edit-btn text-sm cursor-pointer"
                >
                  <Edit />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="account-stat p-4 bg-gray-50 dark:bg-slate-100/5 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('profile.orders')}</p>
                  <p className="account-stat-value text-2xl font-bold dark:text-white">{orderCount}</p>
                </div>
                <div className="account-stat p-4 bg-gray-50 dark:bg-slate-100/5 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('profile.wishlist')}</p>
                  <p className="account-stat-value text-2xl font-bold dark:text-white">{wishlistCount}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="account-card bg-white dark:bg-darkbg rounded-md shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-semibold dark:text-white mb-4">{t('profile.quickActions')}</h3>
              <div className="space-y-1">
                {[
                  { icon: Package,    label: t('quickActions.myOrders'), href: '/account/orders' },
                  { icon: Heart,      label: t('quickActions.wishlist'),  href: '/wishlist' },
                  { icon: MapPin,     label: t('quickActions.addresses'), href: '/account/addresses' },
                  { icon: CreditCard, label: 'Find Your Order',           href: '/track-order' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="account-nav-link flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-black/50 rounded-xl transition group"
                  >
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="account-right md:w-80 space-y-6">

            {/* Settings */}
            <div className="account-card bg-white dark:bg-darkbg rounded-md shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold dark:text-white">{t('settings.title')}</h2>
              </div>

              <div className="space-y-3">
                <div className="account-setting-row flex items-center justify-between p-3 bg-gray-50 dark:bg-darkbg rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings.darkMode')}</span>
                  <ThemeToggle />
                </div>

                <div className="account-setting-row flex items-center justify-between p-3 bg-gray-50 dark:bg-darkbg rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings.emailNotifications')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="account-toggle-track w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-500 transition"></div>
                    <div className="account-toggle-thumb absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="account-setting-row p-3 bg-gray-50 dark:bg-darkbg rounded-xl">
                  <LanguageToggle />
                </div>

                <button
                  onClick={handleLogout}
                  className="account-logout-btn w-full flex items-center justify-center gap-2 p-3 mt-4 bg-gray-200 dark:bg-black rounded-sm transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('settings.logout')}</span>
                </button>
              </div>
            </div>

            {/* Help Card */}
            <div className="account-card bg-gray-50 dark:bg-darkbg shadow-sm border border-gray-200 dark:border-gray-800 rounded-md p-6">
              <h3 className="font-semibold mb-2">{t('help.title')}</h3>
              <p className="text-sm mb-4">{t('help.description')}</p>
              <button className="account-help-btn w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 text-sm font-medium transition">
                {t('help.button')}
              </button>
            </div>

          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={{ name: user.name, phone: user.phone, address: user.address }}
      />
    </div>
  );
}