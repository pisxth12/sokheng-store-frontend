"use client"
import { useContact } from '@/hooks/open/useSocialsContact';
import { Facebook, Phone, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';

// TikTok icon as SVG component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.07-1.07.07-2.15.41-3.17.86-2.49 3.18-4.48 5.82-4.72 1.15-.13 2.31.02 3.42.42v4.15c-.84-.33-1.74-.5-2.64-.42-1.65.13-3.19 1.32-3.77 2.88-.29.76-.33 1.58-.21 2.38.26 1.41 1.44 2.61 2.87 2.98.84.21 1.74.15 2.57-.13.95-.32 1.77-1.02 2.22-1.91.19-.37.3-.78.32-1.2.06-2.94.03-5.89.04-8.83 0-.01 5.02 0 5.02 0z"/>
  </svg>
);

// Telegram icon as SVG component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.43.52-.47-.01-1.37-.26-2.04-.48-.83-.27-1.49-.41-1.43-.87.03-.24.27-.48.74-.74 2.94-1.28 4.9-2.13 5.89-2.54 2.8-1.16 3.38-1.36 3.76-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.08-.03.24-.06.37z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { contacts, loading, error } = useContact();

  // Show loading state
  if (loading) {
    return (
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-pink-500" />
        </div>
      </footer>
    );
  }

  // Show error state (still show basic copyright)
  if (error || !contacts) {
    return (
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} BabyShop. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright - Left */}
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light tracking-wide">
            © {currentYear} <span className="font-semibold text-green-600">BabyShop</span>. All rights reserved.
          </p>
          
          {/* Contact & Social - Right */}
          <div className="flex items-center gap-6">
            
            {/* Phone - Now showing number */}
            {contacts.phone && (
              <a 
                href={`tel:${contacts.phone}`}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400  transition-all duration-300 group"
                aria-label="Call us"
              >
                <div className="p-2 rounded-full  group-hover:bg-pink-100 dark:group-hover:bg-pink-900/50 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-blue-700" />
                </div>
                <span className="font-mono">{contacts.phone}</span>
              </a>
            )}

            {/* Social Icons Divider */}
            <span className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700" />

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              
              {/* Facebook */}
              {contacts.facebook && (
                <Link 
                  href={contacts.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* TikTok */}
              {contacts.tiktok && (
                <Link 
                  href={contacts.tiktok.startsWith('http') ? contacts.tiktok : `https://tiktok.com/@${contacts.tiktok}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 transition-all duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Telegram */}
              {contacts.telegram && (
                <Link 
                  href={contacts.telegram.startsWith('http') ? contacts.telegram : `https://t.me/${contacts.telegram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 transition-all duration-300"
                  aria-label="Telegram"
                >
                  <TelegramIcon className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Google Maps */}
              {contacts.googleMap && (
                <Link 
                  href={contacts.googleMap} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 transition-all duration-300"
                  aria-label="Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;