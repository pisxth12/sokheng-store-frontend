"use client";

import { useState, useCallback } from "react";
import BannerForm from "@/components/admin/banners/BannerForm";
import { useBanners } from "@/hooks/admin/useBanners";
import { Banner } from "@/types/banner.type";
import BannerCard from "@/components/admin/banners/BannerCard";
import { useSearch } from "@/hooks/admin/useSearch";
import { Plus, Search, AlertCircle } from "lucide-react";
import AdminLoadingSpinner from "@/components/ui/AdminLoadingSpinner";

export default function BannersPage() {
  const {
    banners,
    saving,
    deleteBanner,
    toggleStatus,
    loading,
    createBanner,
    updateBanner,
  } = useBanners();
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();

  const bannerLimit = banners.length === 5;

  // Handlers
  const handleAdd = useCallback(() => {
    setEditingBanner(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((banner: Banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowForm(false);
    setEditingBanner(null);
  }, []);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
      } else {
        await createBanner(formData);
      }
      handleClose();
    },
    [editingBanner, updateBanner, createBanner, handleClose]
  );

  // Filter
  const filteredBanners = banners.filter((banner) =>
    (banner.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
    <AdminLoadingSpinner message="Loading banners..."/>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Banners</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search banners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          {/* Add Button */}
          <button
            onClick={handleAdd}
            disabled={bannerLimit}
            className={`
              inline-flex items-center justify-center gap-2 px-4 py-2 
              rounded-lg text-sm font-medium transition-all duration-200
              ${bannerLimit 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
              }
            `}
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>
      </div>

      {/* Limit Warning */}
      {bannerLimit && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Maximum limit reached</p>
            <p className="text-sm text-amber-700 mt-0.5">
              You've reached the maximum of 5 banners. Delete some banners to add new ones.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredBanners.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          {searchQuery ? (
            <div>
              <p className="text-gray-600">No banners found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-gray-900 underline hover:no-underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">No banners yet</p>
              <button
                onClick={handleAdd}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first banner
              </button>
            </div>
          )}
        </div>
      )}

      {/* Banners Grid */}
      {filteredBanners.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBanners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={handleEdit}
              onDelete={deleteBanner}
              onToggle={toggleStatus}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <BannerForm
          banners={banners}
          banner={editingBanner ?? undefined}
          onClose={handleClose}
          onSubmit={handleSubmit}
          saving={saving}
        />
      )}
    </div>
  );
}