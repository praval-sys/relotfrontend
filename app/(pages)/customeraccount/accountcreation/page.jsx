"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, ShoppingCart, Book, RefreshCw, History, Mail } from 'lucide-react';

export default function AccountCreationPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const accountBenefits = [
    {
      title: "Shopping Cart Access",
      description: "Go to your cart from any device",
      icon: <ShoppingCart className="h-12 w-12 text-teal-600" />
    },
    {
      title: "Address Management",
      description: "Manage your address book",
      icon: <Book className="h-12 w-12 text-teal-600" />
    },
    {
      title: "Returns & Exchanges",
      description: "Request returns or exchanges easily",
      icon: <RefreshCw className="h-12 w-12 text-teal-600" />
    },
    {
      title: "Order History",
      description: "Access orders and download invoices",
      icon: <History className="h-12 w-12 text-teal-600" />
    },
    {
      title: "Newsletter Preferences",
      description: "Manage your newsletter subscription",
      icon: <Mail className="h-12 w-12 text-teal-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Account
          </h1>
          <p className="text-lg text-gray-600">
            Enjoy these benefits with a Relot account
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {accountBenefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200"
            >
              <div className="mx-auto mb-4 flex justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account to access all these features and more
          </p>
          <div className="space-x-4">
            <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors duration-200">
              Create Account
            </button>
            <button className="border border-teal-600 text-teal-600 px-6 py-2 rounded-md hover:bg-teal-50 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center text-gray-600">
          <p>Already have an account? Sign in to access your account features.</p>
          <p className="mt-2">
            Need help? Contact our customer service at +91-9319198930
          </p>
        </div>
      </div>
    </div>
  );
}