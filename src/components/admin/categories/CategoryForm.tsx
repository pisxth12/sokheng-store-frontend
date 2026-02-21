"use client";

import { Category } from "@/types/category.type";

import { ImageIcon, Trash2, X } from "lucide-react";
import { useState, useCallback } from "react";

interface CategoryFormProps {
    category?: Category;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    saving: boolean;
    error?: string | null;
}

export default function CategoryForm({ category, onClose, onSubmit, saving , error }: CategoryFormProps) {
    const [title, setTitle] = useState(category?.title || "");
    const [description, setDescription] = useState(category?.description || "");
    const [slug, setSlug] = useState(category?.slug || "");
    const [isActive, setIsActive] = useState(category?.isActive ?? true);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(category?.imageUrl || null);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleRemoveImage = useCallback(() => {
        setPreview(null);
        setImage(null);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("slug", slug);
        formData.append("isActive", isActive.toString());
        if (image) {
            formData.append("image", image);
        }
        await onSubmit(formData);
    }, [title, description, slug, isActive, image, onSubmit]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-md w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-medium">
                        {category ? "Edit Category" : "New Category"} {/* Fixed: "Banner" → "Category" */}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image *
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center">
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-32 mx-auto rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="category-image" // Fixed: "banner-image" → "category-image"
                                        required={!category}
                                    />
                                    <label
                                        htmlFor="category-image" // Fixed: "banner-image" → "category-image"
                                        className="cursor-pointer inline-flex flex-col items-center"
                                    >
                                        <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                                        <span className="text-sm text-gray-600">
                                            Click to upload
                                        </span>
                                    </label>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
                            maxLength={100}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
                            maxLength={100}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
                            maxLength={100}
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="rounded border-gray-300 focus:ring-0"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-700">
                            Active
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-md disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Saving..." : category ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}