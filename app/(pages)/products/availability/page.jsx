"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Store, RefreshCw, Search, Sprout } from 'lucide-react';

export default function AvailabilityPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const availabilityInfo = [
    {
      question: "Where can I purchase Relot leather goods?",
      answer: "Relot leather goods may be purchased exclusively at Relot's stores and Relot.in. The Kelly, Birkin, and Constance handbags are sold exclusively in Relot's stores. We invite you to visit your local Relot store to discuss availability and recommend making an appointment if available.",
      icon: <Store className="h-12 w-12 text-amber-600" />
    },
    {
      question: "How often are items replenished?",
      answer: "Our products are created by hand and must meet strict quality criteria from selecting the natural materials to the production of the completed item. We invite you to visit the website frequently and your local store. You may also contact us to review available products.",
      icon: <RefreshCw className="h-12 w-12 text-amber-600" />
    },
    {
      question: "Why can't I find an item on the website?",
      answer: "Each Relot store is free to choose their own assortment. The Relot.in site offers a selection of products that are all in stock. As our offering is constantly being updated, we invite you to check back regularly. You may search our site by entering your request in the \"search an item\" field located at the top left of your screen. Our Customer Service department is at your disposal to assist, contact us by email or telephone at +91-9319198930, option 1, Monday through Friday from 9:00 a.m. to 6 p.m. and Saturday from 10 a.m. to 6 p.m EST.",
      icon: <Search className="h-12 w-12 text-amber-600" />
    },
    {
      question: "How may I receive a sample of your fragrance?",
      answer: "We would be happy to send you a sample of your requested fragrance, subject to availability. Please contact us by email with your complete mailing address. You may also visit one of our stores where one of our sales associates can present our entire fragrance collection to you with fragrance testers and provide you with samples, subject to availability.",
      icon: <Sprout className="h-12 w-12 text-amber-600" />
    }
  ];

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Availability
          </h1>
          <p className="text-lg text-gray-600">
            Information about product availability and store locations
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {availabilityInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200"
            >
              <div className="mx-auto mb-4 flex justify-center">
                {info.icon}
              </div>
              <h3 className="text-sm font-semibold">
                {info.question.split('?')[0].split(' ').slice(0, 3).join(' ')}...
              </h3>
            </div>
          ))}
        </div>

        {/* Store Locator Banner */}
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-lg mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Store className="h-8 w-8 text-amber-600" />
              <div>
                <h2 className="text-xl font-semibold text-amber-900">Find a Store</h2>
                <p className="text-amber-700">Visit your nearest Relot store</p>
              </div>
            </div>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors duration-200" onClick={() => window.location.href = '/contactus'}>
              Store Locator
            </button>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {availabilityInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="text-lg font-medium text-gray-900">
                  {info.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {info.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center text-gray-600">
          <p>Need more information about product availability?</p>
          <p className="mt-2">
            Contact our customer service at +91-9319198930
            <br />
            Monday - Friday: 9:00 AM - 6:00 PM
            <br />
            Saturday: 10:00 AM - 6:00 PM EST
          </p>
        </div>
      </div>
    </div>
  );
}