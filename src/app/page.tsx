import SessionTest from '@/components/test/SessionTest';
import LanguageToggle from '@/components/ui/LanguageToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {getTranslations} from 'next-intl/server';

 
export default async function HomePage() {
  const t = await getTranslations('HomePage');
 
  return (
    <div className="min-h-screen">
      <ThemeToggle/>
      <LanguageToggle/>
      <SessionTest/>
      
       <h1 className="text-4xl font-bold mb-4">
        {t('title')}  {/* បង្ហាញ "Baby Shop" ឬ "ហាងទារក" */}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
        {t('welcome')}  {/* បង្ហាញសារស្វាគមន៍ */}
      </p>
      <p className="text-gray-500">
        {t('description')}  {/* បង្ហាញការពិពណ៌នា */}
      </p>
    </div>
  )
}