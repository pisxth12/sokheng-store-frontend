
import { WishlistContext } from "@/context/WishlistContext";
import { useContext } from "react";

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
      throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}