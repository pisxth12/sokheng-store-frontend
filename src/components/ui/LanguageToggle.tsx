
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { Languages } from 'lucide-react';
// import { useTranslations } from 'next-intl';

// export default function LanguageToggle() {
//   const router = useRouter();
//   const [currentLocale, setCurrentLocale] = useState('en');
//   const [mounted, setMounted] = useState(false);
//   const t = useTranslations("Account");


//   useEffect(() => {
//     setMounted(true);
//     // Read cookie on client side
//     const getLocaleFromCookie = () => {
//       const cookie = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('NEXT_LOCALE='))
//         ?.split('=')[1];
//       return cookie || 'en';
//     };
    
//     setCurrentLocale(getLocaleFromCookie());
//   }, []);

//   const toggleLanguage = () => {
//     const newLocale = currentLocale === 'en' ? 'km' : 'en';
//     // Set cookie
//     document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
//     // Update state immediately for UI
//     setCurrentLocale(newLocale);
    
    
//     router.refresh();
//   };

//   if (!mounted) return null;

//   return (
//     <div className="flex items-center justify-between py-2">
//       <div className="flex items-center gap-2">
//         <Languages className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//         <span className="text-sm text-gray-700 dark:text-gray-300">
//           {t('settings.language')}
//         </span>
//       </div>
      
//       {/* Switch Toggle - Matches ThemeToggle exactly */}
//       <button
//         onClick={toggleLanguage}
//         className="
//           relative w-14 h-7 rounded-full
//           bg-gray-200 dark:bg-gray-700
//           checked:bg-blue-500
//           transition-colors duration-300
//           focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1
//           dark:focus:ring-offset-gray-900
//         "
//         aria-label="Toggle language"
//       >
//         {/* Switch Knob */}
//         <div
//           className={`
//             absolute top-1 left-1
//             w-5 h-5 rounded-full
//             bg-white dark:bg-gray-200
//             shadow-md
//             transform transition-transform duration-300 ease-in-out
//             flex items-center justify-center
//             ${currentLocale === 'km' ? 'translate-x-7' : 'translate-x-0'}
//           `}
//         >
//           <span className="text-[9px] font-medium text-gray-700 dark:text-gray-700">
//             {currentLocale === 'en' ? 'EN' : 'KH'}
//           </span>
//         </div>

//         {/* Background Labels */}
//         <span className={`
//           absolute left-3 top-1/2 -translate-y-1/2
//           text-[10px] font-medium
//           transition-opacity duration-300
//           ${currentLocale === 'en' ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}
//         `}>
          
//         </span>
//         <span className={`
//           absolute right-3 top-1/2 -translate-y-1/2
//           text-[10px] font-medium
//           transition-opacity duration-300
//           ${currentLocale === 'km' ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}
//         `}>
          
//         </span>
//       </button>
//     </div>
//   );
// }

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Language options
const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'km', label: 'KH', name: 'Khmer' },
  { code: 'zh', label: 'ZH', name: 'Chinese' }
] as const;

type Locale = typeof LANGUAGES[number]['code'];

export default function LanguageToggle() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Account");

  useEffect(() => {
    setMounted(true);
    // Read cookie on client side
    const getLocaleFromCookie = (): Locale => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1] as Locale;
      
      // Validate if cookie value is a valid locale
      if (cookie && LANGUAGES.some(lang => lang.code === cookie)) {
        return cookie;
      }
      return 'en';
    };
    
    setCurrentLocale(getLocaleFromCookie());
  }, []);

  const toggleLanguage = () => {
    // Find current index and get next language
    const currentIndex = LANGUAGES.findIndex(lang => lang.code === currentLocale);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    const newLocale = LANGUAGES[nextIndex].code;
    
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Update state immediately for UI
    setCurrentLocale(newLocale);
    
    router.refresh();
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.code === currentLocale) || LANGUAGES[0];
  };

  if (!mounted) return null;

  const currentLang = getCurrentLanguage();

  // Calculate knob position (0%, 50%, 100%)
  const getKnobPosition = () => {
    const index = LANGUAGES.findIndex(lang => lang.code === currentLocale);
    switch(index) {
      case 0: return 'translate-x-0';      // EN
      case 1: return 'translate-x-7';      // KH
      case 2: return 'translate-x-[56px]'; // ZH (14px * 4 = 56px)
      default: return 'translate-x-0';
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Languages className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {t('settings.language')}
        </span>
      </div>
      
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="
          relative w-20 h-7 rounded-full
          bg-gray-200 dark:bg-gray-700
          transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1
          dark:focus:ring-offset-gray-900
          overflow-hidden
        "
        aria-label="Toggle language"
      >
        {/* Background Labels - All three languages */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-medium">
          <span className={`
            w-5 text-center
            ${currentLocale === 'en' ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}
          `}>
           {currentLang.label === 'EN' ? '' : 'EN'}
          </span>
          <span className={`
            w-5 text-center
            ${currentLocale === 'km' ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}
          `}>
            {currentLang.label === 'KH' ? '' : 'KH'}
          </span>
          <span className={`
            w-5 text-center
            ${currentLocale === 'zh' ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}
          `}>
              {currentLang.label === 'ZH' ? '' : 'ZH'}
          </span>
        </div>

        {/* Switch Knob */}
        <div
          className={`
            absolute top-1 ${currentLang.label === 'ZH'? 'left-0' : 'left-1'}
            w-5 h-5 rounded-full
            bg-white dark:bg-gray-200
            shadow-md
            transform transition-transform duration-300 ease-in-out
            flex items-center justify-center
            ${getKnobPosition()}
          `}
        >
          <span className="text-[9px] font-medium text-gray-700 dark:text-gray-700">
            {currentLang.label}
          </span>
        </div>
      </button>
    </div>
  );
}