"use client"

import DeleteUserDialog from "@/components/admin/users/DeleteUserDialog";
import UserCards from "@/components/admin/users/UserCards";
import UserFilters from "@/components/admin/users/UserFilters";
import UserStatsCard from "@/components/admin/users/UserStatsCard";
import UserTable from "@/components/admin/users/UserTable";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useUsers } from "@/hooks/admin/useUsers"
import { Loader2, UserPlus, LayoutGrid, Table as TableIcon, BadgeCheck, Mail, Users, Phone, User, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const {
    users,
    stats,
    statsLoading, 
    pagination,
    filters,
    updateFilters,
    changePage,
    changePageSize,
    deleteUser,
    clearFilters
  } = useUsers();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');


 useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 1200) setViewMode('card'); // md+ => card
    else setViewMode('table'); // mobile => table
  }

  handleResize(); // initial check
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


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
    <div className="p-8"  
    >
     <UserStatsCard stats={stats} loading={statsLoading} />
      {/* Header */}
      <div className="flex justify-between md:justify-start items-center mb-8 flex-col">
     
        <div className="flex items-center gap-3  justify-end w-full mt-4 md:mt-0">
          <div>
            <UserFilters
              filters={filters}
              onFilterChange={updateFilters}
              onClear={clearFilters}
            />
          </div>
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