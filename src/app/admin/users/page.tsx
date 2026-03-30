"use client"

import DeleteUserDialog from "@/components/admin/users/DeleteUserDialog";
import UserCards from "@/components/admin/users/UserCards";
import UserFilters from "@/components/admin/users/UserFilters";
import UserTable from "@/components/admin/users/UserTable";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useUsers } from "@/hooks/admin/useUsers"
import { Loader2, UserPlus, LayoutGrid, Table as TableIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UsersPage() {
  const {
    users,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    changePageSize,
    deleteUser,
    refresh,
    clearFilters
  } = useUsers();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  if (error) {
    return (
     <LoadingSpinner/>
    );
  }  

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteUser(deleteId);
        setDeleteId(null);
      } catch(error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-light text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage customer accounts</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors ${
                viewMode === 'table' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 transition-colors ${
                viewMode === 'card' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
 
        </div>
      </div>

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClear={clearFilters}
      />

      {/* Users Table/Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <UserTable
              users={users}
          
              pagination={{
                currentPage: pagination.currentPage,
                pageSize: pagination.pageSize,
                totalElements: pagination.totalElements,
                totalPages: pagination.totalPage,
              }}
              onPageChange={changePage}
              onPageSizeChange={changePageSize}
            />
          ) : (
            <UserCards
              users={users}
              pagination={{
                currentPage: pagination.currentPage,
                pageSize: pagination.pageSize,
                totalElements: pagination.totalElements,
                totalPages: pagination.totalPage,
              }}
              onPageChange={changePage}
              onPageSizeChange={changePageSize}
            />
          )}
        </>
      )}

      {/* Delete Dialog */}
      <DeleteUserDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        userName={deleteName || ''}
      />
    </div>
  );
}