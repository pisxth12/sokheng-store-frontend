"use client";

import { useState, useEffect } from "react";

import { Product } from "@/types/product.type";
import { X, Upload, Trash2, Star, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/admin/useProduct";
import { useCategory } from "@/hooks/admin/useCategory";
import ProductImageGallery from "./ProductImageGallery";

interface ProductFormProps {
    product?: Product | null;
    onClose: () => void;
    onSuccess: () => void;

}

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
    const { createProduct, updateProduct, saving ,toggleMainImage,deleteImage,reorderImages,updateImageAltText,} = useProducts();
    
    const { categories } = useCategory();

    // Form state
    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [price, setPrice] = useState(product?.price || 0);
    const [salePrice, setSalePrice] = useState(product?.salePrice?.toString() || "");
    const [saleEndDate, setSaleEndDate] = useState(product?.saleEndDate?.split('T')[0] || "");
    const [stock, setStock] = useState(product?.stock || 0);
    const [slug, setSlug] = useState(product?.slug || "");
    const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
    const [categoryId, setCategoryId] = useState(product?.categoryId || 0);

    // Image state
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [altTexts, setAltTexts] = useState<string[]>([]);
    const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
    const [setMainImageId, setSetMainImageId] = useState<number>();

    //Error message
    const [formMessage, setFormMessage] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
    if (product?.saleEndDate) {
        // API returns: "2024-03-15T00:00:00"
        const date = new Date(product.saleEndDate);
        const formatted = date.toISOString().split('T')[0]; // "2024-03-15"
        setSaleEndDate(formatted);
    }
}, [product]);

    
            useEffect(() => {
                if (product) {
                    setName(product.name || "");
                    setDescription(product.description || "");
                    setPrice(product.price || 0);
                    setSalePrice(product.salePrice?.toString() || "");
                    setStock(product.stock || 0);
                    setSlug(product.slug || "");
                    setIsFeatured(product.isFeatured || false);
                    setCategoryId(product.categoryId || 0);
                } else {
                    // Reset form for new product
                    setName("");
                    setDescription("");
                    setPrice(0);
                    setSalePrice("");
                    setSaleEndDate("");
                    setStock(0);
                    setSlug("");
                    setIsFeatured(false);
                    setCategoryId(0);
                    setImageFiles([]);
                    setImagePreviews([]);
                    setAltTexts([]);
                    setDeleteImageIds([]);
                    setSetMainImageId(undefined);
                }
            }, [product]); 


    // Load existing images
    useEffect(() => {
        if (product?.images) {
            setImagePreviews(product.images.map(img => img.imageUrl));
            setAltTexts(product.images.map(img => img.altText || ""));
        }
    }, [product]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImageFiles(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        setAltTexts(prev => [...prev, ...files.map(() => "")]);
    };

    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setAltTexts(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageId: number) => {
        setDeleteImageIds(prev => [...prev, imageId]);
        setImagePreviews(prev => prev.filter((_, i) => {
            if (product?.images && i < product.images.length) {
                return product.images[i].id !== imageId;
            }
            return true;
        }));
    };

    const updateMainImage = async (productId: number, imageId: number) => {
        try {
            await toggleMainImage(productId, imageId);
        } catch (error) {
            console.error("Error updating main image:", error);
        }
    }

    const deleteProductImage = async (productId: number, imageId: number) => {
        if(!confirm("Are you sure you want to delete this image?")) return;

        try {
            await deleteImage(productId, imageId);
        } catch (error) {
            console.error("Error deleting product image:", error);
        }
    }
    


   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormMessage(null);
    setFormError(null);

    try {
        const formData = new FormData();
        formData.append("name", name);
        if (description) formData.append("description", description);
        formData.append("price", price.toString());
        if (salePrice) formData.append("salePrice", salePrice);
        if (saleEndDate) {
            formData.append("saleEndDate", `${saleEndDate}T00:00:00`);
        }
        formData.append("stock", stock.toString());
        if (slug) formData.append("slug", slug);
        formData.append("isFeatured", isFeatured.toString());
        formData.append("categoryId", categoryId.toString());

        if (product) {
            imageFiles.forEach(file => formData.append("newImages", file));
            altTexts.forEach(text => formData.append("newAltTexts", text));
            deleteImageIds.forEach(id => formData.append("deleteImageIds", id.toString()));
            if (setMainImageId) formData.append("setMainImageId", setMainImageId.toString());

            await updateProduct(product.id, formData);
            setFormMessage("Product updated successfully ✅");
        } else {
            imageFiles.forEach(file => formData.append("images", file));
            altTexts.forEach(text => formData.append("altTexts", text));

            await createProduct(formData);
            setFormMessage("Product created successfully ✅");
        }

        onSuccess();
        onClose();  
        

    } catch (error: any) {
        console.error(error);
        setFormError(
            error?.response?.data?.message  ||  
            "Something went wrong. Please try again."
        );
    }
};
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                    <h2 className="text-lg font-semibold">
                        {product ? "Edit Product" : "New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {formMessage && (
                    <p className="text-green-600">{formMessage}</p>
                )}

                {formError && (
                    <p className="text-red-600">{formError}</p>

                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sale Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sale End Date
                            </label>
                            <input
                                type="date"
                                value={saleEndDate}
                                onChange={(e) => setSaleEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock *
                            </label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Slug
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Featured Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="isFeatured" className="text-sm text-gray-700">
                            Featured Product
                        </label>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                        </label>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-3 mb-3">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt=""
                                            className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                                            {product?.images && index < product.images.length ? (
                                                // Existing image
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateMainImage(product.id, product.images[index].id)}
                                                        className={`p-1 rounded-full transition-colors ${
                                                            setMainImageId === product.images[index].id || product.images[index].isMain
                                                                ? 'bg-yellow-500 text-white'
                                                                : 'bg-white text-gray-700 hover:bg-yellow-500 hover:text-white'
                                                        }`}
                                                        title="Set as main"
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </button>
                                                    {!product.images[index].isMain && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteProductImage(product.id, product.images[index].id)}
                                                            className="p-1 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                // New image
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="p-1 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        {product?.images && index < product.images.length && product.images[index].isMain && (
                                            <span className="absolute top-1 left-1 bg-yellow-500 text-white p-1 rounded-full">
                                                <Star className="w-3 h-3 fill-current" />
                                            </span>
                                        )}
                                        <input
                                            type="text"
                                            value={altTexts[index] || ""}
                                            onChange={(e) => setAltTexts(prev => prev.map((t, i) => i === index ? e.target.value : t))}
                                            placeholder="Alt text"
                                            className="mt-1 w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <label className="block w-full border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300 transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-600">Click to upload images</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>{product ? "Update" : "Create"}</span>
                            )}
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}