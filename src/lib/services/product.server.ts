import "server-only";
import { apiServerService } from "../api/server";
import { Product } from "@/types/open/product.type";

export async function getFeaturedProducts() {
  try {
    return (
      (await apiServerService.get<Product[]>("/products/featured", {
        cacheTime: 300, // 5 minite
      })) ?? []
    );
  } catch {
    return [];
  }
}
