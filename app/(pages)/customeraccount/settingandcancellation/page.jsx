"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Settings, Mail, MapPin, Trash2, BellRing } from 'lucide-react';

export default function SettingsAndCancellationPage() {
  const accountSettings = [
    {
      title: "Email & Password",
      description: "Update your login credentials",
      icon: <Mail className="h-12 w-12 text-red-600" />,
      action: "Change",
      link: "/profile"
    },
    {
      title: "Saved Addresses",
      description: "Manage your delivery locations",
      icon: <MapPin className="h-12 w-12 text-red-600" />,
      action: "Edit",
      link: "/profile"
    },
    {
      title: "Newsletter Preferences",
      description: "Control your subscription settings",
      icon: <BellRing className="h-12 w-12 text-red-600" />,
      action: "Manage",
      link: "/contactus"
    },
    {
      title: "Account Deletion",
      description: "Permanently remove your account",
      icon: <Trash2 className="h-12 w-12 text-red-600" />,
      action: "Contact Support",
      link: "/contactus"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Account Settings
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Overview Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Settings className="h-8 w-8 text-red-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Account Management
            </h2>
          </div>
          <p className="text-gray-600">
            Sign in to "your account" to access these settings and make changes to your profile
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {accountSettings.map((setting, index) => (
            <Link 
              key={index}
              href={setting.link}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 block group"
            >
              <div className="flex items-center gap-4 mb-4">
                {setting.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {setting.title}
                  </h3>
                  <p className="text-gray-600">
                    {setting.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200">
                {setting.action} →
              </div>
            </Link>
          ))}
        </div>

        {/* Account Deletion Notice */}
        <div className="bg-red-50 border border-red-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Want to Delete Your Account?
          </h3>
          <p className="text-red-700 mb-4">
            To delete your Relot.in account, please contact our Customer Service team. We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/contactus"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-200 text-center font-medium"
            >
              Contact Support
            </Link>
            <Link 
              href="/help/account-deletion"
              className="border border-red-600 text-red-600 px-6 py-3 rounded-md hover:bg-red-50 transition-colors duration-200 text-center font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/orders"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                <span className="text-red-600 text-sm font-medium">📦</span>
              </div>
              <span className="text-gray-700 group-hover:text-red-600 font-medium">My Orders</span>
            </Link>

            <Link 
              href="/wishlist"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                <span className="text-red-600 text-sm font-medium">❤️</span>
              </div>
              <span className="text-gray-700 group-hover:text-red-600 font-medium">Wishlist</span>
            </Link>

            <Link 
              href="/rewards"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                <span className="text-red-600 text-sm font-medium">🏆</span>
              </div>
              <span className="text-gray-700 group-hover:text-red-600 font-medium">Rewards</span>
            </Link>

            <Link 
              href="/help"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                <span className="text-red-600 text-sm font-medium">❓</span>
              </div>
              <span className="text-gray-700 group-hover:text-red-600 font-medium">Help Center</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}