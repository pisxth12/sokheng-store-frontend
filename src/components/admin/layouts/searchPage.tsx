// components/admin/PageSearch.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  LayoutDashboard,
  BarChart3,
  FileText,
  Package,
  ShoppingBag,
  Tags,
  Users,
  Settings,
  Image,
  ArrowRight,
  Bell
} from "lucide-react";

interface PageResult {
  title: string;
  href: string;
  icon: React.ReactNode;
  keywords: string[];
}

const pages: PageResult[] = [
  { 
    title: "Dashboard", 
    href: "/admin", 
    icon: <LayoutDashboard className="w-4 h-4" />,
    keywords: ["home", "main", "overview", "stats"]
  },
  { 
    title: "Analytics", 
    href: "/admin/analytics", 
    icon: <BarChart3 className="w-4 h-4" />,
    keywords: ["statistics", "charts", "metrics", "data"]
  },
  { 
    title: "Reports", 
    href: "/admin/reports", 
    icon: <FileText className="w-4 h-4" />,
    keywords: ["download", "export", "pdf", "csv"]
  },
  { 
    title: "Products", 
    href: "/admin/products", 
    icon: <Package className="w-4 h-4" />,
    keywords: ["items", "inventory", "stock", "goods", "product"]
  },
  { 
    title: "Orders", 
    href: "/admin/orders", 
    icon: <ShoppingBag className="w-4 h-4" />,
    keywords: ["sales", "transactions", "purchases", "order"]
  },
  { 
    title: "Categories", 
    href: "/admin/categories", 
    icon: <Tags className="w-4 h-4" />,
    keywords: ["groups", "types", "collections", "category"]
  },
  { 
    title: "Banners", 
    href: "/admin/banners", 
    icon: <Image className="w-4 h-4" />,
    keywords: ["ads", "promotions", "sliders", "banner"]
  },
  { 
    title: "Users", 
    href: "/admin/users", 
    icon: <Users className="w-4 h-4" />,
    keywords: ["customers", "admins", "accounts", "user"]
  },
  { 
    title: "Settings", 
    href: "/admin/settings", 
    icon: <Settings className="w-4 h-4" />,
    keywords: ["preferences", "configuration", "profile", "setting"]
  },
  {
    "title": "Notifications",
    "href": "/admin/notifications",
    "icon": <Bell className="w-4 h-4" />,
    "keywords": ["alerts", "messages", "updates", "notification"]
  }
];

interface PageSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClose?: () => void;
}

export default function PageSearch({ 
  searchQuery, 
  setSearchQuery,
  onClose 
}: PageSearchProps) {
  const [suggestions, setSuggestions] = useState<PageResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    const filtered = pages.filter(page => 
      page.title.toLowerCase().includes(query) ||
      page.keywords.some(keyword => keyword.includes(query))
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else if (suggestions.length > 0) {
          handleSelect(suggestions[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSelect = (page: PageResult) => {
    router.push(page.href);
    setSearchQuery('');
    setShowSuggestions(false);
    if (onClose) onClose();
  };

  const handleViewAll = () => {
    if (searchQuery.trim()) {
      router.push(`/admin/${searchQuery}`);
      setShowSuggestions(false);
      if (onClose) onClose();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
          placeholder="Search pages... (Dashboard, Products, Orders...)"
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-80 overflow-y-auto">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((page, index) => (
                <button
                  key={page.href}
                  onClick={() => handleSelect(page)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                    index === selectedIndex 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 ${
                    index === selectedIndex ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {page.icon}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      index === selectedIndex ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {page.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {page.href.replace('/admin', '') || '/'}
                    </p>
                  </div>
                  {index === selectedIndex && (
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
              
              {/* View all results option */}
              <button
                onClick={handleViewAll}
                className="w-full flex items-center gap-3 px-3 py-2 text-left border-t border-gray-100 hover:bg-gray-50 text-sm text-blue-600 font-medium"
              >
                <Search className="w-4 h-4" />
                <span>View all results for "{searchQuery}"</span>
              </button>
            </>
          ) : (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              <p className="font-medium">No pages found</p>
              <p className="text-xs mt-1">Try searching for: dashboard, products, orders...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}