import { TopCategory } from "@/types/open/category.type";
import Link from "next/link";
import { memo, useState } from "react";

interface TopCategoriesProps {
  categories: TopCategory[]; 
}


export const CategoryCard = memo(function CategoryCard({ category }: { category: any }) {
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/categories/${category.slug}`}
            prefetch={false}
            className="group relative overflow-hidden aspect-square "
        >
            {/* Image with fallback */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <img
                src={imgError ? '/placeholder-category.jpg' : (category.image || '/placeholder-category.jpg')}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onLoad={(e) => {
                    (e.target as HTMLImageElement).previousSibling?.remove();
                }}
                onError={() => setImgError(true)}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 className="text-lg font-semibold text-white bg-black px-3   inline-block">
                    {category.name}
                </h3>
            </div>
        </Link>
    );
});