import "server-only";
import { apiServerService } from "../api/server";
import { TopCategory } from "@/types/open/category.type";

export async function getTopCategories(limit: number = 8) {
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
