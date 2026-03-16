"use client";
import useRecentSearch from "@/hooks/open/useRecentSearch";
import { useSearchProducts } from "@/hooks/open/useSearchProducts";
import { useSearchSuggestions } from "@/hooks/open/useSearchSuggestions";
import {  ProductSuggestion } from "@/types/open/product.type";
import { History, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ isOpen, onClose }: Props) {
  const router = useRouter();
  const t = useTranslations('Search'); 

  const [searchInput, setSearchInput] = useState("");

 
  const { search: searchProducts, setQuery: setSearchQuery } = useSearchProducts();
  const { 
    setQuery: setSuggestionQuery, 
    suggestions, 
    loading 
  } = useSearchSuggestions();
  
  const { recentSearches, addRecent, clearRecent, removeRecent } = useRecentSearch(5);

   const updateQueries = useCallback(() => {
    setSearchQuery(searchInput);
    setSuggestionQuery(searchInput);
  }, [searchInput, setSearchQuery, setSuggestionQuery]);

  useEffect(() => {
    updateQueries();
  }, [updateQueries]);

  

   const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchInput.trim();

    if (keyword) {
      addRecent(keyword);
      searchProducts(keyword);  
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
      onClose();
    }
  }, [searchInput, addRecent, searchProducts, router, onClose]);

   const handleSuggestionClick = useCallback((term: string) => {
    addRecent(term);
    setSearchInput(term);
    searchProducts(term);  
    router.push(`/search?q=${encodeURIComponent(term)}`);
    onClose();
  }, [addRecent, searchProducts, router, onClose]);

  const handleProductClick = useCallback((product: ProductSuggestion) => {
    addRecent(product.name);
    router.push(`/products/${product.slug}`);
    onClose();
  }, [addRecent, router, onClose]);

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

  if (!isOpen) return null;

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

          {/* Search Suggestions */}
          {searchInput.length < 2 ? (
            // Recent Searches
            recentSearches.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {t('recentSearches')}
                </p>
                <div className="space-y-2">
                  {recentSearches.map((term) => (
                        <div key={term} className="flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                          <button
                            onClick={() => handleSuggestionClick(term)}
                            className="flex-1 flex items-center gap-3 px-3 py-2 text-left"
                          >
                            <History className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                            <span className="text-gray-700 dark:text-gray-300">{term}</span>
                          </button>
                          
                          <button
                            onClick={() => removeRecent(term)}
                            className="opacity-0 group-hover:opacity-100 p-2 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  <button
                    onClick={clearRecent}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2 hover:underline"
                  >
                    {t('clearAll')} 
                  </button>
                </div>
              </div>
            )
          ) : (
            // Product Suggestions
            loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Product Suggestions
                </p>
                <div className="space-y-2">
                  {suggestions.map((product) => (
                      <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            addRecent(product.name);
                            onClose();
                          }}
                          className="flex items-center justify-between gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-black/20 cursor-pointer rounded-lg transition"
                        >
                          <div className="flex items-center gap-3">
                            {product.mainImage && (
                              <img 
                                src={product.mainImage} 
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <span className="text-gray-700 dark:text-gray-300">
                              {product.name}
                            </span>
                          </div>
                          
                          <span className="text-gray-500  font-medium">
                            ${product.price}
                          </span>
                        </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No products found
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}