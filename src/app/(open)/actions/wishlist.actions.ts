"use server";

import { apiServerService } from "@/lib/api/server";
import { CartResponse } from "@/types/open/cart.type";
import { WishlistResponse } from "@/types/open/wishlist.types";
import { revalidatePath } from "next/cache";
import { forwardSessionCookie } from "@/hooks/utils/cookie";

export async function getWishlist(): Promise<WishlistResponse | null> {
  try {
    const { data } = await apiServerService.get<WishlistResponse>("/wishlist");
    return data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return null;
  }
}

export async function addToWishlist(productId: number): Promise<WishlistResponse> {
  try {
    const { data, cookie } = await apiServerService.post<WishlistResponse>(
      `/wishlist/add/${productId}`,
      {}
    );
    await forwardSessionCookie(cookie ?? null);
    revalidatePath("/wishlist");
    return data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add to wishlist");
  }
}

export async function removeFromWishlist(productId: number): Promise<WishlistResponse> {
  try {
    const { data, cookie } = await apiServerService.delete<WishlistResponse>(
      `/wishlist/remove/${productId}`
    );
    await forwardSessionCookie(cookie ?? null);
    revalidatePath("/wishlist");
    return data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove from wishlist");
  }
}

export async function moveToCartFromWishlist(
  productId: number,
  quantity: number = 1
): Promise<{ wishlist: WishlistResponse; cart: CartResponse }> {
  try {
    const { data: wishlist, cookie: wishlistCookie } = await apiServerService.post<WishlistResponse>(
      `/wishlist/move-to-cart/${productId}?quantity=${quantity}`,
      {}
    );
    
    const { data: cart, cookie: cartCookie } = await apiServerService.get<CartResponse>("/cart");
    
    await forwardSessionCookie(wishlistCookie ?? null);
    await forwardSessionCookie(cartCookie ?? null);

    revalidatePath("/wishlist");
    revalidatePath("/cart");
    
    return { wishlist, cart };
  } catch (error) {
    console.error("Error moving to cart:", error);
    throw new Error("Failed to move to cart");
  }
}

export async function isInWishlist(productId: number): Promise<boolean> {
  try {
    const { data } = await apiServerService.get<boolean>(`/wishlist/check/${productId}`);
    return data ?? false;
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
}

export async function getWishlistCount(): Promise<number> {
  try {
    const { data } = await apiServerService.get<number>("/wishlist/count");
    return data ?? 0;
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return 0;
  }
}

export async function clearWishlist(): Promise<void> {
  try {
    const { cookie } = await apiServerService.delete("/wishlist/clear");
    await forwardSessionCookie(cookie ?? null);
    revalidatePath("/wishlist");
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    throw new Error("Failed to clear wishlist");
  }
}