import "server-only";
import { CartResponse } from "@/types/open/cart.type";
import { apiServerService } from "../api/server";

export async function getCartCountForUser(): Promise<number> {
  try {
    const { data } = await apiServerService.get<number>("/cart/count");
    return data ?? 0;
  } catch (error) {
    console.error("Error fetching cart count for user:", error);
    return 0;
  }
}

export async function getCartCountForGuest(): Promise<number> {
  try {
    const { data } = await apiServerService.get<number>("/cart/count");
    return data ?? 0;
  } catch (error) {
    console.error("Error fetching cart count for guest:", error);
    return 0;
  }
}

export async function getCart(): Promise<CartResponse | null> {
  try {
    const { data } = await apiServerService.get<CartResponse>("/cart");
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function getCartCount(): Promise<number> {
  try {
    const { data } = await apiServerService.get<number>("/cart/count");
    return data ?? 0;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return 0;
  }
}