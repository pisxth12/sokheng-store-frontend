// components/admin/analytics/TopBrands.tsx
"use client";

import { TopBrand } from "@/types/admin/analytics.type";
import { Award, TrendingUp } from "lucide-react";

interface TopBrandsProps {
    brands: TopBrand[] | null;  
}

export default function TopBrands({ brands }: TopBrandsProps) {
    if (!brands?.length) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-amber-50 rounded-xl">
                        <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Top Brands</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                        <Award className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">No brand data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl">
                        <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Top Brands</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Best performing brands</p>
                    </div>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                    by revenue
                </span>
            </div>

            <div className="space-y-3">
                {brands.map((brand, index) => (
                    <div 
                        key={brand.id} 
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                    >
                        {/* Rank Badge */}
                        <div className={`
                            w-8 h-8 rounded-xl flex items-center justify-center text-sm font-medium
                            ${index === 0 ? 'bg-amber-50 text-amber-600' : 
                              index === 1 ? 'bg-gray-50 text-gray-500' : 
                              index === 2 ? 'bg-orange-50 text-orange-600' : 
                              'bg-gray-50 text-gray-400'}
                        `}>
                            #{index + 1}
                        </div>

                        {/* Logo */}
                        <div className="relative">
                            <div className="w-12 h-12 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center ring-1 ring-gray-100 group-hover:ring-2 group-hover:ring-gray-200 transition-all overflow-hidden">
                                {brand.logo ? (
                                    <img 
                                        src={brand.logo} 
                                        alt={brand.name}
                                        className="w-full h-full object-contain p-2"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-gray-400">
                                        {brand.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-700">
                                {brand.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-blue-400 rounded-full"></span>
                                    {brand.sold} items
                                </span>
                                <span className="text-gray-300">•</span>
                                <span>${brand.revenue.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Percentage */}
                        <div className="text-right">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-gray-900">
                                    {brand.percentage.toFixed(1)}%
                                </span>
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">of total</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}