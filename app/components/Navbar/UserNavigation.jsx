"use client"
import { useState, useEffect } from 'react'
import Link from "next/link"
import { User, LogOut, ShoppingBag, Heart, Settings, ChevronDown } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from '../../context/AuthContext'

const UserNavigation = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, loading } = useAuth()

  const handleLogout = async (e) => {
    try {
      e.preventDefault()
      await logout()
      setUserMenuOpen(false)
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
  }

  if (user) {
    return (
      <div className="relative user-menu">
        <button
          className="flex items-center space-x-1 group"
          onClick={(e) => {
            e.stopPropagation()
            setUserMenuOpen(!userMenuOpen)
          }}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white overflow-hidden group-hover:shadow-md transition-all">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg py-1 z-20 border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
              <p className="font-semibold text-gray-800">{user.name || "User"}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2.5 text-sm hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-3 text-gray-400" />
                Profile
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center px-4 py-2.5 text-sm hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <Heart className="h-4 w-4 mr-3 text-gray-400" />
                Wishlist
              </Link>
              <Link
                href="/orders"
                className="flex items-center px-4 py-2.5 text-sm hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <ShoppingBag className="h-4 w-4 mr-3 text-gray-400" />
                Orders
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2.5 text-sm hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-3 text-gray-400" />
                Settings
              </Link>
            </div>

            <div className="border-t border-gray-100 mt-1">
              <button
                className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLogout(e)
                }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <Link
        href="/login"
        className="flex items-center text-sm font-medium hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
      >
        <User className="h-4 w-4 mr-1.5 sm:mr-2" />
        <span className="hidden sm:inline">Login</span>
      </Link>
      <Link
        href="/register"
        className="hidden sm:flex items-center text-sm font-medium bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 transition-colors"
      >
        <span>Register</span>
      </Link>
    </div>
  )
}

export default UserNavigation
