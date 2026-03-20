import "server-only";
import { apiServerService } from "../api/server";
import { TopCategory, TopCategoryResponse } from "@/types/open/category.type";

export async function getTopCategories(limit: number = 8): Promise<TopCategory[]>{
  try {
    return (
      (await apiServerService.get<TopCategory[]>("/categories/top", {
        cacheTime: 3600,
      })) ?? []
    );
  } catch {
    return [];
  }
}
export async function getTopCategoryBySlug(slug: string) {
  try {
    const category = await apiServerService.get<TopCategory>(
      `/categories/slug/${slug}`,
      { cacheTime: 3600 }
    );
    
    return category ?? null;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }

}

