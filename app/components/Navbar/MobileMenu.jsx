"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Home, User, Heart, ShoppingBag, Settings, LogOut, ChevronDown } from "lucide-react"
import toast from "react-hot-toast"
import SearchBar from "./SearchBar"
import NavbarLogo from "./NavbarLogo"

const MobileMenu = ({
  isOpen,
  setIsOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  user,
  logout,
  menuData,
  currentLanguage,
  languages,
  handleLanguageChange,
}) => {
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null)
  const [activeMobileNestedSubmenu, setActiveMobileNestedSubmenu] = useState(null)

  const handleLogout = async (e) => {
    try {
      e.preventDefault()
      await logout()
      setIsOpen(false)
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  return (
    <div
      className={`fixed top-10 left-0 w-4/5 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } overflow-y-auto md:hidden`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <NavbarLogo />
        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile search */}
      <div className="p-4 border-b border-gray-200">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
      </div>

      {/* Mobile user info */}
      {user && (
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="font-medium">{user.name || "User"}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation */}
      <nav className="flex flex-col h-full">
        <ul className="py-2 flex-grow">
          <li className="border-b border-gray-200">
            <Link
              href="/"
              className="flex items-center py-3 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5 mr-3 text-gray-400" />
              Home
            </Link>
          </li>

          {menuData.map((item) => (
            <li className="border-b border-gray-200" key={item.id}>
              <div
                className="flex items-center justify-between py-3 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
                onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === item.id ? null : item.id)}
              >
                <Link href={item.link} className="flex-grow" onClick={(e) => item.submenu && e.preventDefault()}>
                  {item.label}
                </Link>
                {item.submenu && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${activeMobileSubmenu === item.id ? "rotate-180" : ""}`}
                  />
                )}
              </div>

              {item.submenu && activeMobileSubmenu === item.id && (
                <div className="bg-gray-50">
                  {item.submenu.map((subItem, idx) => (
                    <div key={idx} className="border-t border-gray-200">
                      {subItem.submenu ? (
                        <div>
                          <div
                            className="flex items-center justify-between py-3 px-8 hover:bg-gray-100 hover:text-red-600 transition-colors"
                            onClick={() => setActiveMobileNestedSubmenu(activeMobileNestedSubmenu === idx ? null : idx)}
                          >
                            <Link href={subItem.link} className="flex-grow" onClick={(e) => e.preventDefault()}>
                              {subItem.label}
                            </Link>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${activeMobileNestedSubmenu === idx ? "rotate-180" : ""}`}
                            />
                          </div>

                          {activeMobileNestedSubmenu === idx && (
                            <div className="bg-gray-100">
                              {subItem.submenu.map((nestedItem, nestedIdx) => (
                                <div key={nestedIdx} className="border-t border-gray-200">
                                  <Link
                                    href={nestedItem.link}
                                    className="block py-3 px-12 hover:bg-gray-200 hover:text-red-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {nestedItem.label}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={subItem.link}
                          className="block py-3 px-8 hover:bg-gray-100 hover:text-red-600 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      )}

                      {/* Show image for top-level submenu items */}
                      {subItem.image && (
                        <div className="px-8 pb-3">
                          <div className="rounded-md overflow-hidden">
                            <Image
                              src={subItem.image || "/placeholder.svg"}
                              alt={subItem.label}
                              width={300}
                              height={100}
                              className="w-full h-24 object-cover"
                            />
                            <div className="bg-gray-100 px-3 py-1.5 text-xs font-medium">Shop {subItem.label}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}

          {!user && (
            <>
              <li className="border-b border-gray-200">
                <Link
                  href="/login"
                  className="flex items-center py-3 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-3 text-gray-400" />
                  Login
                </Link>
              </li>
              <li className="border-b border-gray-200">
                <Link
                  href="/register"
                  className="flex items-center py-3 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-3 text-gray-400" />
                  Register
                </Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li className="border-b border-gray-200">
                <Link
                  href="/profile"
                  className="flex items-center py-3 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-3 text-gray-400" />
                  Profile
                </Link>
              </li>
              <li className="border-b border-gray-200">
                <Link
                  href="/wishlist"
                  className="flex items-center py-3 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5 mr-3 text-gray-400" />
                  Wishlist
                </Link>
              </li>
              <li className="border-b border-gray-200">
                <Link
                  href="/orders"
                  className="flex items-center py-3 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5 mr-3 text-gray-400" />
                  Orders
                </Link>
              </li>
              <li className="border-b border-gray-200">
                <Link
                  href="/settings"
                  className="flex items-center py-3 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5 mr-3 text-gray-400" />
                  Settings
                </Link>
              </li>
              <li className="border-b border-gray-200">
                <button
                  className="flex items-center w-full text-left py-3 px-4 hover:bg-red-50 text-red-600 transition-colors"
                  onClick={(e) => handleLogout(e)}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile language switcher */}
        <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Select Language</p>
          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`flex items-center w-full py-2 px-2 rounded-md hover:bg-gray-100 ${
                  currentLanguage.code === lang.code ? "bg-red-50 text-red-600" : ""
                }`}
                onClick={() => {
                  handleLanguageChange(lang)
                  setIsOpen(false)
                }}
              >
                <Image
                  src={lang.flag || "/placeholder.svg"}
                  alt={`${lang.name} Flag`}
                  width={24}
                  height={16}
                  className="mr-2"
                />
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default MobileMenu
