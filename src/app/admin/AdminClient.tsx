'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/open/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Sidebar from '@/components/admin/layouts/sidebar';
import Navbar from '@/components/admin/layouts/navbar';

export default function AdminClient({ children }: { children: React.ReactNode }) {  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, loading, } = useAuth(); 
  const router = useRouter();


  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login?callbackUrl=/admin');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) return <LoadingSpinner />;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:pl-64">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}