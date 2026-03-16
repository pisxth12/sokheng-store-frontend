// lib/api/brand.server.ts
import "server-only";

import { apiServerService } from "../api/server";
import type { Brand } from "@/types/open/brand.type";

// 🏠 សម្រាប់ Homepage - យក brands មកបង្ហាញ
export async function getBrands(limit: number = 8): Promise<Brand[]> {
    try {
        const brands = await apiServerService.get<Brand[]>("/brands/homepage", {
            cacheTime: 3600, // 1 hour
        }) ?? [];
        
        return brands.slice(0, limit);
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
}


export async function getBrandBySlug(slug: string): Promise<Brand | null> {
    try {
        const brand = await apiServerService.get<Brand>(`/brands/slug/${slug}`, {
            cacheTime: 3600,
        });
        return brand ?? null;
    } catch (error) {
        console.error(`Error fetching brand ${slug}:`, error);
        return null;
    }
}