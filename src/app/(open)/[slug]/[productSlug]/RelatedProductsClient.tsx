// app/products/[productSlug]/RelatedProductsClient.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/open/products/ProductCard";
import { Product } from "@/types/open/product.type";
import { useTranslations } from "next-intl";
import { loadMoreRelatedProducts } from "../../actions/product.actions";

import "./RelatedProductsClient.css";


interface RelatedProductsClientProps {
  initialProducts: Product[];
  initialTotal: number;
  initialHasMore: boolean;
  productId: number;
  pageSize: number;
}

export default function RelatedProductsClient({
  initialProducts,
  initialTotal,
  initialHasMore,
  productId,
  pageSize,
}: RelatedProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  
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

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isLoadingMore.current) return;
    
    isLoadingMore.current = true;
    setLoadingMore(true);
    
    try {
      const data = await loadMoreRelatedProducts(productId, page, pageSize);
      setProducts(prev => [...prev, ...data.products]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setLoadingMore(false);
      isLoadingMore.current = false;
    }
  }, [loadingMore, hasMore, productId, page, pageSize]);

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
        loadMore();
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

  return (
    <>
      <div className="rp-header">
        <h2 className="rp-title">You may also like</h2>
        {total > 0 && (
          <span className="rp-count">
            {activeIndex + 1}–{Math.min(activeIndex + itemsPerView, products.length)}&nbsp;of&nbsp;{total}
          </span>
        )}
      </div>

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

        <div ref={scrollRef} className="rp-track ">
          {products.map((product, index) => (
            <div key={`${product.id}-${index}`} className="rp-card-sloted">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {loadingMore && (
        <div className="rp-loading-more">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{t("loadingMore")}</span>
        </div>
      )}
    </>
  );
}