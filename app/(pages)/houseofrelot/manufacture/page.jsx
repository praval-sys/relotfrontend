"use client";
import { useState } from 'react';
import { manufactureFaqs } from '../../../data/manufactureData';
import { ChevronDown, ChevronUp, Factory, Scissors, Info } from 'lucide-react';

export default function ManufacturePage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manufacturing Information
          </h1>
          <p className="text-lg text-gray-600">
            Learn about our manufacturing processes and products
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Factory className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Local Production</h3>
            <p className="text-gray-600">Manufactured in Indian facilities</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Scissors className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customization</h3>
            <p className="text-gray-600">Personalized services available</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Info className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Product Info</h3>
            <p className="text-gray-600">Detailed product information</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {manufactureFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
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
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}