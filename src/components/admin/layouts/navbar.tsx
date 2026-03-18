"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Search, Bell, Mail, ChevronDown, X } from "lucide-react";

import { useSearch } from "@/hooks/admin/useSearch";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/open/useAuth";
import NotificationBell from "../notifications/notificationBell";
import PageSearch from "./searchPage";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [opeProfileDetail, setOpenProfileDetail] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const { logout, user } = useAuth();

  const profileRef = useRef<HTMLDivElement>(null);

  // click outside handler
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setOpenProfileDetail(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  const router = useRouter();

  const handleLogout = useCallback(() => {
   if (confirm("Are you sure you want to logout?")) {
      logout();
      setOpenProfileDetail(false);
    }
  }, [logout, router]);


  const handleSearch = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
      e.preventDefault();
    if (searchQuery.trim() !== "") {
      setOpenProfileDetail(false);
      router.push(`/admin/${searchQuery}`);
    }
    }, [router, searchQuery]);

  const handleGoToSettings = useCallback(() => {
    router.push("/admin/settings");
    setOpenProfileDetail(false);
  }, [router]);



  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Left section with mobile menu */}
        <div className="flex items-center w-full justify-between">
          <div className="flex">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Search - visible on md and up */}
            <div className="hidden md:block flex-1 sm:w-[400px] max-w-md mx-auto">
              <div className="relative">
                <PageSearch 
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
              </div>
            </div>
          </div>
        </div>

        {/* Right section with actions */}
        <div className="flex items-center gap-3 ">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification buttons */}
          <div className="flex items-center gap-1 ">
            <div className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
              <NotificationBell />
            </div>
          </div>

          <div className="relative">
            {/* Profile dropdown */}
            <button
              onClick={() => setOpenProfileDetail(!opeProfileDetail)}
              className="flex items-center cursor-pointer gap-2 pl-2 pr-1 py-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm">
                
                  <img src="/images/admin.jpg" alt="" />
                
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>
            {opeProfileDetail && (
              <div ref={profileRef} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={()=> handleGoToSettings()}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3 animate-slideDown">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-2 bg-gray-50 border dark:text-black border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Optional: Quick search suggestions */}
          <div className="mt-2 text-xs text-gray-400 flex gap-2">
            <span>Quick:</span>
            <button onClick={()=> router.push("/admin")} className="hover:text-gray-600">Dashboard</button>
            <button onClick={()=> router.push("/admin/products")} className="hover:text-gray-600">Products</button>
            <button onClick={()=> router.push("/admin/users")} className="hover:text-gray-600">Users</button>
            <button onClick={()=> router.push("/admin/orders")} className="hover:text-gray-600">Orders</button>
          </div>
        </div>
      )}

      
    </nav>
  );
}
