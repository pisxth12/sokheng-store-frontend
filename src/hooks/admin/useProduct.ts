import { adminProductApi } from "@/lib/api/admin/product";
import { Product } from "@/types/product.type";
import { useCallback, useEffect, useState } from "react";
import { adminProductImage } from "./productImage";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchProducts = useCallback(
    async (page = currentPage) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminProductApi.getAll(page, pageSize);
        setProducts(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
        setCurrentPage(response.number || 0);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch products";
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize],
  );

  const searchProducts = useCallback(
    async (query: string, page = 0) => {
      if (!query.trim()) {
        setSearchQuery("");
        fetchProducts(0);
        return;
      }
      setError(null);
      setIsSearching(true);
      setLoading(true);
      setSearchQuery(query);
      try {
        const response = await adminProductApi.search(query, page, pageSize);
        setProducts(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
        setCurrentPage(response.number || 0);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to search products";
        setError(errorMessage);
        console.error("Search error:", err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [pageSize, fetchProducts],
  );

  // Create Product
  const createProduct = useCallback(
    async (data: FormData) => {
      setError(null);
      setSaving(true);
      setSuccess(false);
      try {
        await adminProductApi.create(data);
        await fetchProducts(0);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to create product");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [fetchProducts],
  );

  // Update Product
  const updateProduct = useCallback(
    async (id: number, data: FormData) => {
      setSaving(true);
      setError(null);
      setSuccess(false); // ✅ FIXED
      try {
        await adminProductApi.update(id, data);
        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage);
        } else {
          await fetchProducts(currentPage);
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to update product");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [isSearching, searchQuery, currentPage, searchProducts, fetchProducts],
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      if (!confirm("Are you sure you want to delete this product?")) return;

      setSaving(true);
      setError(null);
      try {
        await adminProductApi.delete(id);
        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage);
        } else {
          await fetchProducts(currentPage);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to delete product");
      } finally {
        setSaving(false);
      }
    },
    [isSearching, searchQuery, currentPage, searchProducts, fetchProducts],
  );

  const clearDicountPrice = useCallback( async(productId: number) => {
      setError(null);
      setLoading(true);
      try{
          await adminProductApi.clearDiscount(productId);
          if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage);
        } else {
          await fetchProducts(currentPage);
        }
      }catch(err: any){
        setError(err?.response?.data?.message || "Failed to delete product");
      }finally{
        setLoading(false);
      }

  },[])

  const toggleStatus = useCallback(
    async (id: number) => {
      setSaving(true);
      setError(null);
      try {
        await adminProductApi.toggleStatus(id); 
        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage);
        } else {
          await fetchProducts(currentPage);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to toggle status");
      } finally {
        setSaving(false);
      }
    },
    [isSearching, searchQuery, currentPage, searchProducts, fetchProducts],
  );

  const toggleFeatured = useCallback(
    async (id: number) => {
      setSaving(true);
      setError(null);
      try {
        await adminProductApi.toggleFeatured(id);
        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage);
        } else {
          await fetchProducts(currentPage);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to toggle featured");
      } finally {
        setSaving(false);
      }
    },
    [isSearching, searchQuery, currentPage, searchProducts, fetchProducts],
  );

  const toggleMainImage = useCallback(
    async (productId: number, imageId: number) => {
      setSaving(true);
      setError(null);
      try {
        await adminProductImage.toggleMain(productId, imageId);
        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage);
        } else {
          await fetchProducts(currentPage);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to toggle main image");
      } finally {
        setSaving(false); // ✅ ADDED
      }
    },
    [isSearching, searchQuery, currentPage, searchProducts, fetchProducts],
  );

  const deleteImage = useCallback(
    async (productId: number, imageId: number) => {
      setSaving(true);
      setError(null);
      try {
        await adminProductImage.delete(productId, imageId);

        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage);
        } else {
          await fetchProducts(currentPage);
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to delete image");
      } finally {
        setSaving(false);
      }
    },
    [isSearching, searchQuery, currentPage, searchProducts, fetchProducts],
  );

  const reorderImages = useCallback(
    async (productId: number, imageIds: number[]) => {
      setSaving(true);
      setError(null);
      try {
        await adminProductImage.reorder(productId, imageIds);
        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage);
        } else {
          await fetchProducts(currentPage);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to reorder images");
      } finally {
        setSaving(false);
      }
    },
    [isSearching, searchQuery, currentPage, searchProducts, fetchProducts],
  );

  const updateImageAltText = useCallback(
    async (productId: number, imageId: number, altText: string) => {
      setSaving(true);
      setError(null);
      try {
        await adminProductImage.updateAltText(productId, imageId, altText);
        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, currentPage); // ✅ Added await
        } else {
          await fetchProducts(currentPage); // ✅ Added await
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to update image alt text");
      } finally {
        setSaving(false);
      }
    },
    [isSearching, searchQuery, currentPage, searchProducts, fetchProducts], // ✅ Added deps
  );

  const goToPage = useCallback(
    async (page: number) => {
      if (page >= 0 && page < totalPages) {
        if (isSearching && searchQuery) {
          await searchProducts(searchQuery, page);
        } else {
          await fetchProducts(page);
        }
      }
    },
    [isSearching, searchQuery, totalPages, searchProducts, fetchProducts],
  );

  const resetSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    fetchProducts(0);
  }, [fetchProducts]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchProducts(0);
  }, [fetchProducts]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);

  const refresh = useCallback(() => {
    if (isSearching && searchQuery) {
      searchProducts(searchQuery, currentPage);
    } else {
      fetchProducts(currentPage);
    }
  }, [isSearching, searchQuery, currentPage, searchProducts, fetchProducts]);

  return {
    // Data
    products,
    loading,
    error,
    saving,
    success,

    // Pagination
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    goToPage,
    nextPage,
    prevPage,

    // Search
    searchQuery,
    isSearching,
    resetSearch,
    searchProducts,

    // Actions
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStatus,
    toggleFeatured,

    // Image
    toggleMainImage,
    deleteImage,
    reorderImages,
    updateImageAltText,
    clearDicountPrice,

    // Refresh
    refresh,
    clearError,
  };
};