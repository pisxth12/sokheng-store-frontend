// // components/open/filters/FilterSidebar.tsx
// "use client"

// import { Category } from "@/types/open/product.type";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { useState } from "react";

// interface FilterSidebarProps {
//     categories: Category[];
//     loadingCategories?: boolean;
//     selectedCategoryId?: string;
//     minPrice?: string;
//     maxPrice?: string;
//     priceRange?: { minPrice: number; maxPrice: number };
//     onCategoryChange: (categoryId: string) => void;
//     onPriceChange: (minPrice: string, maxPrice: string) => void;
//     onClearFilters: () => void;
// }

// export function FilterSidebar({
//     categories,
//     loadingCategories = false,
//     selectedCategoryId,
//     minPrice = "",
//     maxPrice = "",
//     priceRange,
//     onCategoryChange,
//     onPriceChange,
//     onClearFilters,
// }: FilterSidebarProps) {
//     const [localMinPrice, setLocalMinPrice] = useState(minPrice);
//     const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
    
//     const handlePriceSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onPriceChange(localMinPrice, localMaxPrice);
//     };
    
//     return (
//         <div className="space-y-6">
//             {/* Price Filter */}
//             {priceRange && (
//                 <div className="border-b border-gray-200 pb-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
//                     <div className="mb-3 text-sm text-gray-600">
//                         Price range: ${priceRange.minPrice} - ${priceRange.maxPrice}
//                     </div>
//                     <form onSubmit={handlePriceSubmit} className="space-y-3">
//                         <div className="flex gap-2">
//                             <div className="flex-1">
//                                 <label className="text-xs text-gray-500">Min ($)</label>
//                                 <input
//                                     type="number"
//                                     value={localMinPrice}
//                                     onChange={(e) => setLocalMinPrice(e.target.value)}
//                                     placeholder={priceRange.minPrice.toString()}
//                                     min={priceRange.minPrice}
//                                     max={priceRange.maxPrice}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <label className="text-xs text-gray-500">Max ($)</label>
//                                 <input
//                                     type="number"
//                                     value={localMaxPrice}
//                                     onChange={(e) => setLocalMaxPrice(e.target.value)}
//                                     placeholder={priceRange.maxPrice.toString()}
//                                     min={priceRange.minPrice}
//                                     max={priceRange.maxPrice}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                             Apply
//                         </button>
//                     </form>
//                 </div>
//             )}
            
//             {/* Category Filter */}
//             <div className="border-b border-gray-200 pb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
//                 {loadingCategories ? (
//                     <div className="flex justify-center py-4">
//                         <LoadingSpinner />
//                     </div>
//                 ) : (
//                     <div className="space-y-2">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                             <input
//                                 type="radio"
//                                 name="category"
//                                 value=""
//                                 checked={selectedCategoryId === ""}
//                                 onChange={() => onCategoryChange("")}
//                                 className="text-blue-600 focus:ring-blue-500"
//                             />
//                             <span className="text-sm text-gray-700">All Categories</span>
//                         </label>
//                         {categories.map((category) => (
//                             <label key={category.id} className="flex items-center gap-2 cursor-pointer">
//                                 <input
//                                     type="radio"
//                                     name="category"
//                                     value={category.id}
//                                     checked={selectedCategoryId === category.id.toString()}
//                                     onChange={() => onCategoryChange(category.id.toString())}
//                                     className="text-blue-600 focus:ring-blue-500"
//                                 />
//                                 <span className="text-sm text-gray-700">{category.name}</span>
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>
            
//             {/* Clear All Button */}
//             <button
//                 onClick={onClearFilters}
//                 className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
//             >
//                 Clear All Filters
//             </button>
//         </div>
//     );
// }