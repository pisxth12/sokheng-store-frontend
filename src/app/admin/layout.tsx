"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/layouts/sidebar";
import Navbar from "../../components/admin/layouts/navbar";
import { AppProvider } from "@/providers/AppProvider";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/admin/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login?callbackUrl=/admin");
      return;
    }
    if (!isAdmin) {
      router.push("/");
      return;
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!user || !isAdmin) {
    return null;
  }

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-white dark:text-black ">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="lg:pl-64">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="p-4 md:p-10 ">{children}</main>
        </div>
      </div>
    </AppProvider>
  );
}
