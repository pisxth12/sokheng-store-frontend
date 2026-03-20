// lib/api/product.server.ts
import "server-only";
import { apiServerService } from "../api/server";
import { Product } from "@/types/open/product.type";

export async function getFeaturedProducts(): Promise<Product[]>{
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
