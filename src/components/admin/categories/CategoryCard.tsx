"use client"

import { Category } from "@/types/category.type";
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import DeleteModal from "../products/deleteProductModal";

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
}

export default function CategoryCard({ category, onEdit, onDelete, onToggle }: CategoryCardProps) {
    const { id, title, imageUrl, isActive, } = category;
   
    //delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggle = useCallback(() => onToggle(id), [id, onToggle]);
    const handleEdit = useCallback(() => onEdit(category), [category, onEdit]);
    const handleDelete = useCallback( async () =>{
        setIsDeleting(true);{
            try{
                await onDelete(id);
            }finally{
                setIsDeleting(false);
            }
        }
    }, [id, onDelete]);



   

    return (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-sm transition-shadow">
            {/* Image */}
            <div className="aspect-video bg-gray-100 relative group">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                {/* Status Badge - Fixed: was showing title instead of status */}
                <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs rounded-md ${
                    isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                }`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-1">{title}</h3>
                
                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={handleToggle}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        title={isActive ? 'Deactivate' : 'Activate'}
                    >
                        {isActive ? (
                            <EyeOff className="w-4 h-4 text-gray-600" />
                        ) : (
                            <Eye className="w-4 h-4 text-gray-600" />
                        )}
                    </button>
                    <button
                        onClick={handleEdit}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        title="Edit category"
                    >
                        <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isDeleting}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        title="Delete category"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                    {/* Delete Modal */}
                    <DeleteModal isOpen={showDeleteModal} onClose={()=> setShowDeleteModal(false)} onConfirm={handleDelete} title="Delete Category" itemType={category.title} isLoading={isDeleting}/>
                </div>
            </div>
        </div>
    );
}