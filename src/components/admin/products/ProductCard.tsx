"use client";

import { Product } from "@/types/product.type";
import { Edit, Trash2, Eye, EyeOff, Star, ImageIcon, BadgePercent, Package, AlertCircle } from "lucide-react";
import { useState } from "react";
import DeleteModal from "../products/deleteProductModal";

interface ProductCardProps {
    product: Product;
    onEdit: () => void;
    onDelete: (id: number) => Promise<void>;
    onToggleStatus: (id: number) => Promise<void>;
    onToggleFeatured: (id: number) => Promise<void>;
    clearDiscount: (id: number) => void;
}

export default function ProductCard({
    product,
    onEdit,
    onDelete,
    onToggleStatus,
    onToggleFeatured,
    clearDiscount
}: ProductCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageError, setImageError] = useState(false);

    const { id, name, price, salePrice, stock, isActive, isFeatured, images, mainImage } = product;

    const displayPrice = salePrice || price;
    const originalPrice = salePrice ? price : null;
    const imageUrl = mainImage || images?.[0]?.imageUrl;
    const discountPercentage = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(id);
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async () => {
        setIsToggling(true);
        try {
            await onToggleStatus(id);
        } finally {
            setIsToggling(false);
        }
    };

    const handleToggleFeatured = async () => {
        setIsToggling(true);
        try {
            await onToggleFeatured(id);
        } finally {
            setIsToggling(false);
        }
    };

    // Get stock status
    const getStockStatus = () => {
        if (stock === 0) return { label: 'Out of stock', color: 'bg-red-100 text-red-700', icon: AlertCircle };
        if (stock <= 5) return { label: 'Low stock', color: 'bg-yellow-100 text-yellow-700', icon: Package };
        return { label: 'In stock', color: 'bg-green-100 text-green-700', icon: Package };
    };

    const stockStatus = getStockStatus();
    const StockIcon = stockStatus.icon;

    // Get initials for placeholder
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <div className={`
                group relative bg-white rounded-xl border-2  transition-all duration-200
                ${isActive 
                    ? 'border-green-100 hover:border-gray-300 hover:shadow-lg' 
                    : 'border-red-400 bg-gray-50/50 opacity-75'
                }
            `}>
                {/* Status Bar */}
                <div className={`
                    absolute top-0 left-0 right-0 h-1 rounded-t-xl
                `} />

                {/* Image Section */}
                <div className="p-4 pb-0">
                    <div className="relative aspect-square rounded-lg bg-gray-100 overflow-hidden">
                        {imageUrl && !imageError ? (
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={() => setImageError(true)}
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">{getInitials(name)}</span>
                            </div>
                        )}

                        {/* Featured Badge */}
                        {isFeatured && (
                            <div className="absolute top-2 left-2">
                                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-lg shadow-sm">
                                    <Star className="w-3 h-3 fill-yellow-900" />
                                    <span className="text-xs font-medium">Featured</span>
                                </div>
                            </div>
                        )}

                        {/* Discount Badge */}
                        {salePrice && (
                            <div className="absolute top-2 right-2">
                                <div className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-lg shadow-sm">
                                    <BadgePercent className="w-3 h-3" />
                                    <span className="text-xs font-medium">-{discountPercentage}%</span>
                                </div>
                            </div>
                        )}

                        {/* Image Count */}
                        {images && images.length > 0 && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
                                {images.length} {images.length === 1 ? 'photo' : 'photos'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                    {/* Product Name and Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
                            {name}
                        </h3>
                        <div className={`
                            w-2 h-2 rounded-full flex-shrink-0 mt-1
                            ${isActive ? 'bg-green-500' : 'bg-gray-400'}
                        `} />
                    </div>

                    {/* Price Section */}
                    <div className="mb-3">
                        {originalPrice ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                    ${displayPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    ${originalPrice.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
                                ${price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-3">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${stockStatus.color}`}>
                            <StockIcon className="w-3 h-3" />
                            <span className="text-xs font-medium">{stockStatus.label}</span>
                            <span className="text-xs font-bold ml-0.5">({stock})</span>
                        </div>
                    </div>

                    {/* Clear Discount Button - Only shows when on sale */}
                    {salePrice && (
                        <button
                            onClick={() => clearDiscount(id)}
                            disabled={isToggling}
                            className="w-full mb-3 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                            <BadgePercent className="w-3 h-3" />
                            Clear Discount
                        </button>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {/* Status Toggle - Left side */}
                        <button
                            onClick={handleToggleStatus}
                            disabled={isToggling}
                            className={`
                                p-2 rounded-lg transition-all duration-200
                                ${isActive 
                                    ? 'text-gray-600 hover:bg-gray-100' 
                                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                                }
                                disabled:opacity-50
                            `}
                            title={isActive ? 'Deactivate product' : 'Activate product'}
                        >
                            {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        {/* Action Group - Right side */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleToggleFeatured}
                                disabled={isToggling}
                                className={`
                                    p-2 rounded-lg transition-all duration-200
                                    ${isFeatured 
                                        ? 'text-yellow-500 hover:bg-yellow-50' 
                                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                    disabled:opacity-50
                                `}
                                title={isFeatured ? 'Remove from featured' : 'Add to featured'}
                            >
                                <Star className={`w-4 h-4 ${isFeatured ? 'fill-yellow-500' : ''}`} />
                            </button>

                            <button
                                onClick={onEdit}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit product"
                            >
                                <Edit className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                disabled={isDeleting}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete product"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                itemType={name}
                isLoading={isDeleting}
            />
        </>
    );
}