'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { BrandCard } from '../brands/BrandCard';
import { Brand } from '@/types/open/brand.type';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './BrandSection.css';

interface BrandSectionProps {
  brands: Brand[];
}

export function BrandSection({ brands }: BrandSectionProps) {
  const trackRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(5);
  const [isVisible, setIsVisible]         = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const visibleSlidesRef = useRef(5);
  const currentIndexRef  = useRef(0);
  const maxIndexRef      = useRef(0);

  const isDragging    = useRef(false);
  const wasDragging   = useRef(false);
  const startX        = useRef(0);
  const startOffset   = useRef(0);
  const lastX         = useRef(0);
  const velocity      = useRef(0);
  const lastTimestamp = useRef(0);
  // Lock: only one slide per gesture
  const hasSwiped     = useRef(false);

  const totalSlides = brands.length;

  /* ── Intersection observer ─────────────────── */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Responsive slides ─────────────────────── */
  useEffect(() => {
    const update = () => {
      const v =
        window.innerWidth >= 1024 ? 5 :
        window.innerWidth >= 768  ? 4 :
        window.innerWidth >= 640  ? 2 : 2;
      setVisibleSlides(v);
      visibleSlidesRef.current = v;
      maxIndexRef.current = Math.max(0, totalSlides - v);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [totalSlides]);

  const slideWidthPct = 100 / visibleSlides;
  const maxIndex      = Math.max(0, totalSlides - visibleSlides);

  /* ── moveTo ────────────────────────────────── */
  const moveTo = useCallback((index: number, animate = true) => {
    const max     = maxIndexRef.current;
    const vis     = visibleSlidesRef.current;
    const clamped = Math.max(0, Math.min(index, max));

    currentIndexRef.current = clamped;
    setCurrentIndex(clamped);

    if (!trackRef.current || !containerRef.current) return;
    const slideW = containerRef.current.offsetWidth / vis;

    trackRef.current.style.transition = animate
      ? 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
      : 'none';
    trackRef.current.style.transform = `translateX(-${clamped * slideW}px)`;
  }, []);

  const next = useCallback(() => {
    const cur = currentIndexRef.current;
    const max = maxIndexRef.current;
    moveTo(cur >= max ? 0 : cur + 1);
  }, [moveTo]);

  const prev = useCallback(() => {
    const cur = currentIndexRef.current;
    const max = maxIndexRef.current;
    moveTo(cur <= 0 ? max : cur - 1);
  }, [moveTo]);

  /* ── Pointer handlers ──────────────────────── */
 const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  wasDragging.current   = false;
  hasSwiped.current     = false;
  isDragging.current    = true;
  startX.current        = e.clientX;
  lastX.current         = e.clientX;
  // Store Y so we can detect vertical scroll intent
  const startY          = e.clientY;
  (e.currentTarget as any)._startY = startY;
  velocity.current      = 0;
  lastTimestamp.current = e.timeStamp;

  const vis           = visibleSlidesRef.current;
  const containerW    = containerRef.current?.offsetWidth ?? 1;
  startOffset.current = currentIndexRef.current * (containerW / vis);

  if (trackRef.current) trackRef.current.style.transition = 'none';
}, []);

const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
  if (!isDragging.current || !trackRef.current) return;

  const dx = e.clientX - startX.current;
  const dy = e.clientY - (e.currentTarget as any)._startY || 0;

  // If user is scrolling vertically — abort horizontal drag entirely
  if (!hasSwiped.current && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
    isDragging.current = false;
    setIsDraggingState(false);
    moveTo(currentIndexRef.current); // snap back
    return;
  }

  const dt = e.timeStamp - lastTimestamp.current;
  if (dt > 0) velocity.current = (e.clientX - lastX.current) / dt;
  lastX.current         = e.clientX;
  lastTimestamp.current = e.timeStamp;

  const vis        = visibleSlidesRef.current;
  const containerW = containerRef.current?.offsetWidth ?? 1;
  const slideW     = containerW / vis;

  // Only capture pointer once we're sure it's horizontal
  if (!hasSwiped.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
    if (e.pointerType !== 'mouse') {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }
  }

  // One slide per gesture — snap when threshold crossed
  if (!hasSwiped.current && Math.abs(dx) > slideW * 0.18) {
    hasSwiped.current   = true;
    wasDragging.current = true;
    isDragging.current  = false;
    setIsDraggingState(false);

    const cur = currentIndexRef.current;
    const max = maxIndexRef.current;
    if (dx < 0) {
      moveTo(cur >= max ? 0 : cur + 1);
    } else {
      moveTo(cur <= 0 ? max : cur - 1);
    }
    return;
  }

  // Follow finger with rubber-band
  if (!hasSwiped.current) {
    const maxT = maxIndexRef.current * slideW;
    let   t    = startOffset.current - dx;

    if      (t < 0)    t = t * 0.22;
    else if (t > maxT) t = maxT + (t - maxT) * 0.22;

    trackRef.current.style.transform = `translateX(-${t}px)`;
  }
}, [moveTo]);

const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
  if (!isDragging.current) return;
  isDragging.current = false;
  setIsDraggingState(false);

  const dx = e.clientX - startX.current;

  if (Math.abs(dx) < 10) {
    wasDragging.current = false;
    moveTo(currentIndexRef.current);
    return;
  }

  if (!hasSwiped.current) {
    wasDragging.current = true;
    const cur = currentIndexRef.current;
    const max = maxIndexRef.current;
    if (dx < 0) {
      moveTo(cur >= max ? 0 : cur + 1);
    } else {
      moveTo(cur <= 0 ? max : cur - 1);
    }
  }
}, [moveTo]);

  if (!brands.length) return null;

  return (
    <section
      ref={wrapperRef}
      className={`bs-section ${isVisible ? 'bs-section--visible' : ''}`}
    >
      <div className="bs-carousel">
        <div className="bs-fade bs-fade--left"  aria-hidden="true" />
        <div className="bs-fade bs-fade--right" aria-hidden="true" />

        {totalSlides > visibleSlides && (
          <>
            <button className="bs-arrow bs-arrow--prev" onClick={prev} aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className="bs-arrow bs-arrow--next" onClick={next} aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div
          ref={containerRef}
          className={`bs-viewport ${isDraggingState ? 'bs-viewport--dragging' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            ref={trackRef}
            className="bs-track"
            style={{ transform: 'translateX(0px)' }}
          >
            {brands.map((brand, i) => (
              <div
                key={brand.id}
                className="bs-slide"
                style={{
                  width: `${slideWidthPct}%`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <BrandCard brand={brand} wasDragging={wasDragging} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}