import { publicProductApi } from "@/lib/open/products";
import { ProductSuggestion } from "@/types/open/product.type";
import { useEffect, useRef, useState } from "react";

export const useSearchSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  // Debounce
  useEffect(() => {

    if(timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

     setLoading(true);


    
    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await publicProductApi.getSuggestions(query);
        setSuggestions(results);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load suggestions"),
        );
      } finally {
        setLoading(false);
      }
    }, 500);{
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
  };
};
