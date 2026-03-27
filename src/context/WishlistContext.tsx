import { useAuth } from "@/hooks/open/useAuth";
import { publicWishlistApi } from "@/lib/open/wishlist";
import { WishlistItem } from "@/types/open/wishlist.types";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  loading: boolean;
  error: string | null;
  addItem: (productId: number) => Promise<boolean>;
  removeItem: (productId: number) => Promise<boolean>;
  checkItem: (productId: number) => Promise<boolean>;
  moveToCart: (productId: number, quantity?: number) => Promise<boolean>;
  toggleItem: (productId: number, inWishlist: boolean) => Promise<boolean>;
  refresh: () => Promise<void>;
  loadWishlist: () => Promise<void>;
  isLoaded: boolean;
}
export const WishlistContext = createContext<WishlistContextType | null>(null);

export default function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false); 

  const hasLoadedRef = useRef(false);
  const route = useRouter();


  const loadWishlist = useCallback(async (force: boolean = false) => {
    if (!force && hasLoadedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const res = await publicWishlistApi.getAll();
      setItems(res.items);
      setCount(res.totalItems);
      setIsLoaded(true);
      hasLoadedRef.current = true;
    } catch (error) {
      setError("Failed to fetch wishlist");
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  },[]);

 


  // Add item
  const addItem = useCallback(async (productId: number): Promise<boolean> => {
    setError(null);
    try {
       await publicWishlistApi.add(productId);
       route.refresh();
       return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add item to wishlist",
      );
      console.error(err);
      return false;
    }
  }, []);

  //Remove item
  const removeItem = useCallback(
    async (productId: number): Promise<boolean> => {
      setError(null);
      try {
         const res = await publicWishlistApi.remove(productId);
         setItems(res.items);
         setCount(res.totalItems);
         route.refresh();
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to remove item from wishlist",
        );
        console.error(err);
        return false;
      }
    },
    [],
  );

  // Check if in wishlist
  const checkItem = useCallback(async (productId: number): Promise<boolean> => {
    try {
      const res = await publicWishlistApi.check(productId);
      return res;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to check item in wishlist",
      );
      console.error(err);
      return false;
    }
  }, []);

  // Move to cart (with default quantity = 1)
  const moveToCart = useCallback(
    async (productId: number, quantity: number = 1): Promise<boolean> => {
      setError(null);
      try {
       await publicWishlistApi.moveToCart(productId, quantity);
        route.refresh();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to move item to cart",
        );
        console.error(err);
        return false;
      }
    },
    [route],
  );

  // Toggle wishlist
  const toggleItem = useCallback(
    async (productId: number, isInWishlist: boolean): Promise<boolean> => {
      if (isInWishlist) {
        return removeItem(productId);
      } else {
        return addItem(productId);
      }
    },
    [addItem, removeItem],
  );



  const refresh = useCallback( async () => {
    hasLoadedRef.current = false;
    setIsLoaded(false);
    await loadWishlist();
  },[loadWishlist]);


  const value = {
    items,
    count,
    loading,
    error,
    addItem,
    removeItem,
    checkItem,
    moveToCart,
    toggleItem,
    refresh,
    loadWishlist,
    isLoaded,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
