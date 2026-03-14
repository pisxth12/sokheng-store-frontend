"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useBrand } from "@/hooks/admin/useBrand";
import { Brand } from "@/types/admin/brand.type";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Plus,
  AlertCircle,
} from "lucide-react";
import AdminLoadingSpinner from "@/components/ui/AdminLoadingSpinner";
import BrandCard from "@/components/admin/brands/BrandCard";
import BrandForm from "@/components/admin/brands/BrandForm";
import { NoBrand } from "@/components/admin/brands/NoBrand";

export default function BrandsPage() {
  // ============= HOOKS =============
  const {
    // Data
    brands,
    loading,
    saving,
    error,
    clearError,
    success,

    // Pagination
    currentPage,
    totalPages,
    totalElements,
    goToPage,
    nextPage,
    prevPage,

    // Search
    searchBrands,
    resetSearch,
    isSearching,

    // Actions
    createBrand,
    updateBrand,
    deleteBrand,
    toggleStatus,
    addCategories,
    removeCategories,
  } = useBrand();

  // ============= LOCAL STATE =============
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // ============= SEARCH HANDLERS =============
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (value.trim()) {
        searchBrands(value, 0);
      } else {
        resetSearch();
      }
    }, 500);

    setSearchTimeout(timeout);
  }, [searchBrands, resetSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    resetSearch();
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  }, [resetSearch, searchTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // ============= FORM HANDLERS =============
  const handleAdd = useCallback(() => {
    setEditingBrand(null);
    setShowForm(true);
    clearError();
  }, [clearError]);

  const handleEdit = useCallback((brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
    clearError();
  }, [clearError]);

  const handleClose = useCallback(() => {
    setShowForm(false);
    setEditingBrand(null);
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(async (formData: FormData) => {
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, formData);
      } else {
        await createBrand(formData);
      }
      handleClose();
    } catch (err) {
      console.log("Form submission failed, keeping form open");
    }
  }, [editingBrand, updateBrand, createBrand, handleClose]);

  // ============= CATEGORY HANDLERS =============
  const handleAddCategories = useCallback(async (brandId: number, categoryIds: number[]) => {
    try {
      await addCategories(brandId, categoryIds);
    } catch (err) {
      console.error("Failed to add categories:", err);
    }
  }, [addCategories]);

  const handleRemoveCategories = useCallback(async (brandId: number, categoryIds: number[]) => {
    try {
      await removeCategories(brandId, categoryIds);
    } catch (err) {
      console.error("Failed to remove categories:", err);
    }
  }, [removeCategories]);

  // ============= LOADING STATE =============
  if (loading && brands.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AdminLoadingSpinner message="Loading brands..." />
      </div>
    );
  }

  // ============= RENDER =============
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Brands</h1>
          {totalElements > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Total {totalElements} {totalElements === 1 ? 'brand' : 'brands'}
            </p>
          )}
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            onChange={handleSearch}
            value={searchInput}
            type="search"
            className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Search brands by name..."
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {searchInput && (
          <p className="text-sm text-gray-600 mt-2">
            Found {brands.length} {brands.length === 1 ? "brand" : "brands"}
            {isSearching && " (searching...)"}
          </p>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-0.5">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-6 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Brand {editingBrand ? "updated" : "created"} successfully!
          </p>
        </div>
      )}

      {/* Empty State */}
      {brands.length === 0 && !loading && (
         <NoBrand
                searchInput={searchInput}
                handleClearSearch={handleClearSearch}
                handleAdd={handleAdd}
            />
      )}

      {/* Brands Grid */}
      {brands.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={handleEdit}
              onDelete={deleteBrand}
              onToggle={toggleStatus}
              onAddCategories={handleAddCategories} 
              onRemoveCategories={handleRemoveCategories}  
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 order-2 sm:order-1">
            Page {currentPage + 1} of {totalPages} • {totalElements} total
          </p>

          <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                if (
                  i === 0 ||
                  i === totalPages - 1 ||
                  (i >= currentPage - 1 && i <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(i)}
                      className={`
                        min-w-9 h-9 text-sm rounded-lg transition-all
                        ${
                          currentPage === i
                            ? "bg-gray-900 text-white font-medium"
                            : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  );
                }

                if (i === currentPage - 2 || i === currentPage + 2) {
                  return (
                    <span
                      key={i}
                      className="w-9 h-9 flex items-center justify-center text-gray-400"
                    >
                      ...
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <BrandForm
          brand={editingBrand ?? undefined}
          onClose={handleClose}
          onSubmit={handleSubmit}
          saving={saving}
          error={error}
        />
      )}
    </div>
  );
}