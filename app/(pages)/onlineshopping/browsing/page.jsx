"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Monitor, Palette } from 'lucide-react';

export default function BrowsingPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const browsingInfo = [
    {
      question: "What is the availability status of items on the site?",
      answer: "All items for sale on the Relot.in are available. If you wish to order a significant number of a particular item, please contact us by email or telephone at 9319198930, option 1, Monday through Friday from 9:00 a.m. to 6 p.m. and Saturday from 10 a.m. to 6 p.m EST.",
      icon: <Clock className="h-12 w-12 text-blue-600" />
    },
    {
      question: "What do I need for optimum browsing when visiting Relot.in?",
      answer: "To make your experience at Relot.in as pleasant as possible, we recommend using the latest generation of your browser. If you access our website using an older version, we cannot guarantee that all of its features will function properly. Please note that your browser must accept cookies and be SSL compatible with standard browsing mode enabled. Relot.in does not support private browsing mode at this time.",
      icon: <Monitor className="h-12 w-12 text-blue-600" />
    },
    {
      question: "How accurate is color display on the Internet?",
      answer: "Each product is photographed with precise attention to detail, and the colors shown should accurately depict each product. However, it is possible that colors may vary slightly from one screen to another due to monitor display settings.",
      icon: <Palette className="h-12 w-12 text-blue-600" />
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
            Browsing Information
          </h1>
          <p className="text-lg text-gray-600">
            Important details about shopping on Relot.in
          </p>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {browsingInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="mx-auto mb-4 flex justify-center">
                {info.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {info.question.split('?')[0].split(' ').slice(0, 3).join(' ')}...
              </h3>
            </div>
          ))}
        </div>

        {/* Information Sections */}
        <div className="space-y-4">
          {browsingInfo.map((info, index) => (
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
      </div>
    </div>
  );
}