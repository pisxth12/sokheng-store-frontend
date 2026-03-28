// lib/api/brand.server.ts
import "server-only";

import { apiServerService } from "../api/server";
import type { Brand } from "@/types/open/brand.type";

export async function getBrands(limit: number = 8): Promise<Brand[]> {
    try {
        const { data } = await apiServerService.get<Brand[]>("/brands/homepage", {
            cacheTime: 3600, // 1 hour
        });
        
        return data?.slice(0, limit) ?? [];
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
    try {
        const { data } = await apiServerService.get<Brand>(`/brands/slug/${slug}`, {
            cacheTime: 3600,
        });
        return data ?? null;
    } catch (error) {
        console.error(`Error fetching brand ${slug}:`, error);
        return null;
    }
}

export async function getBrandNames(): Promise<Brand[]> {
  try {
    const { data } = await apiServerService.get<Brand[]>("/brands/name", {
      cacheTime: 3600,
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export async function getBrandsByCategory(categoryId: number): Promise<Brand[]> {
    try {
        const { data } = await apiServerService.get<Brand[]>(
            `/categories/${categoryId}/brands`,
            { cacheTime: 3600 }
        );
        return data ?? [];
    } catch (error) {
        console.error("Error fetching brands by category:", error);
        return [];
    }
}