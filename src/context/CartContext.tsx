import { useAuth } from "@/hooks/open/useAuth";
import { publicCartApi } from "@/lib/open/cart";
import { CartResponse, CheckoutRequest } from "@/types/open/cart.type";
import { CheckoutResponse } from "@/types/open/checkout";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

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
  loadCart: () => Promise<void>;
  isCartLoaded: boolean;
  refreshCount: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({
  children,
  initialCount = 0,
}: {
  children: React.ReactNode;
  initialCount?: number;
}) => {
  const [itemCount, setItemCount] = useState(initialCount);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const hasMerged = useRef(false);

  const refreshCount = useCallback(async () => {
    try {
      const count = await publicCartApi.getCartItemCount();
      setItemCount(count);
    } catch (error) {
      console.error("Failed to refresh count:", error);
    }
  }, []);

  const loadCart = useCallback(async () => {
    if (isCartLoaded) return;

    setLoading(true);
    try {
      const data = await publicCartApi.getCart();
      setCart(data);
      setItemCount(data.totalItems);
      setIsCartLoaded(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [isCartLoaded]);

  const refreshCart = useCallback(async () => {
    if (!isCartLoaded) return; 
    setLoading(true);
    try {
      const data = await publicCartApi.getCart();
      setCart(data);
      setItemCount(data.totalItems);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);



  // Merge cart after login
  useEffect(() => {
    if (isAuthenticated && user && isCartLoaded && !hasMerged.current) {
      const mergeCart = async () => {
        try {
          const mergedCart = await publicCartApi.mergeCart();
          setCart(mergedCart);
          setIsCartLoaded(true);
          setItemCount(mergedCart.totalItems); 
          hasMerged.current = true;
        } catch (error) {
          console.error("Failed to merge cart:", error);
        }
      };
      mergeCart();
    }
  }, [isAuthenticated, user, isCartLoaded]);

  // Add item to cart
  const addToCart = async (productId: number, quantity: number) => {
    if (!isCartLoaded) {
      await loadCart();
    }
    try {
      const updatedCart = await publicCartApi.addToCart({
        productId,
        quantity,
      });
      setCart(updatedCart);
      setItemCount(updatedCart.totalItems);
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
      setItemCount(updatedCart.totalItems);
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
      setItemCount(updatedCart.totalItems);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const checkout = async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    setLoading(true);
    try {
      const checkoutResponse = await publicCartApi.checkout(data);
      setCart(null);
      setIsCartLoaded(false);
      setItemCount(0);
      return checkoutResponse;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await publicCartApi.clearCart();
      setCart(null);
      setItemCount(0);
      setIsCartLoaded(false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getItemQuantity = useCallback(
    (productId: number) => {
      if (!cart?.items) return 0;
      return (
        cart?.items.find((item) => item.productId === productId)?.quantity || 0
      );
    },
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        loadCart,
        isCartLoaded,
        checkout,
        clearCart,
        getItemQuantity,
        refreshCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
