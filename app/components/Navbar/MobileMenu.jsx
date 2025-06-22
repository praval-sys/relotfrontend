"use client"

import { useState } from "react"
import Link from "next/link"
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
      className={`fixed top-0 right-0 w-[80%] h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } overflow-y-auto md:hidden shadow-xl`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white">
        <NavbarLogo />
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-neutral-50 rounded-full transition-colors"
        >
          <X className="h-6 w-6 text-neutral-900" />
        </button>
      </div>

      {/* Mobile search */}
      <div className="p-4 border-b border-neutral-100 bg-neutral-50">
       <SearchBar 
    searchQuery={searchQuery} 
    setSearchQuery={setSearchQuery} 
    isExpanded={false}
    setIsExpanded={() => {}} 
  />
      </div>

      {/* Mobile user info */}
      {user && (
        <div className="p-4 border-b border-neutral-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-neutral-900 flex items-center justify-center text-white">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover rounded-full" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="font-medium text-neutral-900">{user.name || "User"}</p>
              <p className="text-sm text-neutral-600 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation */}
      <nav className="flex flex-col h-full bg-white">
        <ul className="py-2 flex-grow">
          <li className="border-b border-neutral-100">
            <Link
              href="/"
              className="flex items-center py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5 mr-3 text-neutral-600" />
              Home
            </Link>
          </li>

          {menuData.map((item) => (
            <li className="border-b border-neutral-100" key={item.id}>
              <div
                className="flex items-center justify-between py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
                onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === item.id ? null : item.id)}
              >
                <Link href={item.link} className="flex-grow" onClick={(e) => item.submenu && e.preventDefault()}>
                  {item.label}
                </Link>
                {item.submenu && (
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-600 transition-transform ${
                      activeMobileSubmenu === item.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {item.submenu && activeMobileSubmenu === item.id && (
                <div className="bg-neutral-50">
                  {item.submenu.map((subItem, idx) => (
                    <div key={idx} className="border-t border-neutral-100">
                      <Link
                        href={subItem.link}
                        className="block py-3 px-8 hover:bg-neutral-100 text-neutral-900 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}

          {/* User related links */}
          {!user ? (
            <>
              <li className="border-b border-neutral-100">
                <Link
                  href="/login"
                  className="flex items-center py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-3 text-neutral-600" />
                  Login
                </Link>
              </li>
              <li className="border-b border-neutral-100">
                <Link
                  href="/register"
                  className="flex items-center py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-3 text-neutral-600" />
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="border-b border-neutral-100">
                <Link
                  href="/profile"
                  className="flex items-center py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-3 text-neutral-600" />
                  Profile
                </Link>
              </li>
              <li className="border-b border-neutral-100">
                <Link
                  href="/wishlist"
                  className="flex items-center py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5 mr-3 text-neutral-600" />
                  Wishlist
                </Link>
              </li>
              <li className="border-b border-neutral-100">
                <Link
                  href="/orders"
                  className="flex items-center py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5 mr-3 text-neutral-600" />
                  Orders
                </Link>
              </li>
              <li className="border-b border-neutral-100">
                <Link
                  href="/settings"
                  className="flex items-center py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5 mr-3 text-neutral-600" />
                  Settings
                </Link>
              </li>
              <li>
                <button
                  className="flex items-center w-full text-left py-3 px-4 hover:bg-neutral-50 text-neutral-900 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3 text-neutral-600" />
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default MobileMenu
