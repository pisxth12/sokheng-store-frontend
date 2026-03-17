"use client"
import EditProfileModal from "@/components/open/accounts/EditProfile";
import LanguageToggle from "@/components/ui/LanguageToggle";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/open/useAuth";
import { useOrders } from "@/hooks/open/useOrders";
import { useWishlist } from "@/hooks/open/useWishlist";
import { UpdateProfileRequest } from "@/types/open/auth.type";
import { User, Settings, Package, Heart, MapPin, CreditCard, LogOut, Edit, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AccountPage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { user, updateProfile, logout, loading: authLoading  } = useAuth();
    const { count: wishlistCount } = useWishlist();
    const {  totalElements: orderCount} = useOrders();
    const {  } = useOrders();
   const router = useRouter();
   const t = useTranslations('Account')


   if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

   

    const handleSaveProfile = async (data: UpdateProfileRequest) => {
        try {
          await updateProfile({
            name: data.name,
            phone: data.phone,
            address: data.address,
          });
          setIsEditModalOpen(false);
        } catch (error) {
          toast.error('Failed to update profile');
          console.error('Update failed:', error);
        }
    }

    const handleLogout = () => {
        if(!confirm('Are you sure you want to logout?')) return;
        logout();
    }

      


    return (
        <>
            <div className="min-h-screen  py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold  dark:text-white">
                        {t('page.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                       {t('page.subtitle')}
                    </p>
                </div>

                {/* Main Content - Stack on mobile, side by side on desktop */}
                <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Left Column - Account Overview */}
                    <div className="flex-1 space-y-6">
                        {/* Profile Card */}
                        <div className=" rounded-md shadow-sm border  dark:bg-darkbg border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center">
                                        <User className="w-6 " />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold  dark:text-white">
                                           {user?.name}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="text-sm hover:underline cursor-pointer">
                                    <Edit/>  
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-slate-100/5 rounded-xl">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('profile.orders')}</p>
                                    <p className="text-2xl font-bold  dark:text-white">{orderCount}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-slate-100/5 rounded-xl">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('profile.wishlist')}</p>
                                    <p className="text-2xl font-bold  dark:text-white">{wishlistCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                            <div className="bg-white dark:bg-darkbg rounded-md shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="font-semibold dark:text-white mb-4">
                                    {t('profile.quickActions')} {/* ← "Quick Actions" */}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: Package, label: t('quickActions.myOrders'), href: '/account/orders' },
                                        { icon: Heart, label: t('quickActions.wishlist'), href: '/wishlist' },
                                        { icon: MapPin, label: t('quickActions.addresses'), href: '/account/addresses' },
                                        { icon: CreditCard, label: t('quickActions.paymentMethods'), href: '/account/payments' },
                                    ].map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition group"
                                        >
                                            <item.icon className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                    </div>

                    {/* Right Column - Settings */}
                    <div className="md:w-80 space-y-6">
                        <div className="bg-white dark:bg-darkbg rounded-md shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Settings className="w-5 h-5 text-gray-400" />
                                <h2 className="text-lg font-semibold  dark:text-white">
                                   {t('settings.title')}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-darkbg rounded-xl">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {t('settings.darkMode')}
                                    </span>
                                    <ThemeToggle />
                                </div>

                                {/* Notification Settings */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-darkbg rounded-xl">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {t('settings.emailNotifications')}
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-500 transition"></div>
                                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                                    </label>
                                </div>

                                {/* Language Selector */}
                                <div className="p-3 bg-gray-50 dark:bg-darkbg rounded-xl">
                                    <LanguageToggle/>
                                </div>

                                {/* Logout Button */}
                                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 mt-4 bg-gray-200 dark:bg-black  rounded-sm transition">
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium">{t('settings.logout')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-gray-50 dark:bg-darkbg shadow-sm border border-gray-200 dark:border-gray-800 rounded-md p-6 ">
                            <h3 className="font-semibold mb-2">{t('help.title')}</h3>
                            <p className="text-sm  mb-4">
                                {t('help.description')}
                            </p>
                            <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 text-sm font-medium transition">
                                {t('help.button')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <EditProfileModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onSave={handleSaveProfile}
      
    />
        </>
    );
}