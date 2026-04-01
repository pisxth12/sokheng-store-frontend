"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="pc-link">
      <div className="pc-wrap pc-skeleton">
        {/* Image Skeleton */}
        <div className="pc-image-wrap">
          <div className="skeleton-img" />
        </div>

        {/* Info Skeleton */}
        <div className="pc-info">
          <div className="skeleton-category" />
          <div className="skeleton-name" />
          <div className="skeleton-price" />
        </div>
      </div>

      <style>{`
        .skeleton-img {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        .dark .skeleton-img {
          background: linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%);
        }
        
        .skeleton-category {
          width: 60px;
          height: 12px;
          background: #e5e7eb;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        
        .dark .skeleton-category {
          background: #374151;
        }
        
        .skeleton-name {
          width: 100%;
          height: 18px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-top: 8px;
          animation: pulse 1.5s infinite;
        }
        
        .dark .skeleton-name {
          background: #374151;
        }
        
        .skeleton-name::after {
          content: "";
          display: block;
          width: 70%;
          height: 18px;
          background: inherit;
          border-radius: 4px;
          margin-top: 6px;
        }
        
        .skeleton-price {
          width: 70px;
          height: 22px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-top: 10px;
          animation: pulse 1.5s infinite;
        }
        
        .dark .skeleton-price {
          background: #374151;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}