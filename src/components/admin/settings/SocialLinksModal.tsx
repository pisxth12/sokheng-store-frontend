"use client";

import { useSocialLinks } from "@/hooks/admin/useSocialLinks";
import {
  AlertCircle,
  CheckCircle,
  Facebook,
  Map,
  Phone,
  Plane,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SocialLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialLinksModal({ isOpen, onClose }: SocialLinksModalProps) {
  const { links, saving, error, success, updateLinks } = useSocialLinks();
  const [formData, setFormData] = useState({
    facebook: "",
    telegram: "",
    tiktok: "",
    googleMap: "",
    phone: "",
  });

  useEffect(() => {
    if (links) {
      setFormData({
        facebook: links.facebook || "",
        telegram: links.telegram || "",
        tiktok: links.tiktok || "",
        googleMap: links.googleMap || "",
        phone: links.phone || "",
      });
    }
  }, [links]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateLinks(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg w-full max-w-2xl shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="text-lg font-medium text-gray-900">Social Links</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Status Messages */}
          {success && (
            <div className="mx-5 mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-600">Saved successfully</p>
            </div>
          )}
          {error && (
            <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            <div className="flex items-center gap-3 border border-gray-100 rounded-md px-3 py-2">
              <Facebook className="w-4 h-4 text-[#1877f2]" />
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Facebook URL"
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none p-0"
              />
            </div>

            <div className="flex items-center gap-3 border border-gray-100 rounded-md px-3 py-2">
              <Plane className="w-4 h-4 text-[#0088cc]" />
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                placeholder="Telegram URL"
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none p-0"
              />
            </div>

            <div className="flex items-center gap-3 border border-gray-100 rounded-md px-3 py-2">
              <span className="text-sm font-medium text-gray-900 w-4">TT</span>
              <input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleChange}
                placeholder="TikTok URL"
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none p-0"
              />
            </div>

            <div className="flex items-center gap-3 border border-gray-100 rounded-md px-3 py-2">
              <Phone className="w-4 h-4 text-green-600" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none p-0"
              />
            </div>

            <div className="flex items-center gap-3 border border-gray-100 rounded-md px-3 py-2">
              <Map className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                name="googleMap"
                value={formData.googleMap}
                onChange={handleChange}
                placeholder="Google Map URL"
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none p-0"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}