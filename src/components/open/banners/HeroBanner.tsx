"use client"
import { useBanner } from "@/hooks/open/useBanner";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

export default function HeroBanner() {
    const { banners, loading } = useBanner();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    
    const cloned = banners.length > 0
        ? [banners[banners.length - 1], ...banners, banners[0]]
        : [];

    const SLIDE_DURATION = 4000;

    const goTo = useCallback((index: number, animate = true) => {
        const container = containerRef.current;
        if (!container) return;
        if (animate) {
            container.style.transition = "transform 0.55s cubic-bezier(0.77, 0, 0.175, 1)";
        } else {
            container.style.transition = "none";
        }
        
        container.style.transform = `translateX(-${(index + 1) * 100}vw)`;
    }, []);

    const goToReal = useCallback((index: number) => {
        setCurrentIndex(index);
        goTo(index);
    }, [goTo]);

    // Initialize position
    useEffect(() => {
        if (banners.length === 0) return;
        goTo(0, false);
    }, [banners.length, goTo]);

    // Handle transition end for infinite loop reset
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTransitionEnd = () => {
            if (currentIndex === banners.length) {
                // Jumped past the last real slide → reset to first real
                setCurrentIndex(0);
                goTo(0, false);
            } else if (currentIndex === -1) {
                // Jumped before first real slide → reset to last real
                setCurrentIndex(banners.length - 1);
                goTo(banners.length - 1, false);
            }
            setIsTransitioning(false);
        };

        container.addEventListener("transitionend", handleTransitionEnd);
        return () => container.removeEventListener("transitionend", handleTransitionEnd);
    }, [currentIndex, banners.length, goTo]);

    const next = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex === banners.length ? banners.length : nextIndex);
        goTo(nextIndex);
    }, [currentIndex, banners.length, goTo, isTransitioning]);

    const prev = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex === -1 ? -1 : prevIndex);
        goTo(prevIndex);
    }, [currentIndex, banners.length, goTo, isTransitioning]);

    // Autoplay
    useEffect(() => {
        if (banners.length <= 1) return;
        const startAutoPlay = () => {
            autoPlayRef.current = setTimeout(() => {
                next();
            }, SLIDE_DURATION);
        };
        startAutoPlay();
        return () => {
            if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
        };
    }, [currentIndex, banners.length, next]);

    // Touch / Mouse drag
    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        setDragStart(x);
        setIsDragging(true);
        if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };

    const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;
        const x = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
        const diff = dragStart - x;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
        setIsDragging(false);
    };

    // Real current index for dots (clamped)
    const realIndex = ((currentIndex % banners.length) + banners.length) % banners.length;

    if (loading) {
        return (
            <div className="w-full bg-gray-100 animate-pulse" style={{ height: "clamp(220px, 42vw, 580px)" }} />
        );
    }

    if (banners.length === 0) return null;

    return (
        <section
            className="relative w-full overflow-hidden select-none bg-black"
            style={{ height: "clamp(220px, 42vw, 580px)" }}
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseLeave={() => isDragging && setIsDragging(false)}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
        >
            {/* Slide Track */}
            <div
                ref={containerRef}
                className="flex h-full"
                style={{
                    width: `${cloned.length * 100}vw`,
                    willChange: "transform",
                }}
            >
                {cloned.map((banner, i) => (
                    <div
                        key={`${banner.id}-${i}`}
                        className="relative h-full flex-shrink-0"
                        style={{ width: "100vw" }}
                    >
                        <Image
                            src={banner.imageUrl}
                            alt={banner.title}
                            fill
                            className="object-cover pointer-events-none"
                            priority={i === 1}
                            sizes="100vw"
                            quality={90}
                            draggable={false}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 flex items-end justify-center pb-12 sm:pb-16 md:pb-20 text-center px-4">
                            <div className="max-w-xl">
                                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-xl leading-tight mb-3">
                                    {banner.title}
                                </h1>
                                {banner.link && (
                                    <Link
                                        href={banner.link}
                                        className="inline-block px-5 py-2 sm:px-7 sm:py-2.5 border-2 border-white text-white hover:text-black font-semibold roundedtext-black font-semibold rounded bg-transparent text-sm sm:text-base hover:bg-gray-100 active:scale-95 transition-all duration-150 shadow-lg"
                                        onClick={e => isDragging && e.preventDefault()}
                                    >
                                        Shop Now
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prev / Next arrows (desktop only) */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors z-10"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors z-10"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dot indicators */}
            {banners.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToReal(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className="flex items-center justify-center p-1"
                        >
                            <span
                                className={`block rounded-full transition-all duration-300 ${
                                    i === realIndex
                                        ? "w-5 h-1.5 bg-white"
                                        : "w-1.5 h-1.5 bg-white/45 hover:bg-white/70"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Slide counter – top right, subtle */}
            {banners.length > 1 && (
                <div className="absolute top-3 right-3 text-white/50 text-[11px] font-medium tracking-widest bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full z-10 tabular-nums">
                    {realIndex + 1}/{banners.length}
                </div>
            )}
        </section>
    );
}