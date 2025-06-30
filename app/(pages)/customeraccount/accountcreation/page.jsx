"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, ShoppingCart, Book, RefreshCw, History, Mail } from 'lucide-react';

export default function AccountCreationPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();

  // ✅ Handle redirect to register page
  const handleCreateAccount = () => {
    router.push('/register');
  };

  const accountBenefits = [
    {
      title: "Shopping Cart Access",
      description: "Go to your cart from any device",
      icon: <ShoppingCart className="h-12 w-12 text-red-600" />
    },
    {
      title: "Address Management",
      description: "Manage your address book",
      icon: <Book className="h-12 w-12 text-red-600" />
    },
    {
      title: "Returns & Exchanges",
      description: "Request returns or exchanges easily",
      icon: <RefreshCw className="h-12 w-12 text-red-600" />
    },
    {
      title: "Order History",
      description: "Access orders and download invoices",
      icon: <History className="h-12 w-12 text-red-600" />
    },
    {
      title: "Newsletter Preferences",
      description: "Manage your newsletter subscription",
      icon: <Mail className="h-12 w-12 text-red-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ✅ Updated header with red accent */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your <span className="text-red-600">Relot Account</span>
          </h1>
          <p className="text-lg text-gray-600">
            Unlock exclusive benefits and enjoy a personalized shopping experience
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* ✅ Benefits Grid with red accents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {accountBenefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-lg hover:border-red-200 border border-transparent transition-all duration-300 transform hover:-translate-y-1"
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
              {/* ✅ Added red accent bar */}
              <div className="w-12 h-0.5 bg-red-500 mx-auto mt-4 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* ✅ Call to Action with red design */}
        <div className="bg-white p-8 rounded-lg shadow-sm text-center border-t-4 border-red-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account to access all these features and more
          </p>
          <div className="space-x-4">
            {/* ✅ Updated Create Account button with red styling and onclick handler */}
            <button 
              onClick={handleCreateAccount}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
            {/* ✅ Commented out Learn More button */}
            {/* <button className="border border-red-600 text-red-600 px-6 py-2 rounded-md hover:bg-red-50 transition-colors duration-200">
              Learn More
            </button> */}
          </div>
        </div>

        {/* ✅ Additional Information with red accents */}
        <div className="mt-12 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
            <p className="text-gray-700 font-medium mb-2">
              Already have an account? 
              <button 
                onClick={() => router.push('/login')}
                className="text-red-600 hover:text-red-700 ml-1 font-semibold underline decoration-red-300 hover:decoration-red-500 transition-colors"
              >
                Sign in here
              </button>
            </p>
            <p className="text-gray-600">
              Need help? Contact our customer service at 
              <a 
                href="tel:+91-9319198930" 
                className="text-red-600 hover:text-red-700 ml-1 font-semibold"
              >
                +91-9319198930
              </a>
            </p>
          </div>
        </div>

        {/* ✅ Added feature highlights section */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-lg border border-red-100">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            Why Choose <span className="text-red-600">Relot</span>?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Free shipping on orders over ₹2000</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Easy 30-day returns</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Exclusive member discounts</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}