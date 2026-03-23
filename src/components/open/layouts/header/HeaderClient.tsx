"use client";
import { useState } from "react";
import DesktopNav from "./DesktopNav";
import SearchDropdown from "../dropdown/SearchDropdown";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import { Menu } from "lucide-react";
import { User } from "@/types/open/user.type";
import HeaderIcons from "./HeaderIcons";
import './Header.css';

interface HeaderClientProps {
  userData: User | null;
  initialCount: number;
  initialWishlistCount: number;
}

export default function HeaderClient({ userData, initialCount, initialWishlistCount }: HeaderClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="hd-header">
        <div className="hd-inner max-w-primary px-primary">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-1">
            <button
              className="hd-menu-btn  block md:hidden! "
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <Logo />
          </div>

          {/* Center: desktop nav */}
          <DesktopNav />

          {/* Right: icons */}
          <HeaderIcons
            userData={userData}
            onSearchClick={() => setIsSearchOpen(!isSearchOpen)}
            initialCount={initialCount}
            initialWishlistCount={initialWishlistCount}
          />

        </div>
      </header>

      <SearchDropdown isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}