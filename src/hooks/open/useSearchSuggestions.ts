import { publicProductApi } from "@/lib/api/open/products";
import { ProductSuggestion } from "@/types/open/product.type";
import { useEffect, useState } from "react";

export const useSearchSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debounce
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
        setLoading(true);
        try{
            const results = await publicProductApi.getSuggestions(query);
            setSuggestions(results);
            setError(null);
        }catch(err){
            setError(err instanceof Error ? err : new Error("Failed to load suggestions"));
        }finally{
            setLoading(false);
        }
    });
    return () => clearTimeout(timer);
  }, [query]);

    return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
  };
};
