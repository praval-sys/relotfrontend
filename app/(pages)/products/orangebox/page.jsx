"use client";
import { useState } from 'react';
import { Package, ShoppingBag, Info } from 'lucide-react';
import Image from 'next/image';

export default function OrangeBoxPage() {
  const boxInfo = [
    {
      question: "Will my order be delivered in an orange box?",
      answer: "Your purchases are delivered in an orange box tied with a Bolduc ribbon, with the exception of fragrances, books, certain equestrian and bulky items.",
      icon: <Package className="h-12 w-12 text-orange-600" />
    },
    {
      question: "Are the orange boxes available for purchase?",
      answer: "The orange boxes are created for the products they contain and are not available for individual sale.",
      icon: <ShoppingBag className="h-12 w-12 text-orange-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The Relot Orange Box
          </h1>
          <p className="text-lg text-gray-600">
            Our iconic packaging tradition
          </p>
        </div>

        {/* Hero Section */}
        <div className="relative h-64 mb-12 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-orange-600/90 flex items-center justify-center">
            <Package className="h-24 w-24 text-white opacity-20" />
          </div>
          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">
                A Symbol of Excellence
              </h2>
              <p className="text-lg opacity-90">
                Each Relot orange box represents our commitment to quality and tradition
              </p>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid gap-6 mb-12">
          {boxInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                {info.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {info.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {info.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Box */}
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-orange-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Important Note
              </h3>
              <p className="text-orange-700">
                Our signature orange boxes are exclusively reserved for Relot purchases 
                and are an integral part of the Relot experience. Each box is 
                specially designed for its specific product.
              </p>
            </div>
          </div>
        </div>

        {/* Exclusions List */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Items Excluded from Orange Box Packaging
          </h3>
          <ul className="space-y-2">
            {['Fragrances', 'Books', 'Certain equestrian items', 'Bulky items'].map((item, index) => (
              <li 
                key={index}
                className="flex items-center gap-2 text-gray-600"
              >
                <div className="h-2 w-2 bg-orange-600 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}