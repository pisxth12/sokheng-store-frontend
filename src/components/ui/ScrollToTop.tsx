'use client';

import { useState, useEffect, useRef } from 'react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [launching, setLaunching] = useState(false);
  const circleRef = useRef<SVGCircleElement>(null);
  const DASH = 163;

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollH = el.scrollHeight - el.clientHeight;
      const pct = scrollH > 0 ? scrollTop / scrollH : 0;
      setScrollPct(pct);
      setIsVisible(scrollTop > 400);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    setLaunching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setLaunching(false), 800);
  };

  return (
    <>
      <style>{`
        @keyframes launch {
          0%   { transform: translateY(0) scale(1); }
          30%  { transform: translateY(2px) scale(0.95); }
          60%  { transform: translateY(-32px) scale(0.8); opacity: 0; }
          61%  { transform: translateY(32px) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes flicker {
          from { transform: scaleX(1); }
          to   { transform: scaleX(1.25); }
        }
        @keyframes fire-ring-expand {
          0%   { r: 26; stroke-width: 6; opacity: 1; }
          100% { r: 52; stroke-width: 0; opacity: 0; }
        }
        @keyframes fire-ring-expand-2 {
          0%   { r: 26; stroke-width: 4; opacity: 0.7; }
          100% { r: 44; stroke-width: 0; opacity: 0; }
        }
        @keyframes fire-particle {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: var(--tx) scale(0); opacity: 0; }
        }
        .fire-ring-1 {
          animation: fire-ring-expand 0.6s ease-out forwards;
        }
        .fire-ring-2 {
          animation: fire-ring-expand-2 0.4s 0.1s ease-out forwards;
        }
        .fire-particle {
          animation: fire-particle 0.55s ease-out forwards;
        }
      `}</style>

      <button
        onClick={handleClick}
        aria-label="Scroll to top"
        className={`group fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-visible transition-all duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Fire burst rings — shown on launch */}
        {launching && (
          <svg
            className="absolute pointer-events-none"
            style={{ width: 120, height: 120, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', overflow: 'visible', zIndex: 20 }}
            viewBox="0 0 120 120"
          >
            {/* Outer ring */}
            <circle
              cx="60" cy="60"
              className="fire-ring-1"
              fill="none"
              stroke="#E24B4A"
              strokeLinecap="round"
            />
            {/* Inner ring */}
            <circle
              cx="60" cy="60"
              className="fire-ring-2"
              fill="none"
              stroke="#EF9F27"
              strokeLinecap="round"
            />
            {/* Fire particles burst — 12 directions */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const dist = 38 + Math.random() * 10;
              const tx = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
              const colors = ['#E24B4A', '#EF9F27', '#FAC775', '#D85A30'];
              const color = colors[i % colors.length];
              const size = 4 + (i % 3) * 2;
              return (
                <circle
                  key={i}
                  cx="60" cy="60"
                  r={size / 2}
                  fill={color}
                  className="fire-particle"
                  style={{ '--tx': tx, animationDelay: `${i * 0.02}s` } as React.CSSProperties}
                />
              );
            })}
          </svg>
        )}

        {/* Progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
          <circle
            ref={circleRef}
            cx="28" cy="28" r="26"
            fill="none" stroke="#E24B4A" strokeWidth="2"
            strokeDasharray={DASH}
            strokeDashoffset={DASH - DASH * scrollPct}
            className="transition-[stroke-dashoffset] duration-100"
          />
        </svg>

        {/* Rocket */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`w-5 h-5 relative z-10 ${launching ? '[animation:launch_0.6s_ease-in-out_forwards]' : 'group-hover:[animation:launch_0.6s_ease-in-out_forwards]'}`}
        >
          <path d="M12 2C12 2 7 7 7 13c0 2.5 1 4.5 2.5 6L12 22l2.5-3C16 17.5 17 15.5 17 13 17 7 12 2 12 2Z" className="fill-zinc-900 dark:fill-white"/>
          <circle cx="12" cy="12" r="2.5" className="fill-white dark:fill-zinc-900"/>
          <path d="M7 16 L4 20 L8 19Z" className="fill-zinc-400"/>
          <path d="M17 16 L20 20 L16 19Z" className="fill-zinc-400"/>
        </svg>

        {/* Flame trail on hover */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {([['8px','10px','#E24B4A'],['5px','7px','#EF9F27'],['3px','5px','#FAC775']] as const).map(([w,h,c],i) => (
            <div key={i} style={{width:w,height:h,background:c,borderRadius:'50% 50% 50% 50% / 60% 60% 40% 40%',animation:`flicker 0.15s ${i*0.05}s infinite alternate`}}/>
          ))}
        </div>

        {/* Label */}
        <span className="absolute -bottom-6 right-0 text-[10px] tracking-widest uppercase text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap">
          launch
        </span>
      </button>
    </>
  );
};