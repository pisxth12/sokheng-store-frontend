"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Package,
  Tags,
  Users,
  Settings,
  Image,
  ShoppingBag,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/admin/useAuth";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard",  href: "/admin",            icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: "Analytics",  href: "/admin/analytics",  icon: <BarChart3 className="w-4 h-4" /> },
  { name: "Reports",    href: "/admin/reports",    icon: <FileText className="w-4 h-4" /> },
  { name: "Products",   href: "/admin/products",   icon: <Package className="w-4 h-4" />, badge: "12" },
  { name: "Categories", href: "/admin/categories", icon: <Tags className="w-4 h-4" /> },
  { name: "Banners",    href: "/admin/banners",    icon: <Image className="w-4 h-4" /> },
  { name: "Users",      href: "/admin/users",      icon: <Users className="w-4 h-4" /> },
  { name: "Settings",   href: "/admin/settings",   icon: <Settings className="w-4 h-4" /> },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // ── UNCHANGED LOGIC ──
  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-[13px] font-semibold tracking-tight transition-colors duration-150 ${
          active
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <span className={`flex items-center justify-center w-5 h-5 flex-shrink-0 ${active ? "text-white" : "text-gray-400"}`}>
          {item.icon}
        </span>
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide ${
            active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
          }`}>
            {item.badge}
          </span>
        )}
        {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay — UNCHANGED logic */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar — UNCHANGED logic */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white flex flex-col border-r border-black/[0.07] shadow-[4px_0_32px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "260px" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-black/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-gray-900 flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={15} color="#fff" />
            </div>
            <span className="text-sm font-extrabold text-gray-900 tracking-tight">ShopAdmin</span>
          </div>

          {/* Mobile close — UNCHANGED logic */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden w-7 h-7 rounded-md bg-black/5 flex items-center justify-center text-gray-400 hover:bg-black/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={13} />
          </button>
        </div>

        {/* Navigation — UNCHANGED logic */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ height: "calc(100vh - 140px)" }}>

          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/25 px-2.5 pt-2 pb-1.5">Main</p>
          {navItems.slice(0, 3).map((item) => <NavLink key={item.name} item={item} />)}

          <div className="h-px bg-black/[0.06] my-3 mx-1" />

          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/25 px-2.5 pt-2 pb-1.5">Catalog</p>
          {navItems.slice(3, 6).map((item) => <NavLink key={item.name} item={item} />)}

          <div className="h-px bg-black/[0.06] my-3 mx-1" />

          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/25 px-2.5 pt-2 pb-1.5">Account</p>
          {navItems.slice(6).map((item) => <NavLink key={item.name} item={item} />)}
        </nav>

        {/* User profile — UNCHANGED logic */}
        <div className="flex-shrink-0 border-t border-black/[0.06] px-4 py-3.5 flex items-center gap-2.5 bg-white">
          <div className="w-8 h-8 rounded-[9px] bg-gray-900 flex items-center justify-center text-white text-[13px] font-extrabold tracking-tight flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-gray-900 tracking-tight truncate">
              {user?.name || "Admin User"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}