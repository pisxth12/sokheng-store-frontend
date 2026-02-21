"use client"

import { Banner } from "@/types/banner.type";
import { ImageIcon, Trash2, X } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";

interface BannerFormProps {
    banner?: Banner;
    banners: Banner[];
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    saving: boolean;
}

export default function BannerForm({ banner, banners , onClose, onSubmit, saving }: BannerFormProps) {
    const [title, setTitle] = useState(banner?.title || "");
    const [link, setLink] = useState(banner?.link || "");
    const [sortOrder, setSortOrder] = useState(banner?.sortOrder || 1);
    const [isActive, setIsActive] = useState(banner?.isActive ?? true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(banner?.imageUrl || null);

    // Update form when banner changes
    useEffect(() => {
        if (banner) {
            setTitle(banner.title || "");
            setLink(banner.link || "");
            setSortOrder(banner.sortOrder || 1);
            setIsActive(banner.isActive ?? true);
            setPreview(banner.imageUrl || null);
        } else {
            setTitle("");
            setLink("");
            setIsActive(true);
            setPreview(null);
        }
        setImageFile(null);
    }, [banner]);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    }, []);

   
    const usedOrders = banners
        .filter(b => b.id !== banner?.id)
        .map(b => b.sortOrder);

    // Available orders are 1-5 that are NOT used
    const availableOrders = [1, 2, 3, 4, 5].filter(
        num => !usedOrders.includes(num)
    );

    useEffect(() => {
        if (banner && !availableOrders.includes(banner.sortOrder)) {
            setSortOrder(banner.sortOrder);
        }
    }, [banner, availableOrders]);

 
    useEffect(() => {
        if (!banner && availableOrders.length > 0) {
            setSortOrder(availableOrders[0]);
        }
    }, [banner, availableOrders]);


    const handleRemoveImage = useCallback(() => {
        setPreview(null);
        setImageFile(null);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
    
       
    
        const form = new FormData();
        form.append("title", title || "");
        form.append("link", link || "");
        form.append("sortOrder", sortOrder.toString());
        form.append("isActive", isActive.toString());
        
        if (imageFile) {
            form.append("image", imageFile);
        }
        
        await onSubmit(form);
    }, [title, link, sortOrder, isActive, imageFile, banner, availableOrders, onSubmit]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-md w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-medium">
                        {banner ? "Edit Banner" : "New Banner"}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image {!banner && '*'}
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
                                        id="banner-image"
                                        required={!banner}
                                    />
                                    <label
                                        htmlFor="banner-image"
                                        className="cursor-pointer inline-flex flex-col items-center"
                                    >
                                        <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                                        <span className="text-sm text-gray-600">
                                            {banner ? "Click to change image" : "Click to upload image"}
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
                        />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link URL
                        </label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort Order (1-5)
                        </label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                        >
                            {availableOrders.map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === banner?.sortOrder ? '(Current)' : ''}
                                </option>
                            ))}
                        </select>
                        {!banner && availableOrders.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">
                                No available positions! Please reorder existing banners.
                            </p>
                        )}
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
                            {saving ? "Saving..." : banner ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}