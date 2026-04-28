'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'km', label: 'Khmer' },
  { code: 'zh', label: 'Chinese' },
] as const;

type Locale = typeof LANGUAGES[number]['code'];

export default function LanguageToggle() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Account');

  useEffect(() => {
    setMounted(true);
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] as Locale;
    if (cookie && LANGUAGES.some(l => l.code === cookie)) {
      setCurrentLocale(cookie);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLocale(newLocale);
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <div className="account-setting-row account-lang-row">
      <div className="account-lang-left">
        <div className="account-lang-icon-wrapper">
          <Languages className="account-lang-icon" />
        </div>
        <span className="account-lang-label">{t('settings.language')}</span>
      </div>
      
      <div className="account-lang-select-wrapper">
        <select
          value={currentLocale}
          onChange={handleChange}
          className="account-lang-select"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <ChevronDown className="account-lang-arrow" />
      </div>
    </div>
  );
}