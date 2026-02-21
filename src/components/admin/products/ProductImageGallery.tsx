// "use client"

// import { ProductImage } from "@/types/product.type"
// import { useState } from "react";

// interface ProductImageGalleryProps{
//     images: ProductImage[];
//     productId: number;
//     onToggleFeatured: (id: number) => Promise<void>;
//     onDelete: (id: number) => Promise<void>;
//     onReorder: (imageIds: number[]) => Promise<void>;
// }

// export default function ProductImageGallery({
//     images,
//     productId,
//     onToggleFeatured,
//     onDelete,
//     onReorder,
// }: ProductImageGalleryProps){
//     const [isReordering, setIsReordering] = useState(false);
//     const [currentImageId, setCurrentImageId] = useState(images);
//     const [editingAltText, setEditingAltText] = useState<number | null>(null);
//     const [altTextValue, setAltTextValue] = useState('');

//     const handleMoveUp = (index: number) => {
//         if(index === 0) return;
//         const newImages = [...images];
//         [newImages[index-1],newImages[index]] = [newImages[index],newImages[index-1]]
//         setCurrentImageId(newImages);
//     }; 
// }

"use client";

import { ProductImage } from "@/types/product.type";
import { Star, Trash2, ArrowUp, ArrowDown, X } from "lucide-react";
import { useState } from "react";

interface ProductImageGalleryProps {
    images: ProductImage[];
    productId: number;
    onToggleMain: (imageId: number) => Promise<void>;
    onDelete: (imageId: number) => Promise<void>;
    onReorder: (imageIds: number[]) => Promise<void>;
    onUpdateAltText: (imageId: number, altText: string) => Promise<void>;
}

export default function ProductImageGallery({
    images,
    productId,
    onToggleMain,
    onDelete,
    onReorder,
    onUpdateAltText
}: ProductImageGalleryProps) {
    const [isReordering, setIsReordering] = useState(false);
    const [currentImages, setCurrentImages] = useState(images);
    const [editingAltText, setEditingAltText] = useState<number | null>(null);
    const [altTextValue, setAltTextValue] = useState("");

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newImages = [...currentImages];
        [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        setCurrentImages(newImages);
    };

    const handleMoveDown = (index: number) => {
        if (index === currentImages.length - 1) return;
        const newImages = [...currentImages];
        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
        setCurrentImages(newImages);
    };

    const handleSaveReorder = async () => {
        await onReorder(currentImages.map(img => img.id));
        setIsReordering(false);
    };

    const handleCancelReorder = () => {
        setCurrentImages(images);
        setIsReordering(false);
    };

    const handleEditAltText = (image: ProductImage) => {
        setEditingAltText(image.id);
        setAltTextValue(image.altText || "");
    };

    const handleSaveAltText = async (imageId: number) => {
        await onUpdateAltText(imageId, altTextValue);
        setEditingAltText(null);
    };

    if (images.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No images uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Reorder Controls */}
            {isReordering && (
                <div className="flex justify-end gap-2 mb-2">
                    <button
                        onClick={handleCancelReorder}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveReorder}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Order
                    </button>
                </div>
            )}

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentImages.map((image, index) => (
                    <div key={image.id} className="relative group border rounded-lg p-2">
                        <img
                            src={image.imageUrl}
                            alt={image.altText || ""}
                            className="w-full aspect-square object-cover rounded"
                        />

                        {/* Main Image Badge */}
                        {image.isMain && (
                            <span className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-full">
                                <Star className="w-3 h-3 fill-current" />
                            </span>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                            {!image.isMain && (
                                <button
                                    onClick={() => onToggleMain(image.id)}
                                    className="p-1 bg-white rounded-full hover:bg-yellow-500 hover:text-white"
                                    title="Set as main"
                                >
                                    <Star className="w-4 h-4" />
                                </button>
                            )}
                            
                            {isReordering ? (
                                <>
                                    <button
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                        className="p-1 bg-white rounded-full hover:bg-gray-100 disabled:opacity-30"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleMoveDown(index)}
                                        disabled={index === currentImages.length - 1}
                                        className="p-1 bg-white rounded-full hover:bg-gray-100 disabled:opacity-30"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => onDelete(image.id)}
                                    className="p-1 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Alt Text */}
                        {editingAltText === image.id ? (
                            <div className="mt-2 flex gap-1">
                                <input
                                    type="text"
                                    value={altTextValue}
                                    onChange={(e) => setAltTextValue(e.target.value)}
                                    className="flex-1 px-2 py-1 text-xs border rounded"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleSaveAltText(image.id)}
                                    className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="mt-2 flex justify-between items-center">
                                <p className="text-xs text-gray-500 truncate">
                                    {image.altText || "No alt text"}
                                </p>
                                <button
                                    onClick={() => handleEditAltText(image)}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Reorder Toggle */}
            {images.length > 1 && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsReordering(!isReordering)}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        {isReordering ? "Cancel Reorder" : "Reorder Images"}
                    </button>
                </div>
            )}
        </div>
    );
}