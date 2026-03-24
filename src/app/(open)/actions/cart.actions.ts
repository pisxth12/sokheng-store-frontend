
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { apiServerService } from "@/lib/api/server";
import { CartResponse, UpdateCartItemRequest, AddToCartRequest, CheckoutRequest } from "@/types/open/cart.type";
import { CheckoutResponse } from "@/types/open/checkout";
import { getCart } from "@/lib/services/cart.server";


export async function addToCart(
  productId: number, 
  quantity: number
): Promise<CartResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("cartSessionId")?.value;
    
    const data: AddToCartRequest = { productId, quantity };
    const options = token ? { token, ...data } : { sessionId, ...data };
    
    
    const updatedCart = await apiServerService.post<CartResponse>(
      "/cart/add",
      data,
      options
    );
    
    revalidatePath("/cart");
    return updatedCart;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Failed to add to cart");
  }
}

export async function updateCartItem(
  itemId: number,
  quantity: number
): Promise<CartResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("cartSessionId")?.value;
    
    const data: UpdateCartItemRequest = { quantity };
    

    const options = token 
      ? { token, ...data } 
      : { sessionId, ...data };
    
    const updatedCart = await apiServerService.put<CartResponse>(
      `/cart/update/${itemId}`,
      options
    );
    
    revalidatePath("/cart");
    return updatedCart;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw new Error("Failed to update cart");
  }
}

export async function removeCartItem(itemId: number): Promise<CartResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("cartSessionId")?.value;
    
    const data: UpdateCartItemRequest = { quantity: 0 };
    
    
    const options = token 
      ? { token, ...data } 
      : { sessionId, ...data };
    
    const updatedCart = await apiServerService.put<CartResponse>(
      `/cart/update/${itemId}`,
      options
    );
    
    revalidatePath("/cart");
    return updatedCart;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw new Error("Failed to remove item");
  }
}

export async function checkout(
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("cartSessionId")?.value;
    
    const options = token ? { token } : { sessionId };
    
    
    const response = await apiServerService.post<CheckoutResponse>(
      "/cart/checkout",
      data,
      options
    );
    
    revalidatePath("/cart");
    revalidatePath("/checkout");
    return response;
  } catch (error) {
    console.error("Error during checkout:", error);
    throw new Error("Failed to checkout");
  }
}


export async function refreshCartAction(){
  return await getCart();
}