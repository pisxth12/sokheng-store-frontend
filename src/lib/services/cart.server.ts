import "server-only";
import { CartResponse } from "@/types/open/cart.type";
import { apiServerService } from "../api/server";
import { cookies } from "next/headers";
  

export async function getCartCountForUser(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await apiServerService.get<number>("/cart/count", { token });
    return response ?? 0;
  } catch (error) {
    console.error("Error fetching cart count for user:", error);
    return 0;
  }
}

export async function getCartCountForGuest(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cartSessionId")?.value;
    const response = await apiServerService.get<number>("/cart/count", { sessionId });
    return response ?? 0;
  } catch (error) {
    console.error("Error fetching cart count for guest:", error);
    return 0;
  }
}


export async function getCart(): Promise<CartResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("cartSessionId")?.value;

    const isAuthenticated = !!token;
    if (!isAuthenticated && !sessionId) {
      return null;
    }

    const options = token ? { token } : { sessionId }
   
    
    return await apiServerService.get<CartResponse>("/cart", options);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}


export async function getCartCount(): Promise<number> {
  try {

    const cookieStore = await cookies();
    
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("cartSessionId")?.value;
     if (!token && !sessionId) {
      return 0;
    }
    const options = token ? { token } : { sessionId };
    const count = await apiServerService.get<number>("/cart/count", options);
    return count ?? 0;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return 0;
  }
}