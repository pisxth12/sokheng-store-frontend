'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/open/useAuth';
import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/sale', label: 'Sale',  },
  { href: '/about', label: 'About Us' },
];

const categories = ['Women', 'Men', 'Kids', 'Accessories'];

export default function MobileMenu({ isOpen, onClose }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop with fade animation */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose}
        onTransitionEnd={() => {
          if (!isOpen) setIsAnimating(false);
        }}
      />

      {/* Left sliding panel */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-darkbg shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold text-lg">Menu</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block p-3 hover:bg-gray-200/20 rounded-lg transition`}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            
          </nav>

          <div className="p-4 border-t">
            <p className="text-sm text-gray-500 text-center">
              © 2026 VANNESA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}