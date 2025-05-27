"use client";
import { useState } from 'react';
import { ShieldCheck, Store, Globe, AlertTriangle } from 'lucide-react';

export default function AuthenticationPage() {
  const purchaseChannels = [
    {
      title: "Official Website",
      description: "Shop securely at Relot.in",
      icon: <Globe className="h-12 w-12 text-green-600" />,
      link: "Visit Relot.in"
    },
    {
      title: "Relot Stores",
      description: "Visit our authorized retail locations",
      icon: <Store className="h-12 w-12 text-green-600" />,
      link: "Find a Store"
    },
    {
      title: "Authorized Distributors",
      description: "Shop at verified corner stores",
      icon: <ShieldCheck className="h-12 w-12 text-green-600" />,
      link: "View Distributors"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Authentication
          </h1>
          <p className="text-lg text-gray-600">
            Ensure your Relot product is genuine
          </p>
        </div>

        {/* Authentication Notice */}
        <div className="bg-green-50 border border-green-100 p-6 rounded-lg mb-12">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold text-green-900">
              Authentic Purchase Guarantee
            </h2>
          </div>
          <p className="text-green-700">
            The only way to guarantee the authenticity of an Relot product is through our official channels.
            Every purchase comes with an original invoice as proof of authenticity.
          </p>
        </div>

        {/* Official Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {purchaseChannels.map((channel, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200"
            >
              <div className="mx-auto mb-4 flex justify-center">
                {channel.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {channel.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {channel.description}
              </p>
              <button className="text-green-600 hover:text-green-700 font-medium">
                {channel.link} →
              </button>
            </div>
          ))}
        </div>

        {/* Warning Section */}
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Important Notice
              </h3>
              <p className="text-amber-700">
                We cannot guarantee nor verify the authenticity of items purchased 
                outside of official Relot points of sale. To protect yourself from 
                counterfeit products, always purchase through our authorized channels.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="mt-12 text-center text-gray-600">
          <p>
            Have questions about a product's authenticity?
            <br />
            Contact our customer service at +91-9319198930
          </p>
        </div>
      </div>
    </div>
  );
}