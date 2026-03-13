import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductCardSkeletonGridProps {
  count?: number;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export default function ProductCardSkeletonGrid({ 
  count = 8,
  cols = { mobile: 2, tablet: 3, desktop: 4 }
}: ProductCardSkeletonGridProps) {
  
  const gridCols = {
    '--grid-mobile': cols.mobile,
    '--grid-tablet': cols.tablet,
    '--grid-desktop': cols.desktop,
  } as React.CSSProperties;

  return (
    <div 
      className="grid gap-4 md:gap-6"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols.mobile}, minmax(0, 1fr))`,
        ...gridCols
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            grid-template-columns: repeat(${cols.tablet}, minmax(0, 1fr)) !important;
          }
        }
        @media (min-width: 1024px) {
          div {
            grid-template-columns: repeat(${cols.desktop}, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
      
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}