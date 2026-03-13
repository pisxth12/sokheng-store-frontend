"use client"
import { Product } from "@/types/admin/product.type";
import Link from "next/link";
import { useState } from "react";

interface Props{
    product: Product;
}
const PLACEHOLDER_IMAGE = "https://placehold.co/600x600/e2e8f0/1e293b?text=No+Image";
export default function ProductCard({product}: Props){
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false); 
    

  

    const hasSecondImage = product.images && product.images.length > 1;
    const secondImage = hasSecondImage 
        ? product.images.find(img => !img.isMain)?.imageUrl || product.images[1]?.imageUrl 
        : null;
        
    const mainImageSrc = !product.mainImage || imageError ? PLACEHOLDER_IMAGE : product.mainImage;
   

    return (
        <Link 
            href={`/products/${product.slug}`} 
            className="group block"
            onMouseEnter={() => hasSecondImage && setIsHovered(true)}
            onMouseLeave={() => hasSecondImage && setIsHovered(false)}
        >
            <div className="relative">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden dark:bg-slate-200/10 rounded-mkd">
                    {/* Main Image */}
                    <img 
                        src={mainImageSrc} 
                        alt={product.name}
                        onError={()=>setImageError(true)}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                            hasSecondImage ? 'group-hover:scale-105' : ''
                        }`}
                        style={{
                            opacity: hasSecondImage && isHovered ? 0 : 1
                        }}
                    />
                    
                    {/* Second Image */}
                    {hasSecondImage && secondImage && (
                        <img 
                            src={secondImage} 
                            alt={`${product.name} - alternate view`}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                            }}
                            style={{ opacity: isHovered ? 1 : 0 }}
                        />
                    )}
                    
                    {/* Badges Container */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.stock === 0 && (
                            <span className="bg-black/75 dark:bg-black/90 text-white px-3 py-1 text-xs font-medium backdrop-blur-sm rounded">
                                OUT OF STOCK
                            </span>
                        )}
                    </div>
                    
                    {product.isOnSale && product.salePrice && (
                        <div>
                            {product.discountPercent && (
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold ">
                                        -{product.discountPercent}%
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                

                {/* Content */}
                <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {product.categoryName}
                    </p>
                    
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition line-clamp-2">
                        {product.name}
                    </h3>
                    
                    {/* Price Section */}
                    <div className="pt-1">
                        {product.stock > 0 ? (
                            <>
                                {product.isOnSale && product.salePrice ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                            ${product.salePrice.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-gray-400 dark:text-gray-500">Out of stock</p>
                        )}
                    </div>
                    
                    {/* Low Stock Warning */}
                    {product.stock > 0 && product.stock <= 3 && (
                        <p className="text-xs text-orange-500 dark:text-orange-400">
                            Only {product.stock} left
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );    
}