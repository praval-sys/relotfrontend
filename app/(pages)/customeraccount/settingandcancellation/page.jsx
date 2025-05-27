"use client";
import { useState } from 'react';
import { Settings, Mail, MapPin, Trash2, BellRing } from 'lucide-react';

export default function SettingsAndCancellationPage() {
  const accountSettings = [
    {
      title: "Email & Password",
      description: "Update your login credentials",
      icon: <Mail className="h-12 w-12 text-orange-600" />,
      action: "Change"
    },
    {
      title: "Saved Addresses",
      description: "Manage your delivery locations",
      icon: <MapPin className="h-12 w-12 text-orange-600" />,
      action: "Edit"
    },
    {
      title: "Newsletter Preferences",
      description: "Control your subscription settings",
      icon: <BellRing className="h-12 w-12 text-orange-600" />,
      action: "Manage"
    },
    {
      title: "Account Deletion",
      description: "Permanently remove your account",
      icon: <Trash2 className="h-12 w-12 text-orange-600" />,
      action: "Contact Support"
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
            <Settings className="h-8 w-8 text-orange-600" />
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
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                {setting.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {setting.title}
                  </h3>
                  <p className="text-gray-600">
                    {setting.description}
                  </p>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-md transition-colors duration-200">
                {setting.action} →
              </button>
            </div>
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
          <div className="flex gap-4">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200">
              Contact Support
            </button>
            <button className="border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}