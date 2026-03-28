
"use server";

import { revalidatePath } from "next/cache";
import { apiServerService } from "@/lib/api/server";
import { CartResponse, UpdateCartItemRequest, AddToCartRequest, CheckoutRequest } from "@/types/open/cart.type";
import { CheckoutResponse } from "@/types/open/checkout";
import { getCart } from "@/lib/services/cart.server";
import { forwardSessionCookie } from "@/hooks/utils/cookie";





export async function addToCart(
  productId: number, 
  quantity: number
): Promise<CartResponse> {
  try {
 
    const data: AddToCartRequest = { productId, quantity };
 
    const  { data: response, cookie } = await apiServerService.post<CartResponse>(
      "/cart/add",
      data
    );
    
    revalidatePath("/cart");
    revalidatePath("/products");

    await forwardSessionCookie(cookie ?? null);
    return response;
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

    
    const { data: updatedCart , cookie} = await apiServerService.put<CartResponse>(
      `/cart/update/${itemId}`,
    );
    
    await forwardSessionCookie(cookie ?? null);
    revalidatePath("/cart");
    return updatedCart;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw new Error("Failed to update cart");
  }
}

export async function removeCartItem(itemId: number): Promise<CartResponse> {
  try {

     const { data: resp, cookie } = await apiServerService.delete<CartResponse>(
      `/cart/${itemId}`  
    );
    
    await forwardSessionCookie(cookie ?? null);
    revalidatePath("/cart");
    return resp;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw new Error("Failed to remove item");
  }
}

export async function checkout(
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  try {  
    const { data: response , cookie} = await apiServerService.post<CheckoutResponse>(
      "/cart/checkout",
      data);
      
    await forwardSessionCookie(cookie ?? null)

    
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
