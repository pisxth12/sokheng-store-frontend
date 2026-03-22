"use client";
import { useRelatedProducts } from "@/hooks/open/useRelatedProducts";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useState, useEffect, useRef, useCallback } from "react";
import "./relatedProducts.css";
import { useTranslations } from "next-intl";

interface RelatedProductProps {
  productId: number;
  initialSize?: number;
}

export default function RelatedProduct({
  productId,
  initialSize = 8,
}: RelatedProductProps) {
  const { products, loading, loadingMore, hasMore, loadMore, total } =
    useRelatedProducts(productId, initialSize);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(4);
  const isLoadingMore = useRef(false);

  const t = useTranslations("RelatedProduct");

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setItemsPerView(4);
      else if (window.innerWidth >= 640) setItemsPerView(3);
      else setItemsPerView(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || products.length === 0) return;

    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = scrollWidth / products.length;
    const newIndex = Math.min(
      Math.floor(scrollLeft / cardWidth),
      products.length - itemsPerView
    );
    if (newIndex !== activeIndex) setActiveIndex(Math.max(0, newIndex));

    if (hasMore && !loadingMore && !isLoadingMore.current) {
      if (scrollWidth - (scrollLeft + clientWidth) < 200) {
        isLoadingMore.current = true;
        loadMore().finally(() => { isLoadingMore.current = false; });
      }
    }
  }, [products.length, itemsPerView, hasMore, loadingMore, loadMore, activeIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = Math.min(Math.max(0, index), products.length - itemsPerView);
    const cardWidth = el.scrollWidth / products.length;
    el.scrollTo({ left: target * cardWidth, behavior: "smooth" });
    setActiveIndex(target);
  }, [products.length, itemsPerView]);

  const handlePrev = () => scrollToIndex(activeIndex - itemsPerView);
  const handleNext = () => scrollToIndex(activeIndex + itemsPerView);

  const getKey = useCallback(
    (product: any, index: number) => `${product.id}-${product.slug || index}-${index}`,
    []
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin rp-spinner" />
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="rp-section">

      {/* Header */}
      <div className="rp-header">
        <h2 className="rp-title">You may also like</h2>
        {total > 0 && (
          <span className="rp-count">
            {activeIndex + 1}–{Math.min(activeIndex + itemsPerView, products.length)}&nbsp;of&nbsp;{total}
          </span>
        )}
      </div>

      {/* Carousel */}
      <div className="rp-carousel-wrap">

        <button
          className="rp-arrow rp-arrow--prev"
          onClick={handlePrev}
          disabled={!canScrollLeft}
          aria-label={t("previous")}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          className="rp-arrow rp-arrow--next"
          onClick={handleNext}
          disabled={!canScrollRight}
          aria-label={t("next")}
        >
          <ChevronRight size={16} />
        </button>

        <div ref={scrollRef} className="rp-track">
          {products.map((product, index) => (
            <div key={getKey(product, index)} className="rp-card-sloted">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="rp-loading-more">
          <Loader2 className="w-3.5 h-3.5 animate-spin rp-spinner" />
          <span>{t("loadingMore")}</span>
        </div>
      )}

    </div>
  );
}