"use client";
import useRecentSearch from "@/hooks/open/useRecentSearch";
import { useSearchProducts } from "@/hooks/open/useSearchProducts";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ isOpen, onClose }: Props) {
  const router = useRouter();
  const t = useTranslations('Search'); 

  const [searchInput, setSearchInput] = useState("");

  const {  search, setQuery } =
    useSearchProducts();
  const { recentSearches, addRecent, clearRecent, removeRecent } =
    useRecentSearch(5);

  

  useEffect(() => {
    setQuery(searchInput);
  }, [searchInput, setQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchInput("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchInput.trim();

    if (keyword) {
      addRecent(keyword);
      search(searchInput.trim());
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      onClose();
    }
  };

  const handleSuggestionClick = (term: string) => {
    addRecent(term);
    setSearchInput(term);
    search(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    onClose();
  };

  if (!isOpen) return null;

  const popularSearches = ["Shirts", "Dresses", "Shoes", "Bags", "Sale"];
  return (
    <div className="absolute top-16 left-0 right-0 z-40 animate-slideDown">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Search Panel */}
      <div className="relative bg-white dark:bg-darkbg z-50 shadow-xl">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('placeholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition"
              autoFocus
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                aria-label={t('clear')} 
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >

                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
               aria-label={t('close')} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

         

          {/* Search Suggestions - Only show when not typing */}
          {searchInput.length < 2 && (
            <>
              <div className="mt-6 grid grid-cols-1  gap-6">
               
                {/* Recent Searches - You can implement this with localStorage */}
                <div>
                  {recentSearches.length > 0 && (
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    {t('recentSearches')}
                  </p>
                  )}
                  <div className="space-y-2">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        className="flex justify-between items-center"
                      >
                        <button
                          onClick={() => handleSuggestionClick(term)}
                          className="block dark:text-white w-full text-left px-3 py-2 text-gray-600 dark:hover:bg-gray-200/10 rounded-lg transition"
                        >
                          {term}
                        </button>
                        <button
                          onClick={() => removeRecent(term)}
                           aria-label={t('clear')} 
                          className="text-darkbg cursor-pointer dark:text-white px-2"
                        >
                          <X/>
                        </button>
                      </div>
                    ))}
                    {recentSearches.length > 0 && (
                      <button
                        onClick={clearRecent}
                        className="text-sm cursor-pointer dark:text-white text-gray-500 mt-2 hover:underline"
                      >
                         {t('clearAll')} 
                      </button>
                    )}
                  </div>
                </div>
              </div>

          
            </>
          )}
        </div>
      </div>
    </div>
  );
}
