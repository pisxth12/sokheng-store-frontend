"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import "./HeroBanner.css";

interface Banner{
   id: number;
    title: string;
    imageUrl: string;
    link?: string;
}
interface HeroBannerProps {
    banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

     if (!banners.length) return null;


    const cloned = banners.length > 0
        ? [banners[banners.length - 1], ...banners, banners[0]]
        : [];

    const SLIDE_DURATION = 9000;

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



    if (banners.length === 0) return null;

    return (
        <section
            className="hb-section"
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseLeave={() => isDragging && setIsDragging(false)}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
        >
            {/* ── Slide Track ── */}
            <div
                ref={containerRef}
                className="hb-track"
                style={{ width: `${cloned.length * 100}vw` }}
            >
                {cloned.map((banner, i) => (
                    <div key={`${banner.id}-${i}`} className="hb-slide">

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

                        <div className="hb-grad-bottom" />
                        <div className="hb-grad-left" />

                        {/* Content */}
                        <div className="hb-content">
                            <div className="hb-content-inner">

                                {/* Eyebrow */}
                                <div className="hb-eyebrow">
                                    <span className="hb-eyebrow-line" />
                                    <span className="hb-eyebrow-text">
                                        {realIndex + 1} / {banners.length}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="hb-title">{banner.title}</h1>

                                {/* CTA */}
                                {banner.link && (
                                    <Link
                                        href={banner.link}
                                        className="hb-cta"
                                        onClick={e => isDragging && e.preventDefault()}
                                    >
                                        Shop Now
                                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                            <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </Link>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Arrows ── */}
            {banners.length > 1 && (
                <>
                    <button className="hb-arrow hb-arrow--prev" onClick={prev} aria-label="Previous slide">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button className="hb-arrow hb-arrow--next" onClick={next} aria-label="Next slide">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            {/* ── Dots ── */}
            {banners.length > 1 && (
                <div className="hb-dots">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            className="hb-dot-btn"
                            onClick={() => goToReal(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            <span className={`hb-dot-line ${i === realIndex ? "hb-dot-line--active" : ""}`} />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}