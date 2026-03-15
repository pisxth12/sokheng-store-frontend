"use client";

import { useState, useEffect } from "react";
import { authApi } from "@/lib/open/auth";
import { useSocialLinks } from "@/hooks/admin/useSocialLinks";
import {
  Loader2,
  Globe,
  Lock,
  User,
  Edit2,
  Facebook,
  Plane,
  Map,
  Phone,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SocialLinksModal from "@/components/admin/settings/SocialLinksModal";
import ChangePasswordModal from "@/components/admin/settings/ChangePasswordModal";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Modal states
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Social Links data
  const { links } = useSocialLinks();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account settings
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Social Links Card */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-700" />
                  <h2 className="font-medium text-gray-900">Social Links</h2>
                </div>
                <button
                  onClick={() => setSocialModalOpen(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Facebook className="w-4 h-4 text-[#1877f2]" />
                  <span className="text-gray-600 flex-1">Facebook</span>
                  <span className="text-gray-900 truncate max-w-[150px]">
                    {links?.facebook || "Not set"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Plane className="w-4 h-4 text-[#0088cc]" />
                  <span className="text-gray-600 flex-1">Telegram</span>
                  <span className="text-gray-900 truncate max-w-[150px]">
                    {links?.telegram || "Not set"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-sm font-medium text-gray-900">
                    TT
                  </span>
                  <span className="text-gray-600 flex-1">TikTok</span>
                  <span className="text-gray-900 truncate max-w-[150px]">
                    {links?.tiktok || "Not set"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600 flex-1">Phone</span>
                  <span className="text-gray-900 truncate max-w-[150px]">
                    {links?.phone || "Not set"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Map className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600 flex-1">Google Map</span>
                  <span className="text-gray-900 truncate max-w-[150px]">
                    {links?.googleMap || "Not set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Password Card */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-700" />
                  <h2 className="font-medium text-gray-900">Password</h2>
                </div>
                <button
                  onClick={() => setPasswordModalOpen(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">
                  Password last changed
                </p>
                <p className="text-sm text-gray-900">••••••••</p>
                <p className="text-xs text-gray-400 mt-2">
                  Click edit to change your password
                </p>
              </div>
            </div>

            {/* User Info Card - Full Width */}
            {user && (
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    Account Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Name</span>
                    <span className="text-gray-900 font-medium">
                      {user.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Email</span>
                    <span className="text-gray-900 font-medium">
                      {user.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Role</span>
                    <span className="text-gray-900 font-medium">
                      {user.role || "User"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SocialLinksModal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
      />

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}
