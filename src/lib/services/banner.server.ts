import "server-only";
import { apiServerService } from "../api/server";
import { Banner } from "@/types/open/banner.type";

export async function getBanners(): Promise<Banner[]>{
  try {
    const { data: banners } = await apiServerService.get<Banner[]>("/banners", {
      cacheTime: 3600,
    });
    return banners;
  } catch {
    return [];
  }
}
