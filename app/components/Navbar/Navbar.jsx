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
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [currentLanguage, setCurrentLanguage] = useState(languages[0])

  const { user, logout } = useAuth()
  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity)

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

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    // Search logic here
  }

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language)
    setIsLanguageDropdownOpen(false)
  }

  return (
    <header className="w-full fixed top-0 left-0 right-0 bg-white z-40">
      {/* Announcement Bar */}
      <AnnouncementBar/>

      {/* Main Navbar */}
      <div className="fixed top-[40px] left-0 right-0 bg-white z-40 border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Search Bar - Now First */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                handleSearch={handleSearch} 
              />
            </div>

            {/* Logo - Now in Middle */}
            <div className="flex-shrink-0">
              <NavbarLogo />
            </div>

            {/* Icons - Now Last */}
            <div className="flex items-center space-x-4">
              <UserNavigation />
              <WishlistButton />
              <CartButton />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:block container mx-auto px-4 py-2 border-t border-gray-100">
          <ul className="flex items-center space-x-6">
            <DesktopMenu 
              menuData={menuData} 
              activeSubmenu={activeSubmenu} 
              setActiveSubmenu={setActiveSubmenu} 
            />
          </ul>
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
        handleSearch={handleSearch}
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
