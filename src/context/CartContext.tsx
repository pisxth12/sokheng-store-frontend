import { useAuth } from "@/hooks/open/useAuth";
import { publicCartApi } from "@/lib/api/open/cart";
import { CartResponse, CheckoutRequest } from "@/types/open/cart.type";
import { CheckoutResponse } from "@/types/open/checkout";
import { createContext, useCallback, useEffect, useState } from "react";

interface CartContextType {
  cart: CartResponse | null;
  loading: boolean;
  itemCount: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  checkout: (data: CheckoutRequest) => Promise<CheckoutResponse>;
  clearCart: () => Promise<void>;
  getItemQuantity: (productId: number) => number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await publicCartApi.getCart();
      setCart(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Merge cart after login
  useEffect(() => {
    if (isAuthenticated && user) {
      const mergeCart = async () => {
        try {
          const mergedCart = await publicCartApi.mergeCart();
          setCart(mergedCart);
        } catch (error) {
          console.error("Failed to merge cart:", error);
        }
      };
      mergeCart();
    }
  }, [isAuthenticated, user]);

  // Add item to cart
  const addToCart = async (productId: number, quantity: number) => {
    try {
      const updatedCart = await publicCartApi.addToCart({
        productId,
        quantity,
      });
      setCart(updatedCart);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const updatedCart = await publicCartApi.updateCartItem(itemId, {
        quantity,
      });
      setCart(updatedCart);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Remove item  (set quantity to 0)
  const removeItem = async (itemId: number) => {
    try {
      const updatedCart = await publicCartApi.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const checkout = async(data: CheckoutRequest): Promise<CheckoutResponse> => {
    setLoading(true);
    try {
      const checkoutResponse = await publicCartApi.checkout(data);
      setCart(null);
      return checkoutResponse;
    } catch (error) {
      console.log(error);
      throw error;
    }
    finally {
      setLoading(false);
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    try {
      await publicCartApi.clearCart();
      setCart(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getItemQuantity = useCallback((productId: number) => {
    if (!cart?.items) return 0;
    return cart?.items.find((item) => item.productId === productId)?.quantity || 0;
  },[cart]);




  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        itemCount: cart?.totalItems || 0,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        checkout,
        clearCart,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

