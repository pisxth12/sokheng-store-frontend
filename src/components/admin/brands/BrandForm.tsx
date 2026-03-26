"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Brand } from "@/types/admin/brand.type";
import { Category } from "@/types/admin/category.type";
import { useCategory } from "@/hooks/admin/useCategory";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

interface BrandFormProps {
  brand?: Brand;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  saving: boolean;
  error: string | null;
}

export default function BrandForm({ 
  brand, 
  onClose, 
  onSubmit, 
  saving, 
  error 
}: BrandFormProps) {
  // ============= STATE =============
  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [description, setDescription] = useState(brand?.description || "");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    brand?.categories?.map(c => c.id) || []
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(brand?.logoUrl || null);
  const [slugEdited, setSlugEdited] = useState(false);

  // ============= HOOKS =============
  const { categories, loading: loadingCategories } = useCategory();

  // ============= HANDLERS =============
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // Auto-generate slug only if not manually edited
    if (!slugEdited) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [slugEdited]);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugEdited(true);
  }, []);

  const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogoFile(null);
    setLogoPreview(null);
  }, []);

  const handleCategoryToggle = useCallback((categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (description) formData.append("description", description);
    if (logoFile) formData.append("logo", logoFile);
    
    // Append each category ID
    selectedCategories.forEach(id => {
      formData.append("categoryIds", id.toString());
    });

    await onSubmit(formData);
  }, [name, slug, description, logoFile, selectedCategories, onSubmit]);

  // ============= RENDER =============
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {brand ? "Edit Brand" : "Create New Brand"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Logo
            </label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <label
                  htmlFor="logo"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  Choose Image
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., Nike, Apple, Samsung"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., nike, apple, samsung"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly name (auto-generated from brand name)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Brief description of the brand..."
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            {loadingCategories ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
                      ${selectedCategories.includes(category.id) 
                        ? 'bg-gray-100 border-gray-300' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700 truncate">
                      {category.title}
                    </span>
                  </label>
                ))}
              </div>
            )}
            {selectedCategories.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim() || !slug.trim()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}