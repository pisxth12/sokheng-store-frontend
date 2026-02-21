"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useCategory } from "@/hooks/admin/useCategory";
import { Category } from "@/types/category.type";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import CategoryCard from "@/components/admin/categories/CategoryCard";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  Plus,
  AlertCircle
} from "lucide-react";
import AdminLoadingSpinner from "@/components/ui/AdminLoadingSpinner";

export default function CategoriesPage() {
  const {
    categories,
    saving,
    deleteCategory,
    loading,
    error,
    toggleStatus,
    createCategory,
    updateCategory,
    clearError,
    nextPage,
    prevPage,
    goToPage,
    currentPage,
    totalPages,
    resetSearch,
    searchQuery,
    pageSize,
    isSearching,
    searchCategories,
  } = useCategory();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handlers
  const handleAdd = useCallback(() => {
    setEditingCategory(null);
    setShowForm(true);
    clearError();
  }, [clearError]);

  const handleEdit = useCallback(
    (category: Category) => {
      setEditingCategory(category);
      setShowForm(true);
      clearError();
    },
    [clearError],
  );

  const handleClose = useCallback(() => {
    setShowForm(false);
    setEditingCategory(null);
    clearError();
  }, [clearError]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Debounce search to avoid too many requests
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (value.trim()) {
        searchCategories(value, 0);
      } else {
        resetSearch();
      }
    }, 500);
    
    setSearchTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    resetSearch();
  }, [resetSearch]);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      try {
        if (editingCategory) {
          await updateCategory(editingCategory.id, formData);
        } else {
          await createCategory(formData);
        }
        handleClose();
      } catch (err) {
        console.log("Form submission failed, keeping form open");
      }
    },
    [editingCategory, updateCategory, createCategory, handleClose],
  );

  // Loading state
  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AdminLoadingSpinner message="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
         
        </div>
        
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Category
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
            placeholder="Search categories by name..."
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
            Found {categories.length} {categories.length === 1 ? 'category' : 'categories'} 
            {isSearching && ' (searching...)'}
          </p>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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

      {/* Empty State */}
      {categories.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          {searchInput ? (
            <div>
              <p className="text-gray-600">No categories found for "{searchInput}"</p>
              <button
                onClick={handleClearSearch}
                className="mt-2 text-sm text-gray-900 underline hover:no-underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">No categories yet</p>
              <button
                onClick={handleAdd}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first category
              </button>
            </div>
          )}
        </div>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={deleteCategory}
              onToggle={toggleStatus}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 order-2 sm:order-1">
            Page {currentPage + 1} of {totalPages}
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
                // Show current page, first, last, and adjacent pages
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
                        min-w-[36px] h-9 text-sm rounded-lg transition-all
                        ${currentPage === i
                          ? 'bg-gray-900 text-white font-medium'
                          : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  );
                }
                
                // Show ellipsis
                if (i === currentPage - 2 || i === currentPage + 2) {
                  return (
                    <span key={i} className="w-9 h-9 flex items-center justify-center text-gray-400">
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

          {/* Page Size Selector */}
          <div className="flex items-center gap-2 order-3">
            <span className="text-sm text-gray-500">Show:</span>
            <select 
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={pageSize}
              // onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory ?? undefined}
          onClose={handleClose}
          onSubmit={handleSubmit}
          saving={saving}
          error={error}
        />
      )}
    </div>
  );
}