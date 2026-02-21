// src/components/LanguageToggle.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageToggle() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('en');

  useEffect(() => {
    // Read cookie on client side
    const getLocaleFromCookie = () => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      return cookie || 'en';
    };
    
    setCurrentLocale(getLocaleFromCookie());
    
    // Optional: Listen for cookie changes
    const interval = setInterval(() => {
      setCurrentLocale(getLocaleFromCookie());
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'km' : 'en';
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
    >
      {currentLocale === 'en' ? 'KH' : 'EN'}
    </button>
  );
}