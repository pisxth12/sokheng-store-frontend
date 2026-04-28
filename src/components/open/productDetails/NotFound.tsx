import { useTranslations } from "next-intl";
import Link from "next/link";

interface NotFoundProps{
    title?: string;
    message?:string;
    buttonText?: string;
    buttonLink?: string;
    error?:string |  null;
}

export const NotFound = ({title, message, buttonText, buttonLink, error}: NotFoundProps) => {
    const t = useTranslations('ProductDetail');

     return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Large 404 or icon for visual interest */}
        <div className="text-8xl mb-4 font-bold ">404</div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title || t('notFound.title')}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error || message || t('notFound.message') || "The product you're looking for doesn't exist."}
        </p>
        
        <Link 
          href={buttonLink || "/products"}
          className="inline-block    px-8 py-3   border-2  transition-colors font-medium"
        >
          {buttonText || t('notFound.button') || 'Back to Products'}
        </Link>
      </div>
    </div>
  );
};