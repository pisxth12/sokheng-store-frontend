import { adminBrandApi } from "@/lib/admin/brand";
import { Brand, BrandStats } from "@/types/admin/brand.type";
import { useCallback, useEffect, useState } from "react";

interface BrandState {
  // Data
  brands: Brand[];
  stats: BrandStats | null;
  statsLoading: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  clearError: () => void;
  success: boolean;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  resetSearch: () => void;
  searchBrands: (query: string, page?: number) => Promise<void>;

  // Sorting
  sortBy: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;

  // Actions
  fetchBrands: (page?: number) => Promise<void>;
  createBrand: (data: FormData) => Promise<void>;
  updateBrand: (id: number, data: FormData) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
  addCategories: (brandId: number, categoryIds: number[]) => Promise<void>;
  removeCategories: (brandId: number, categoryIds: number[]) => Promise<void>;
  refresh: () => void;
}

export const useBrand = (): BrandState => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stats, setStats] = useState<BrandStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchStats = useCallback(async () => {
    setError(null);
    try {
      const response = await adminBrandApi.getStats();
      setStats(response);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch brand statistics";
      setError(errorMessage);
      console.error("Stats fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const fetchBrands = useCallback(
    async (page = currentPage) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminBrandApi.getAll(
          page,
          pageSize,
          sortBy,
          sortDirection,
        );
        setBrands(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
        setCurrentPage(page);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch brands";
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, sortBy, sortDirection],
  );

  const searchBrands = useCallback(
    async (query: string, page = 0) => {
      if (!query.trim()) {
        setSearchQuery("");
        fetchBrands(page);
        return;
      }
      setIsSearching(true);
      setError(null);
      try {
        const response = await adminBrandApi.search(query, page, pageSize);
        setBrands(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
        setCurrentPage(response.number || 0);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to search brands";
        setError(errorMessage);
      } finally {
        setIsSearching(false);
      }
    },
    [pageSize, fetchBrands],
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        if (isSearching && searchQuery) {
          searchBrands(searchQuery, page);
        } else {
          fetchBrands(page);
        }
      }
    },
    [totalPages, isSearching, searchQuery, searchBrands, fetchBrands],
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const resetSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    fetchBrands(0);
  }, [fetchBrands]);

  const handleSort = useCallback((field: string) => {
    setSortBy((prev) => {
      if (prev === field) {
        setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
        return prev;
      } else {
        setSortDirection("asc");
        return field;
      }
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const refresh = useCallback(() => {
    if (isSearching && searchQuery) {
      searchBrands(searchQuery, currentPage);
    } else {
      fetchBrands(currentPage);
    }
  }, [isSearching, searchQuery, currentPage, searchBrands, fetchBrands]);

  // ============= CRUD ACTIONS =============
  const createBrand = useCallback(
    async (data: FormData) => {
      setError(null);
      setSaving(true);
      setSuccess(false);
      try {
        await adminBrandApi.create(data);
        await fetchBrands(0);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Failed to create brand";
        setError(errorMessage);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [fetchBrands],
  );

  const updateBrand = useCallback(
    async (id: number, data: FormData) => {
      setError(null);
      setSaving(true);
      setSuccess(false);
      try {
        await adminBrandApi.update(id, data);
        await fetchBrands(currentPage);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Failed to update brand";
        setError(errorMessage);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [fetchBrands, currentPage],
  );

  const deleteBrand = useCallback(
    async (id: number) => {
      setError(null);
      setSaving(true);
      setSuccess(false);
      try {
        await adminBrandApi.delete(id);
        await fetchBrands(currentPage);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Failed to delete brand";
        setError(errorMessage);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [fetchBrands, currentPage],
  );

  const toggleStatus = useCallback(
    async (id: number) => {
      setError(null);
      setSaving(true);
      setSuccess(false);
      try {
        await adminBrandApi.toggleStatus(id);
        await fetchBrands(currentPage);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Failed to toggle status";
        setError(errorMessage);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [fetchBrands, currentPage],
  );

  const addCategories = useCallback(
    async (brandId: number, categoryIds: number[]) => {
      setError(null);
      setSaving(true);
      try {
        await adminBrandApi.addCategories(brandId, categoryIds);
        await fetchBrands(currentPage);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to add categories";
        setError(errorMessage);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [fetchBrands, currentPage],
  );

  const removeCategories = useCallback(
    async (brandId: number, categoryIds: number[]) => {
      setError(null);
      setSaving(true);
      try {
        await adminBrandApi.removeCategories(brandId, categoryIds);
        await fetchBrands(currentPage);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to remove categories";
        setError(errorMessage);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [fetchBrands, currentPage],
  );

  // ============= EFFECTS =============
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    // Data
    brands,
    stats,
    statsLoading,
    loading,
    saving,
    error,
    clearError,
    success,

    // Pagination
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    setPageSize,
    goToPage,
    nextPage,
    prevPage,

    // Search
    searchQuery,
    setSearchQuery,
    isSearching,
    resetSearch,
    searchBrands,

    // Sorting
    sortBy,
    sortDirection,
    handleSort,

    // Actions
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    toggleStatus,
    addCategories,
    removeCategories,

    refresh,
  };
};
