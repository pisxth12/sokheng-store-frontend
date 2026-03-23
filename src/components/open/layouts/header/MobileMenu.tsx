'use client';
import { X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Header.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/sale',     label: 'Sale', sale: true },
  { href: '/about',    label: 'About Us' },
];

export default function MobileMenu({ isOpen, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
      document.body.style.overflow = 'hidden';
    } else if (visible) {
      setClosing(true);
      setTimeout(() => { setVisible(false); setClosing(false); }, 280);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setVisible(false); setClosing(false); onClose(); }, 280);
  };

  if (!visible || !mounted) return null;

  return createPortal(
    <div className="md:hidden">
      <div
        className={`mm-overlay ${closing ? 'mm-overlay--closing' : ''}`}
        onClick={handleClose}
      />
      <div className={`mm-panel ${closing ? 'mm-panel--closing' : ''}`}>

        {/* Header */}
        <div className="mm-header">
          <span className="mm-header-logo">PISETH SORN</span>
          <button className="mm-close-btn" onClick={handleClose} aria-label="Close">
            <X size={13} />
          </button>
        </div>

        {/* Nav */}
        <nav className="mm-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mm-nav-link ${link.sale ? 'mm-nav-link--sale' : ''}`}
              onClick={handleClose}
            >
              {link.label}
              <ChevronRight size={13} strokeWidth={1.5} />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mm-footer">
          <p className="mm-footer-copy">© 2026 Piseth Sorn</p>
        </div>

      </div>
    </div>,
    document.body
  );
}