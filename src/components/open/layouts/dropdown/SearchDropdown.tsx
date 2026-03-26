"use client";
import useRecentSearch from "@/hooks/open/useRecentSearch";
import { useSearchSuggestions } from "@/hooks/open/useSearchSuggestions";
import { History, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "./SearchDropdown.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ isOpen, onClose }: Props) {
  const router = useRouter();
  const t = useTranslations("Search");

  const [searchInput, setSearchInput] = useState("");
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);

  const { setQuery: setSuggestionQuery, suggestions, loading } = useSearchSuggestions();
  const { recentSearches, addRecent, clearRecent, removeRecent } = useRecentSearch(5);

  // Update suggestions when input changes
  useEffect(() => {
    setSuggestionQuery(searchInput);
  }, [searchInput, setSuggestionQuery]);

  // Mount/unmount with animation
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
      document.body.style.overflow = "hidden";
    } else if (visible) {
      setClosing(true);
      setTimeout(() => {
        setVisible(false);
        setClosing(false);
        setSearchInput("");
      }, 280);
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, visible]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      setSearchInput("");
      onClose();
    }, 280);
  }, [onClose]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchInput.trim();
    if (keyword) {
      addRecent(keyword);
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
      handleClose();
    }
  }, [searchInput, addRecent, router, handleClose]);

  const handleSuggestionClick = useCallback((term: string) => {
    addRecent(term);
    setSearchInput(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    
    handleClose();
  }, [addRecent, router, handleClose]);

  if (!visible) return null;

  return (
    <div style={{ zIndex: 1000 }} className="absolute top-0 left-0 right-0">
      {/* Backdrop */}
      <div
        className={`sd-backdrop ${closing ? "sd-backdrop--closing" : ""}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div className={`sd-panel ${closing ? "sd-panel--closing" : ""}`}>
        <div className="sd-inner">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="sd-form">
            <Search size={16} className="sd-form-icon" />
            <input
              type="text"
              placeholder={t("placeholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="sd-input"
              autoFocus
            />
            <div className="sd-form-actions">
              {searchInput && (
                <button
                  type="button"
                  className="sd-icon-btn"
                  onClick={() => setSearchInput("")}
                  aria-label={t("clear")}
                >
                  <X size={13} />
                </button>
              )}
              <button
                type="button"
                className="sd-icon-btn"
                onClick={handleClose}
                aria-label={t("close")}
              >
                <X size={15} />
              </button>
            </div>
          </form>

          {/* Results */}
          <div className="sd-results">
            {searchInput.length < 2 ? (
              /* Recent Searches */
              recentSearches.length > 0 && (
                <>
                  <span className="sd-section-label">{t("recentSearches")}</span>
                  <div className="sd-recent-list">
                    {recentSearches.map((term, i) => (
                      <div key={i} className="sd-recent-row">
                        <button
                          className="sd-recent-btn"
                          onClick={() => handleSuggestionClick(term)}
                        >
                          <History size={13} className="sd-recent-icon" />
                          {term}
                        </button>
                        <button
                          className="sd-remove-btn"
                          onClick={() => removeRecent(term)}
                          aria-label="Remove"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <button className="sd-clear-btn" onClick={clearRecent}>
                      {t("clearAll")}
                    </button>
                  </div>
                </>
              )
            ) : loading ? (
              <div className="sd-loading">
                <span className="sd-loading-dot" />
                <span className="sd-loading-dot" />
                <span className="sd-loading-dot" />
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <span className="sd-section-label">Suggestions</span>
                <div className="sd-suggestions">
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={`/${product.categorySlug}/${product.slug}`}
                      className="sd-product-row"
                      onClick={() => { addRecent(product.name); handleClose(); }}
                    >
                      {product.mainImage && (
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="sd-product-img"
                        />
                      )}
                      <span className="sd-product-name">{product.name}</span>
                      <span className="sd-product-price">${product.price}</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="sd-empty">No results for &ldquo;{searchInput}&rdquo;</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}