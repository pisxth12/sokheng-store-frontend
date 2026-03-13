import { UserListResponse } from "@/types/admin/user.type";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  users: UserListResponse[];
  onDelete: (id: number, name: string) => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function UserCards({
  users,
  onDelete,
  pagination,
  onPageChange,
  onPageSizeChange,
}: Props) {
  if (users.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-12 text-center text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            {/* Avatar & Role */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-sm">{user.name}</h3>
                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {user.role}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-1 mb-3 text-sm">
              <p className="text-gray-600 truncate">{user.email}</p>
              <p className="text-gray-500 text-xs">{user.phone || 'No phone'}</p>
              <p className="text-gray-400 text-xs">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link
                href={`/admin/users/${user.id}`}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-black border border-gray-200 rounded hover:bg-gray-50"
              >
                <Eye className="w-3 h-3" />
                View
              </Link>
              <button
                onClick={() => onDelete(user.id, user.name)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-600 hover:text-red-700 border border-gray-200 rounded hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <select
          value={pagination.pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 0}
            className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm">
            {pagination.currentPage + 1} / {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages - 1}
            className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}