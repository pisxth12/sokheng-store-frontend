import { adminUserApi } from "@/lib/admin/user";
import {
  PageResponse,
  User,
  UserFilters,
  UserListResponse,
  UserStats,
} from "@/types/admin/user.type";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useUsers = (initialFilters?: UserFilters) => {
  const [users, setUsers] = useState<UserListResponse[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    totalPage: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  });
  const [filters, setFilters] = useState<UserFilters>(initialFilters || {});
  const router = useRouter();

  const fetchStats = useCallback( async() => {
    setStatsLoading(true);
    setError(null);
    try {
      const data = await adminUserApi.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user stats");
    } finally {
      setStatsLoading(false);
    }
  },[])

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response: PageResponse<UserListResponse>;
      if (filters.search) {
        response = await adminUserApi.searchUsers(filters.search, filters);
      } else {
        response = await adminUserApi.getAllUsers(filters);
      }
      setUsers(response.content);
      setPagination({
        totalPage: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number,
        pageSize: response.size,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch user by ID
  const fetchUserById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminUserApi.getUserById(id);
      setUser(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  //Delete user
  const deleteUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await adminUserApi.deleteUser(id);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  }, []);

  //Update filters
  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));
  }, []);

  //Change page

  const changePage = useCallback((page: number) => {
  setFilters((prev) => ({ ...prev, page }));
}, []);


  //Change page size
 const changePageSize = useCallback((size: number) => {
  setFilters((prev) => ({ ...prev, size, page: 0 }));
}, []);

  //Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  //Refresh data
  const refresh = useCallback(() => {
    if (
      window.location.pathname.includes("/admin/users/") &&
      window.location.pathname !== "/admin/users"
    ) {
      const id = parseInt(window.location.pathname.split("/").pop() || "0");
      if (id) fetchUserById(id);
    } else {
      fetchUsers();
    }
  }, [fetchUsers, fetchUserById]);

  useEffect(() => {
    if (window.location.pathname === "/admin/users") {
      Promise.all([fetchUsers(), fetchStats()]);
    }
  }, [fetchUsers]);

  return {
    users,
    user,
    stats,
    statsLoading,
    loading,
    error,
    pagination,
    filters,
    fetchUsers,
    fetchUserById,
    deleteUser,
    updateFilters,
    changePage,
    changePageSize,
    clearFilters,
    refresh,
    goToDetails: (id: number) => router.push(`/admin/users/${id}`),
  };
};
