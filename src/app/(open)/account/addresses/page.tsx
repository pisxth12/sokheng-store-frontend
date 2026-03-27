'use client';

import { useState, useEffect } from 'react';
import {
  MapPin, Clock, Phone, Wifi, Coffee, Leaf, Croissant,
  Navigation, Heart, Sun, Moon, MousePointer2, ArrowUpRight,
  Star
} from 'lucide-react';
import './addresses.css';  // ← Fixed import (no 'styles =', just import)

// ── Main Component ───────────────────────────────────────────
export default function Page() {
  const [saved, setSaved] = useState(false);



  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grain relative min-h-screen" style={{ background: 'var(--cream)', color: 'var(--espresso)' }}>

      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Dark Mode Toggle Button */}
     

      {/* Hero Section */}
      <header className="relative z-10 pt-24 pb-14 text-center px-4 sm:px-6">
        <p className="reveal d-1 mb-5 tracking-[0.45em] uppercase text-xs font-medium"
           style={{ color: 'var(--gold)' }}>
          Phnom Penh · Cambodia
        </p>

        <h1 className="hero-title reveal d-2">
          SAK COFFEE
          <span>Where every cup tells a story</span>
        </h1>

        <div className="hero-rule mx-auto mt-8 reveal d-3" style={{ maxWidth: '320px' }} />

        <div className="reveal d-4 flex items-center justify-center gap-1 mt-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
          ))}
          <span className="ml-2 text-xs tracking-widest uppercase" style={{ color: 'var(--bark)', fontWeight: 300 }}>
            4.9 · 320 reviews
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pb-24 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start  mx-auto">

          {/* Left Column */}
          <div className="space-y-5 lg:space-y-6">

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address - Full Width on Mobile */}
              <div className="info-card reveal-left d-3 sm:col-span-2 flex items-start gap-4">
                <div className="icon-wrap"><MapPin /></div>
                <div>
                  <p className="card-label mb-1">Location</p>
                  <p className="card-value">Street 566<br />Phnom Penh, Cambodia</p>
                </div>
              </div>

              {/* Hours */}
              <div className="info-card reveal-left d-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="icon-wrap"><Clock /></div>
                  <p className="card-label">Hours</p>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="card-value">Open Daily</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 5vw, 1.4rem)', fontWeight: 300, color: 'var(--espresso)' }}>
                      7 <span style={{ color: 'var(--gold)' }}>—</span> 21
                    </p>
                  </div>
                  <div className="hours-ring">
                    <svg viewBox="0 0 52 52">
                      <circle className="hours-ring-track" cx="26" cy="26" r="22" />
                      <circle className="hours-ring-fill" cx="26" cy="26" r="22" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="info-card reveal-left d-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="icon-wrap"><Phone /></div>
                  <p className="card-label">Contact</p>
                </div>
                <p className="card-value">
                  +855 12 345 678<br />
                  hello@sakcoffee.com
                </p>
              </div>

              {/* Features */}
              <div className="info-card reveal-left d-6 sm:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="icon-wrap"><Wifi /></div>
                  <p className="card-label">Amenities</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: <Wifi size={13} />, label: 'Free WiFi' },
                    { icon: <Coffee size={13} />, label: 'Specialty Beans' },
                    { icon: <Croissant size={13} />, label: 'Fresh Pastries' },
                    { icon: <Navigation size={13} />, label: 'Takeaway' },
                    { icon: <Leaf size={13} />, label: 'Eco-Friendly' },
                  ].map(({ icon, label }) => (
                    <span key={label} className="tag">{icon} {label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="deco-divider reveal d-6">
              <Coffee size={14} />
            </div>

            {/* About */}
            <div className="about-panel reveal d-7">
              <p className="card-label mb-2">Our Story</p>
              <h2 className="about-heading">A sanctuary for<br /><em>coffee lovers.</em></h2>
              <p className="about-body mt-4">
                Nestled in the heart of Phnom Penh, SAK COFFEE is more than just a coffee shop.
                We source our beans directly from sustainable farms in the Mondulkiri highlands —
                ensuring every cup is fresh, flavorful, and ethically produced.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { icon: <Coffee size={13} />, label: 'Specialty Coffee' },
                  { icon: <Leaf size={13} />, label: 'Locally Sourced' },
                  { icon: <Star size={13} />, label: 'Award-Winning' },
                ].map(({ icon, label }) => (
                  <span key={label} className="tag">{icon} {label}</span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 reveal d-8">
              <a
                href="https://www.google.com/maps/place/SAK+COFFEE/@11.1660254,104.7183453,854m"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Navigation size={16} />
                Get Directions
                <ArrowUpRight size={14} />
              </a>
              <button className="btn-secondary" onClick={handleSave}>
                <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved!' : 'Save Spot'}
              </button>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:sticky lg:top-16 reveal-scale d-4 ">
            <div className="map-card">
              <div className="map-header">
                <span className="map-title">Find Us</span>
                <span className="map-badge">
                  <span className="pulse-dot" />
                  Open now
                </span>
              </div>
              <div style={{ position: 'relative', minHeight: '300px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31233.68050848046!2d104.7209202!3d11.1660254!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31096d6a647b0fb7%3A0x27f27f3bd8ce56c2!2sSAK%20COFFEE!5e0!3m2!1sen!2s!4v1743077063982!5m2!1sen!2s"
                  style={{ width: '100%', height: '400px', border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SAK COFFEE Location Map"
                />
              </div>
              <div className="map-footer">
                <MousePointer2 size={13} />
                <span>Drag to explore · Scroll to zoom</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 reveal d-8">
              <MapPin size={13} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.76rem', letterSpacing: '0.1em', color: 'var(--bark)', fontWeight: 300 }}>
                Street 566, Phnom Penh, Cambodia
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-10 px-6">
        <div className="hero-rule mx-auto mb-6" style={{ maxWidth: '200px' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--bark)', fontWeight: 300 }}>
          "Life's too short for bad coffee."
        </p>
      </footer>
    </div>
  );
}