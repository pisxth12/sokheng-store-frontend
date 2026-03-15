import { publicProductApi } from "@/lib/open/products";
import { Product, ProductDetail } from "@/types/open/product.type";
import { useEffect, useState } from "react";

export const useProductDetail = (slug: string) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    if (!slug) return;
    setLoading(true);
    setError("");
    try {
      const data = await publicProductApi.getProductBySlug(slug);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [slug]);

  return { product, loading, error, fetchProduct };
};
