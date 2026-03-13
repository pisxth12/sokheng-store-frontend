import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-200 dark:bg-slate-200/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 space-y-2">
        {/* Category */}
        <div className="h-3 w-16 bg-gray-200 dark:bg-slate-200/10 rounded" />
        
        {/* Title - 2 lines */}
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-gray-200 dark:bg-slate-200/10 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-200/10 rounded" />
        </div>

        {/* Price */}
        <div className="pt-2">
          <div className="h-5 w-20 bg-gray-200 dark:bg-slate-200/10 rounded" />
        </div>

        {/* Button */}
        <div className="pt-2">
          <div className="h-9 w-full bg-gray-200 dark:bg-slate-200/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}