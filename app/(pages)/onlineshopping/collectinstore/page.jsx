"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Store, UserCheck, Clock } from 'lucide-react';

export default function CollectInStorePage() {
  const [openIndex, setOpenIndex] = useState(null);

  const collectInfo = [
    {
      question: "Can I collect my order in a store?",
      answer: [
        "It is possible to collect the items you have ordered on Relot.in in-store. This service is currently only available in selected stores. While completing your order, the option of in-store collection may be offered, according to your billing address.",
        "Orders are shipped via FedEx.",
        "You will receive an email confirming when your purchase is ready for pick-up. Appointments are recommended if available. You will then have 21 days to collect your order.",
        "To collect your order, please introduce yourself to a sales person when you arrive at the store, along with:",
        "• The email informing you of the availability of your order (printed out or on the screen of your phone)",
        "• Proof of identification."
      ],
      icon: <Store className="h-12 w-12 text-blue-600" />
    },
    {
      question: "Can a third party collect my order in a store?",
      answer: [
        "Yes, an option for third party pick-up is available if the first and last name of the individual is designated in the required fields prior to the order being placed.",
        "Please note, a copy of the order confirmation and a valid photo ID will be required at the time of pick-up. The name on the ID must match the name entered on the order for the package to be retrieved."
      ],
      icon: <UserCheck className="h-12 w-12 text-blue-600" />
    },
    {
      question: "When will my order be available in store?",
      answer: [
        "Orders with Express shipping methods placed before 2 p.m. (Eastern Standard Time) will ship the same day unless subject to a shipping delay. Orders with Ground delivery will ship within two business days unless subject to a shipping delay. You will receive an email confirming when your purchase is ready for pick-up. Appointments are recommended if available.",
        "Please bring along:",
        "• The email informing you of the availability of your order (printed out or on the screen of your phone)",
        "• Proof of identification",
        "You have 21 days to collect your order from the receipt of the e-mail(relot2025@gmail.com) informing you of its availability in store."
      ],
      icon: <Clock className="h-12 w-12 text-blue-600" />
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
            Collect in Store
          </h1>
          <p className="text-lg text-gray-600">
            Information about in-store collection services
          </p>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {collectInfo.map((info, index) => (
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
          {collectInfo.map((info, index) => (
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
                  {Array.isArray(info.answer) ? (
                    info.answer.map((paragraph, idx) => (
                      <p 
                        key={idx} 
                        className={`text-gray-600 leading-relaxed ${
                          paragraph.startsWith('•') ? 'pl-4 my-1' : 'my-3'
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {info.answer}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}