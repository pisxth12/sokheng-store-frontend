import "server-only";
import { apiServerService } from "../api/server";
import { TopCategory } from "@/types/open/category.type";
import { Category } from "@/types/open/product.type";
import { CategoryFilterParams } from "@/types/open/product-filter.type";

export async function getTopCategories(limit: number = 8): Promise<TopCategory[]> {
  try {
    const { data } = await apiServerService.get<TopCategory[]>("/categories/top", {
      cacheTime: 3600,
    });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getTopCategoryBySlug(slug: string) {
  try {
    const { data } = await apiServerService.get<TopCategory>(
      `/categories/slug/${slug}`,
      { cacheTime: 3600 }
    );
    return data ?? null;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
}

export async function getCategoryNames(): Promise<Category[]> {
  try {
    const { data } = await apiServerService.get<Category[]>("/categories/name", {
      cacheTime: 3600, 
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoriesByBrand(brandId: number): Promise<Category[]> {
  try {
    const { data } = await apiServerService.get<Category[]>(
      `/brands/${brandId}/categories`,
      { cacheTime: 3600 } 
    );
    return data ?? [];
  } catch (error) {
    console.error("Error fetching categories by brand:", error);
    return [];
  }
}

export async function getProductsByCategory(
  categorySlug: string,
  filters: CategoryFilterParams = {}
) {
  try {
    const params = new URLSearchParams();
    // Pagination
    params.set("page", (filters.page ?? 0).toString());
    params.set("size", (filters.size ?? 32).toString());
    // Optional filters
    if (filters.minPrice !== undefined) {
      params.set("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.set("maxPrice", filters.maxPrice.toString());
    }
    if (filters.brandId !== undefined) {
      params.set("brandId", filters.brandId.toString());
    }
    // Sorting
    if (filters.sortBy) {
      params.set("sortBy", filters.sortBy);
    }
    if (filters.sortOrder) {
      params.set("sortOrder", filters.sortOrder);
    }

    const { data } = await apiServerService.get(
      `/categories/${categorySlug}/products/filtered?${params.toString()}`,
      {
        cacheTime: 60, 
      }
    );
    return data;
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return null;
  }
}