"use client"

import { Banner } from "@/types/banner.type"
import { Edit, Eye, EyeOff, Trash2, GripVertical } from "lucide-react";
import { useCallback, useState } from "react";
import DeleteModal from "../products/deleteProductModal";

interface BannerCardProps {
    banner: Banner;
    onEdit: (banner: Banner) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
}

export default function BannerCard({ banner, onEdit, onDelete, onToggle }: BannerCardProps) {
    const { id, title, imageUrl, sortOrder, isActive } = banner;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleToggle = useCallback(() => onToggle(id), [id, onToggle]);
    const handleEdit = useCallback(() => onEdit(banner), [banner, onEdit]);
    const handleDelete = useCallback(async () => {
        setIsDeleting(true);
        try {
            await onDelete(id);
        } finally {
            setIsDeleting(false);
        }
    }, [id, onDelete]);

    // Get initials for placeholder
    const getInitials = (title: string) => {
        return title
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`
            group relative bg-white rounded-xl border-2 transition-all duration-200
            ${isActive 
                ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg' 
                : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
            }
        `}>
            {/* Status Indicator Bar */}
            <div className={`
                absolute top-0 left-0 right-0 h-1 rounded-t-xl 
            `} />

            {/* Image Section */}
            <div className="relative p-4 pb-0">
                <div className={`
                    aspect-[4/3] rounded-lg overflow-hidden
                    ${isActive ? 'bg-gray-100' : 'bg-gray-100/50'}
                `}>
                    {!imageError ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <span className="text-2xl font-semibold text-gray-400">
                                {getInitials(title)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Order Badge - Repositioned */}
                <div className="absolute top-6 left-6 flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-900">{sortOrder}</span>
                    </div>
                    <div className="w-5 h-5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center cursor-move">
                        <GripVertical className="w-3 h-3 text-gray-500" />
                    </div>
                </div>

                {/* Quick Status Dot */}
                <div className="absolute top-6 right-6">
                    <div className={`
                        w-2.5 h-2.5 rounded-full
                        ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}
                    `} />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1 flex-1">
                        {title}
                    </h3>
                    <span className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                        ${isActive 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }
                    `}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span>ID: {id}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>Order: {sortOrder}</span>
                </div>

                {/* Action Buttons - Redesigned */}
                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                    <button
                        onClick={handleToggle}
                        className={`
                            p-2 rounded-lg transition-all duration-200
                            ${isActive 
                                ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                            }
                        `}
                        title={isActive ? 'Deactivate banner' : 'Activate banner'}
                    >
                        {isActive ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                    
                    <button
                        onClick={handleEdit}
                        className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
                        title="Edit banner"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isDeleting}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete banner"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal 
                isOpen={showDeleteModal} 
                onClose={() => setShowDeleteModal(false)} 
                onConfirm={handleDelete} 
                title="Delete banner" 
                itemType={banner.title} 
                isLoading={isDeleting}
            />
        </div>
    );
}