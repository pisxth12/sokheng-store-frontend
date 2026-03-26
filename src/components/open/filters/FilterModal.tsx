// "use client";

// import { useTranslations } from "next-intl";
// import { useState, useEffect, useRef } from "react";
// import { X } from "lucide-react";
// import { createPortal } from "react-dom";
// import "./FilterModal.css";

// interface FilterModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onApply: (filters: any) => void;
//   currentFilters?: {
//     minPrice?: string;
//     maxPrice?: string;
//     categoryId?: string;
//     brandId?: string;
//     sortBy?: string;
//     sortOrder?: string;
//   };
//   priceRange?: { min: number; max: number };  
//   categories?: { id: number; name: string; slug: string }[]; 
//   brands?: { id: number; name: string; slug: string }[];    
// }

// const SORT_OPTIONS = [
//   { value: "recommend",      label: "Recommended" },
//   { value: "createdAt-desc", label: "Newest first" },
//   { value: "createdAt-asc",  label: "Oldest first" },
//   { value: "price-asc",      label: "Price: low to high" },
//   { value: "price-desc",     label: "Price: high to low" },
// ];

// export default function FilterModal({
//   isOpen,
//   onClose,
//   onApply,
//   currentFilters = {},
//   priceRange = { min: 0, max: 1000 },  
//   categories = [], 
//   brands = [], 
// }: FilterModalProps) {
//   const t = useTranslations("FilterModal");
//   const [closing, setClosing] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
//   const sliderRef = useRef<HTMLDivElement>(null);

//   const [filters, setFilters] = useState({
//     minPrice: currentFilters.minPrice || priceRange.min.toString(),
//     maxPrice: currentFilters.maxPrice || priceRange.max.toString(),
//     categoryId: currentFilters.categoryId || "",
//     brandId: currentFilters.brandId || "",
//     sortBy: currentFilters.sortBy || "createdAt",
//     sortOrder: currentFilters.sortOrder || "desc",

//   });

//   useEffect(() => { 
//     setMounted(true); 
//     return () => setMounted(false); 
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "unset";
//     return () => { document.body.style.overflow = "unset"; };
//   }, [isOpen]);

//   // Reset filters when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setFilters({
//         minPrice: currentFilters.minPrice || priceRange.min.toString(),
//         maxPrice: currentFilters.maxPrice || priceRange.max.toString(),
//         categoryId: currentFilters.categoryId || "",
//         brandId: currentFilters.brandId || "",
//         sortBy: currentFilters.sortBy || "createdAt",
//         sortOrder: currentFilters.sortOrder || "desc",
//       });
//     }
//   }, [isOpen, currentFilters, priceRange]);

//   useEffect(() => {
//     if (!isDragging) return;

//     const getPercentage = (value: number) => {
//       return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!sliderRef.current) return;

//       const rect = sliderRef.current.getBoundingClientRect();
//       let x = e.clientX - rect.left;
//       x = Math.min(Math.max(0, x), rect.width);
//       const percentage = x / rect.width;
//       let newValue = priceRange.min + percentage * (priceRange.max - priceRange.min);
//       newValue = Math.round(newValue * 100) / 100;

//       const currentMin = parseFloat(filters.minPrice);
//       const currentMax = parseFloat(filters.maxPrice);

//       if (isDragging === "min") {
//         const newMin = Math.min(newValue, currentMax - 0.01);
//         setFilters(prev => ({ 
//           ...prev, 
//           minPrice: Math.max(priceRange.min, newMin).toString() 
//         }));
//       } else if (isDragging === "max") {
//         const newMax = Math.max(newValue, currentMin + 0.01);
//         setFilters(prev => ({ 
//           ...prev, 
//           maxPrice: Math.min(priceRange.max, newMax).toString() 
//         }));
//       }
//     };

//     const handleMouseUp = () => {
//       setIsDragging(null);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, filters.minPrice, filters.maxPrice, priceRange.min, priceRange.max]);

//   if (!isOpen || !mounted) return null;

//   const handleClose = () => {
//     setClosing(true);
//     setTimeout(() => { setClosing(false); onClose(); }, 300);
//   };

//   const handleApply = () => {
//     setClosing(true);
//     setTimeout(() => { setClosing(false); onApply(filters); }, 300);
//   };

//   const handleReset = () => {
//     setFilters({
//       minPrice: priceRange.min.toString(),
//       maxPrice: priceRange.max.toString(),
//       categoryId: "",
//       brandId: "",
//       sortBy: "createdAt",
//       sortOrder: "desc",
//     });
//   };

//   const currentSortValue =
//     filters.sortBy === "recommend"
//       ? "recommend"
//       : `${filters.sortBy}-${filters.sortOrder}`;

//   const handleSortSelect = (value: string) => {
//     if (value === "recommend") {
//       setFilters({ ...filters, sortBy: "recommend", sortOrder: "desc" });
//     } else {
//       const [sb, so] = value.split("-");
//       setFilters({ ...filters, sortBy: sb, sortOrder: so });
//     }
//   };

//   const getPercentage = (value: number) => {
//     return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
//   };

//   const minPercent = getPercentage(parseFloat(filters.minPrice));
//   const maxPercent = getPercentage(parseFloat(filters.maxPrice));

//   const modal = (
//     <>
//       <div className="fm-overlay" onClick={handleClose} />
//       <div className={`fm-panel ${closing ? "fm-panel--closing" : ""}`}>
//         <div className="fm-header">
//           <h2 className="fm-title">{t("title")}</h2>
//           <button className="fm-close" onClick={handleClose} aria-label="Close">
//             <X size={13} />
//           </button>
//         </div>


      
//         <div className="fm-body">


//               {/* Category Filter */}
//                   {categories.length > 0 && (
//                     <div>
//                       <span className="fm-section-label">Category</span>
//                       <div className="fm-chips">
//                         <button
//                           onClick={() => setFilters(prev => ({ ...prev, categoryId: "" }))}
//                           className={`fm-chip ${filters.categoryId === "" ? "fm-chip--active" : ""}`}
//                         >
//                           All
//                         </button>
//                         {categories.map((cat) => (
//                           <button
//                             key={cat.id}
//                             onClick={() => setFilters(prev => ({ ...prev, categoryId: cat.id.toString() }))}
//                             className={`fm-chip ${filters.categoryId === cat.id.toString() ? "fm-chip--active" : ""}`}
//                           >
//                             {cat.name}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Brand Filter */}
//                   {brands.length > 0 && (
//                     <div>
//                       <span className="fm-section-label">Brand</span>
//                       <div className="fm-chips">
//                         <button
//                           onClick={() => setFilters(prev => ({ ...prev, brandId: "" }))}
//                           className={`fm-chip ${filters.brandId === "" ? "fm-chip--active" : ""}`}
//                         >
//                           All
//                         </button>
//                         {brands.map((brand) => (
//                           <button
//                             key={brand.id}
//                             onClick={() => setFilters(prev => ({ ...prev, brandId: brand.id.toString() }))}
//                             className={`fm-chip ${filters.brandId === brand.id.toString() ? "fm-chip--active" : ""}`}
//                           >
//                             {brand.name}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}


//           {/* Price Range Slider */}
//           <div>
//             <span className="fm-section-label">{t("priceRange.label")}</span>
            
//             <div className="fm-slider-container">
//               <div ref={sliderRef} className="fm-slider-track">
//                 <div
//                   className="fm-slider-range"
//                   style={{
//                     left: `${minPercent}%`,
//                     right: `${100 - maxPercent}%`,
//                   }}
//                 />
//                 <div
//                   className="fm-slider-thumb"
//                   style={{ left: `${minPercent}%` }}
//                   onMouseDown={() => setIsDragging("min")}
//                 />
//                 <div
//                   className="fm-slider-thumb"
//                   style={{ left: `${maxPercent}%` }}
//                   onMouseDown={() => setIsDragging("max")}
//                 />
//               </div>
//             </div>

//             <div className="fm-price-labels">
//               <div className="fm-price-label">
//                 <span>Min</span>
//                 <span className="fm-price-value">${parseFloat(filters.minPrice).toFixed(2)}</span>
//               </div>
//               <div className="fm-price-label">
//                 <span>Max</span>
//                 <span className="fm-price-value">${parseFloat(filters.maxPrice).toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="fm-price-range-info">
//               ${priceRange.min.toFixed(2)} — ${priceRange.max.toFixed(2)}
//             </div>
//           </div>

//           <div className="fm-divider" />

//           {/* Sort options */}
//           <div>
//             <span className="fm-section-label">{t("sortBy.label")}</span>
//             <div className="fm-sort-grid">
//               {SORT_OPTIONS.map((opt) => {
//                 const active = currentSortValue === opt.value;
//                 return (
//                   <button
//                     key={opt.value}
//                     className={`fm-sort-option ${active ? "fm-sort-option--active" : ""}`}
//                     onClick={() => handleSortSelect(opt.value)}
//                   >
//                     <span className="fm-sort-radio">
//                       <span className="fm-sort-radio-dot" />
//                     </span>
//                     <span className="fm-sort-text">{opt.label}</span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="fm-footer">
//           <button className="fm-btn-reset" onClick={handleReset}>
//             Reset
//           </button>
//           <button className="fm-btn-apply" onClick={handleApply}>
//             {t("buttons.apply")}
//           </button>
//         </div>
//       </div>
//     </>
//   );

//   return createPortal(modal, document.body);
// }