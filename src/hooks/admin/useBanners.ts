import { adminBannerApi } from "@/lib/api/admin/banners";
import { Banner } from "@/types/banner.type";
import { useEffect, useState } from "react";

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminBannerApi.getAll();
      setBanners(data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch banners";
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async (data: FormData) => {
    setError(null);
    setSaving(true);
    setSuccess(false);
    try {
      await adminBannerApi.create(data);
       await fetchBanners();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
         err.response?.data ||
        "Failed to create banner";
      setError(errorMessage);
      console.error("Create error:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateBanner = async (id: number, data: FormData) => {
    setError(null);
    setSaving(true);
    setSuccess(false);
    try {
      await adminBannerApi.update(id, data);
      await fetchBanners();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
    
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteBanner = async (id: number) => {
    setError(null);
    setSaving(true);
    setSuccess(false);
    try {
      await adminBannerApi.delete(id);
       await fetchBanners();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete banner";
      setError(errorMessage);
      console.error("Delete error:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: number) => {
    setError(null);
    setSaving(true);
    setSuccess(false);
    try {
      await adminBannerApi.toggleStatus(id);
      await fetchBanners();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to toggle banner status";
      setError(errorMessage);
      console.error("Toggle error:", err);
    } finally {
      setSaving(false);
    }
  };

  const reorderBanners = async (ids: number[]) => {
    setError(null);
    setSaving(true);
    setSuccess(false);
    try {
      await adminBannerApi.reorder(ids);
      await fetchBanners();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to reorder banners";
      setError(errorMessage);
      console.error("Reorder error:", err);
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    saving,
    loading,
    error,
    success,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleStatus,
    reorderBanners,
    refresh: fetchBanners,
  };
};
