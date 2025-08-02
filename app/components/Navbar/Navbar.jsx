"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useSelector } from "react-redux"
import { useAuth } from "../../context/AuthContext"

import NavbarLogo from "./NavbarLogo"
import SearchBar from "./SearchBar"
import UserNavigation from "./UserNavigation"
import MobileMenu from "./MobileMenu"
import DesktopMenu from "./DesktopMenu"
import LanguageSelector from "./LanguageSelector"
import CartButton from "./cartButton"
import WishlistButton from "./WishListButton"

import { languages, menuData } from "../../../data/navbarData"
import AnnouncementBar from "./AnnouncementBar"

const Navbar = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [currentLanguage, setCurrentLanguage] = useState(languages[0])
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideHeader, setHideHeader] = useState(false);

  const { user, logout } = useAuth()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu") && !event.target.closest(".language-menu")) {
        setIsLanguageDropdownOpen(false)
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update the useEffect scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search when scrolling
  useEffect(() => {
    if (isScrolled && isSearchExpanded) {
      setIsSearchExpanded(false)
    }
  }, [isScrolled, isSearchExpanded])

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language)
    setIsLanguageDropdownOpen(false)
  }

  return (
    <header className="w-full">
      {/* Announcement Bar - Absolute positioned */}
      <div 
        className={`w-full bg-black transition-all duration-300 ease-in-out fixed top-0 z-30
          ${isScrolled ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="h-8 md:h-10">
          <AnnouncementBar />
        </div>
      </div>

      {/* Main Navbar - Fixed positioned */}
      <div className={`w-full fixed bg-white transition-all duration-300 ${
        isSearchExpanded ? 'z-30' : 'z-40'
      } ${isScrolled ? 'top-0 shadow-md' : 'top-[32px] md:top-[40px]'}`}>
        
        {/* Upper Section (Logo, Search, Icons) */}
        <div className={`w-full bg-white transition-all duration-300 overflow-hidden border-b border-gray-200 opacity-100
          ${isScrolled ? 'h-0 ' : 'h-auto '}`}
        >
          <div className="container mx-auto px-4 py-3 md:py-4">
            {/* Mobile Layout */}
            <div className="flex md:hidden items-center justify-between">
              {/* Left: Mobile menu button */}
              <div className="flex items-center w-1/4">
                <button
                  className="p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>

              {/* Center: Logo */}
              <div className="flex justify-center w-1/2">
                <NavbarLogo />
              </div>

              {/* Right: Icons */}
              <div className="flex items-center justify-end w-1/4 space-x-2">
                <UserNavigation />
                <WishlistButton />
                <CartButton />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center gap-4">
              {/* Left Side - Logo */}
              <div className="flex-shrink-0">
                <NavbarLogo />
              </div>

              {/* Center - Search Bar (Desktop only) */}
              <div className="flex flex-1 justify-center max-w-2xl mx-auto">
                <div className="w-full max-w-lg">
                  <SearchBar 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    isExpanded={isSearchExpanded}
                    setIsExpanded={setIsSearchExpanded}
                  />
                </div>
              </div>

              {/* Right Side - Icons */}
              <div className={`flex items-center space-x-2 md:space-x-4 flex-shrink-0`}>
                <UserNavigation style = {{height : "auto", opacity: "100"}}/>
                <WishlistButton />
                <CartButton />
              </div>
            </div>

            {/* Mobile Search Bar - Below main header on mobile only */}
            <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                isExpanded={isSearchExpanded}
                setIsExpanded={setIsSearchExpanded}
              />
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop Only */}
        <nav className="hidden md:block bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <ul className="flex items-center justify-center space-x-6">
              <DesktopMenu 
                menuData={menuData} 
                activeSubmenu={activeSubmenu} 
                setActiveSubmenu={setActiveSubmenu} 
              />
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={() => {}}
        user={user}
        logout={logout}
        menuData={menuData}
        currentLanguage={currentLanguage}
        languages={languages}
        handleLanguageChange={handleLanguageChange}
      />
    </header>
  )
}

export default Navbar
