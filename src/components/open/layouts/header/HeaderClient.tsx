"use client";
import { useState } from "react";
import DesktopNav from "./DesktopNav";
import SearchDropdown from "../dropdown/SearchDropdown";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import { Menu } from "lucide-react";
import { CartSideBar } from "../cart/CartSidebar";
import { User } from "@/types/open/user.type";
import HeaderIcons from "./HeaderIcons";


interface HeaderClientProps {
  userData: User | null;
  initialCount: number;
  initialWishlistCount: number;
}
export default function HeaderClient({ userData ,initialCount, initialWishlistCount}: HeaderClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [isCartOpen, setIsCartOpen] = useState(false);

  

  return (
    <>
      <header className="bg-white  dark:bg-darkbg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
        <div className=" mx-auto max-w-primary  ">
          <div className="flex items-center justify-between h-16 px-3">
            <div className="flex items-center space-x-1 ">
              <Menu
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer md:hidden  "
              />
              <Logo />
            </div>
            <DesktopNav />
            <HeaderIcons
              userData={userData}
              onSearchClick={() => setIsSearchOpen(!isSearchOpen)}
              initialCount={initialCount}
              initialWishlistCount={initialWishlistCount}
            />
          </div>
        </div>
      </header>
      <SearchDropdown
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      {/* <CartSideBar  isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}   user={userData}   /> */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
