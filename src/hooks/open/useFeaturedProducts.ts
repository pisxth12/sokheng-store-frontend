"use client";
import { publicProductApi } from "@/lib/open/products";
import { Product } from "@/types/open/product.type";
import { useCallback, useEffect, useRef, useState } from "react";

export const useFeatureProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  const fetchFeaturedProducts = useCallback(async (retry = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setError("");
    if (!retry) {
      setLoading(true);
    }
    setError("");
    try {
      const data = await publicProductApi.getFeatured({
        signal: abortControllerRef.current.signal,
      });
      setProducts(data);
      retryCountRef.current = 0;
    } catch (err: any) {
      if (err.name === "AbortError") return;
      if (retryCountRef.current < 3) {
        retryCountRef.current++;
        setTimeout(
          () => fetchFeaturedProducts(true),
          1000 * retryCountRef.current,
        );
      } else {
        setError("Failed to load featured products");
      }
    } finally {
      if (!retry) {
        setLoading(false);
      }
    }
  }, []);
  useEffect(() => {
    fetchFeaturedProducts();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchFeaturedProducts]);

  return { products, loading, error, refetch: fetchFeaturedProducts };
};
