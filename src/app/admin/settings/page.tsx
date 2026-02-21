"use client";

import { useSocialLinks } from "@/hooks/admin/useSocialLinks";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Facebook,
  Instagram,
  Loader2,
  Map,
  Phone,
  Plane,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SocialLinksPage() {
  const { links, saving, error, success, updateLinks } = useSocialLinks();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
  }, [links]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateLinks(formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Simple Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl font-medium text-gray-900">Social Links</h1>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-600">Saved successfully</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Simple Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        <div className="bg-white border border-gray-200 rounded-md p-5">
          <h2 className="text-base font-medium text-gray-900 mb-4">Edit</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Facebook */}
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

            {/* Telegram */}
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

            {/* TikTok */}
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

            {/* Phone */}
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

            {/* Google Map */}
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

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full mt-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Current Values */}
        <div className="bg-white border border-gray-200 rounded-md p-5">
          <h2 className="text-base font-medium text-gray-900 mb-4">Current</h2>

          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Facebook</span>
              <span className="text-sm text-gray-900 truncate max-w-[200px]">
                {links?.facebook || "—"}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Telegram</span>
              <span className="text-sm text-gray-900 truncate max-w-[200px]">
                {links?.telegram || "—"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">TikTok</span>
              <span className="text-sm text-gray-900 truncate max-w-[200px]">
                {links?.tiktok || "—"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-sm text-gray-900 truncate max-w-[200px]">
                {links?.phone || "—"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Google Map</span>
              <span className="text-sm text-gray-900 truncate max-w-[200px]">
                {links?.googleMap || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
