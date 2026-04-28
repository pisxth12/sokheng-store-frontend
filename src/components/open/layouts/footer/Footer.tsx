"use client";
import { ContactInfo } from "@/types/open/socialsContact.type";
import { Phone } from "lucide-react";
import Link from "next/link";
import "./Footer.css";

interface FooterProps {
  contactInfo: ContactInfo | null;
}

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.07-1.07.07-2.15.41-3.17.86-2.49 3.18-4.48 5.82-4.72 1.15-.13 2.31.02 3.42.42v4.15c-.84-.33-1.74-.5-2.64-.42-1.65.13-3.19 1.32-3.77 2.88-.29.76-.33 1.58-.21 2.38.26 1.41 1.44 2.61 2.87 2.98.84.21 1.74.15 2.57-.13.95-.32 1.77-1.02 2.22-1.91.19-.37.3-.78.32-1.2.06-2.94.03-5.89.04-8.83 0-.01 5.02 0 5.02 0z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.43.52-.47-.01-1.37-.26-2.04-.48-.83-.27-1.49-.41-1.43-.87.03-.24.27-.48.74-.74 2.94-1.28 4.9-2.13 5.89-2.54 2.8-1.16 3.38-1.36 3.76-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.08-.03.24-.06.37z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function Footer({ contactInfo }: FooterProps) {
  const year = new Date().getFullYear();
  if (!contactInfo) return null;

  return (
    <footer className="ft-footer">
      <div className="ft-inner">

        {/* ── Brand ── */}
        <div className="ft-brand">
          <span className="ft-brand-name">BabyShop</span>
          <span className="ft-brand-sep" />
          <span className="ft-copy">© {year} All rights reserved</span>
        </div>

        {/* ── Right ── */}
        <div className="ft-right">

          {/* Phone */}
          {contactInfo.phone && (
            <a href={`tel:${contactInfo.phone}`} className="ft-phone">
              <Phone size={13} className="ft-phone-icon" />
              {contactInfo.phone}
            </a>
          )}

          <span className="ft-divider" />

          {/* Socials */}
          <div className="ft-socials">
            {contactInfo.facebook && (
              <Link href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="ft-social-link" aria-label="Facebook">
                <FacebookIcon />
              </Link>
            )}
            {contactInfo.tiktok && (
              <Link
                href={contactInfo.tiktok.startsWith("http") ? contactInfo.tiktok : `https://tiktok.com/@${contactInfo.tiktok}`}
                target="_blank" rel="noopener noreferrer"
                className="ft-social-link" aria-label="TikTok"
              >
                <TikTokIcon />
              </Link>
            )}
            {contactInfo.telegram && (
              <Link
                href={contactInfo.telegram.startsWith("http") ? contactInfo.telegram : `https://t.me/${contactInfo.telegram}`}
                target="_blank" rel="noopener noreferrer"
                className="ft-social-link" aria-label="Telegram"
              >
                <TelegramIcon />
              </Link>
            )}
            {contactInfo.googleMap && (
              <Link href={contactInfo.googleMap} target="_blank" rel="noopener noreferrer" className="ft-social-link" aria-label="Location">
                <MapPinIcon />
              </Link>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
}