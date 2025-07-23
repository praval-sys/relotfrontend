"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Users,
  Settings,
  LogOut,
  Mail,
  Phone,
  Shield,
  Calendar,
  FileText
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/admin/dashboard",
    key: "dashboard",
  },
  {
    name: "Create Product",
    icon: <Plus className="w-5 h-5" />,
    path: "/admin/createProduct",
    key: "createProduct",
  },
  {
    name: "Products",
    icon: <Package className="w-5 h-5" />,
    path: "/admin/products",
    key: "products",
  },
  {
    name: "Orders",
    icon: <ShoppingCart className="w-5 h-5" />,
    path: "/admin/orders",
    key: "orders",
  },
  {
    name: "Blogs",
    icon: <FileText className="w-5 h-5" />,
    path: "/admin/blogs",
    key: "blogs",
  },
  {
    name: "Users",
    icon: <Users className="w-5 h-5" />,
    path: "/admin/users",
    key: "users",
  },
];

export default function AdminSideBar() {
  const [activeLink, setActiveLink] = useState("dashboard");
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl border-r border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {getInitials(user?.name)}
            </div>
            {user?.verified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                <Shield className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base text-white truncate">
              {user?.name || 'Admin User'}
            </h3>
            <p className="text-sm text-slate-300 truncate">
              {user?.role || 'ADMIN'}
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.phoneNumber && (
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>{user.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-slate-300">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>Joined {formatDate(user?.createdAt)}</span>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-600">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${user?.verified ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span className="text-xs text-slate-300">
                {user?.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-slate-300 capitalize">
                {user?.provider || 'Email'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.path}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeLink === item.key
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
            onClick={() => setActiveLink(item.key)}
          >
            <div className={`flex items-center justify-center flex-shrink-0 ${
              activeLink === item.key ? "text-white" : "text-slate-400 group-hover:text-white"
            }`}>
              {item.icon}
            </div>
            <span className="ml-3 whitespace-nowrap">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-700 space-y-2">
        {/* Settings */}
        <Link
          href="/admin/settings"
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
          onClick={() => setActiveLink("settings")}
        >
          <Settings className="w-5 h-5 text-slate-400 hover:text-white flex-shrink-0" />
          <span className="ml-3 whitespace-nowrap">Settings</span>
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-slate-400 hover:text-white flex-shrink-0" />
          <span className="ml-3 whitespace-nowrap">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
