"use server"
import { apiServerService } from "@/lib/api/server";
import { CartResponse } from "@/types/open/cart.type";
import { WishlistResponse } from "@/types/open/wishlist.types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getWishlist(): Promise<WishlistResponse | null> {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const sessionId = cookieStore.get("wishlistSessionId")?.value;

        const options = token ? { token } : { sessionId };
        return await apiServerService.get<WishlistResponse>("/wishlist", options);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return null;
    }
}

export async function addToWishlist(productId: number): Promise<WishlistResponse> {
    try {
           const cookieStore = await cookies();
           const token = cookieStore.get("token")?.value;
           const sessionId = cookieStore.get("JSESSIONID")?.value;
        
           const options = token ? { token } : { sessionId };

            const updatedWishlist = await apiServerService.post<WishlistResponse>(
                `/wishlist/add/${productId}`,
                {},
                options
                );
                revalidatePath("/wishlist");
            return updatedWishlist;
    }catch (error) {
        console.error("Error adding to wishlist:", error);
        throw new Error("Failed to add to wishlist");
    }
}

export async function removeFromWishlist(productId: number): Promise<WishlistResponse> {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const sessionId = cookieStore.get("JSESSIONID")?.value;
     
        const options = token ? { token } : { sessionId };
    
            const updatedWishlist = await apiServerService.delete<WishlistResponse>(
            `/wishlist/remove/${productId}`,
            options
            );
            
            revalidatePath("/wishlist");
 
            return updatedWishlist;
    }catch (error) {
        console.error("Error removing from wishlist:", error);
        throw new Error("Failed to remove from wishlist");
    }
}

export async function moveToCartFromWishlist(
  productId: number, 
  quantity: number = 1
): Promise<{ wishlist: WishlistResponse; cart: CartResponse }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("JSESSIONID")?.value;
    
    const options = token ? { token } : { sessionId };
    
    const wishlist = await apiServerService.post<WishlistResponse>(
      `/wishlist/move-to-cart/${productId}?quantity=${quantity}`,
      {},
      options
    );
    
    const cart = await apiServerService.get<CartResponse>("/cart", options);
    
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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("JSESSIONID")?.value;
    
    const options = token ? { token } : { sessionId };
    
    return await apiServerService.get<boolean>(
      `/wishlist/check/${productId}`,
      options
    );
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
}

export async function getWishlistCount(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("token")?.value;
    
    const options = token ? { token } : { sessionId };
    
    const count = await apiServerService.get<number>("/wishlist/count", options);
    return count ?? 0;
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return 0;
  }
}

export async function clearWishlist(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("JSESSIONID")?.value;
    
    const options = token ? { token } : { sessionId };
    
    await apiServerService.delete("/wishlist/clear", options);
    
    revalidatePath("/wishlist");
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    throw new Error("Failed to clear wishlist");
  }
}

