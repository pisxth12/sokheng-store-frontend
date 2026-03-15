import { publicWishlistApi } from "@/lib/open/wishlist";
import { WishlistItem } from "@/types/open/wishlist.types";
import { createContext, useCallback, useEffect, useState } from "react";

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

  //
  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await publicWishlistApi.getAll();
      setItems(res.items);
      setCount(res.totalItems);
    } catch (error) {
      setError("Failed to fetch wishlist");
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item
  const addItem = useCallback(async (productId: number): Promise<boolean> => {
    setError(null);
    try {
      const res = await publicWishlistApi.add(productId);
      setItems(res.items);
      setCount(res.totalItems);
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
        const res = await publicWishlistApi.moveToCart(productId, quantity);
        setItems(res.items);
        setCount(res.totalItems);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to move item to cart",
        );
        console.error(err);
        return false;
      }
    },
    [],
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

  // Load on mount
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

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
    refresh: fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
