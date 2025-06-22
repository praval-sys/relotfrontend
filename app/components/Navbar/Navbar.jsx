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
        <div className={`w-full bg-white transition-all duration-300 overflow-hidden border-b border-gray-200
          ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}
        >
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Search Bar - Now First */}
              <div className="hidden md:flex flex-1 max-w-xl w-80">
                <SearchBar 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  isExpanded={isSearchExpanded}
                  setIsExpanded={setIsSearchExpanded}
                />
              </div>

              {/* Logo - Now in Middle */}
              <div className="flex-shrink-0">
                <NavbarLogo />
              </div>

              {/* Icons - Now Last */}
              <div className="flex items-center space-x-2 md:space-x-4">
                <UserNavigation />
                <WishlistButton />
                <CartButton />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Always Visible */}
        <nav className="hidden md:block bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <ul className="flex items-center space-x-6">
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
          className="fixed inset-0 z-50 bg-black bg-opacity-50" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={() => {}} // Remove handleSearch as it's now handled internally
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
