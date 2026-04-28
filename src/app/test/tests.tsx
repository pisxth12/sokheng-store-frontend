
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslations } from 'next-intl';

export default function TestPages() {
  const t = useTranslations('DesktopNav');
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Translation Test Page</h1>
      
      <div className="mb-8">
        <LanguageToggle />
      </div>

      <div className="space-y-4 border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">DesktopNav Translations:</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="font-medium">products:</div>
          <div className="text-blue-600">"{t('products')}"</div>
          
          <div className="font-medium">sale:</div>
          <div className="text-blue-600">"{t('sale')}"</div>
          
          <div className="font-medium">about:</div>
          <div className="text-blue-600">"{t('about')}"</div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h3 className="font-medium mb-2">Debug Info:</h3>
        <p>Cookie: <span id="cookie-display" className="font-mono"></span></p>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('cookie-display').innerText = 
            document.cookie || 'No cookie set';
        `
      }} />
    </div>
  );
}