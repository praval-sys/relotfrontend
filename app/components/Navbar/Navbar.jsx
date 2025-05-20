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
import CartButton from "./CartButton"
import WishlistButton from "./WishlistButton"

import { languages, menuData } from "../../../data/navbarData"

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
    <header className="w-full border-b border-gray-200 fixed top-[40px] left-0 right-0 bg-white shadow-md z-40">
      {/* Top navbar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <NavbarLogo />

        {/* Search Bar (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Auth */}
          <UserNavigation  />

          {/* Wishlist */}
          <WishlistButton />

          {/* Cart */}
          <CartButton />
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
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

      {/* Desktop Navigation Menu */}
      <nav className="hidden md:block container mx-auto px-4 py-2">
        <ul className="flex items-center space-x-6">
          <DesktopMenu menuData={menuData} activeSubmenu={activeSubmenu} setActiveSubmenu={setActiveSubmenu} />

          {/* Language Selector */}
          <li className="relative ml-auto">
            <LanguageSelector
              currentLanguage={currentLanguage}
              languages={languages}
              isDropdownOpen={isLanguageDropdownOpen}
              setIsDropdownOpen={setIsLanguageDropdownOpen}
              handleLanguageChange={handleLanguageChange}
            />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
