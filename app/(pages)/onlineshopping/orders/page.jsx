"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Edit, Mail } from 'lucide-react';

export default function OrdersPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const orderInfo = [
    {
      question: "How may I get assistance with my online order?",
      answer: "Please contact us by email or telephone at +91-9319198930, option 1, Monday through Friday from 9:00 a.m. to 6 p.m. and Saturday from 10 a.m. to 6 p.m EST.",
      icon: <HelpCircle className="h-12 w-12 text-emerald-600" />
    },
    {
      question: "How do I change information on my order after it has been placed?",
      answer: "Please contact us as soon as possible by email or telephone at +91-9319198930, option 1, Monday through Friday from 9:00 a.m. to 6 p.m. and Saturday from 10 a.m. to 6 p.m EST.",
      icon: <Edit className="h-12 w-12 text-emerald-600" />
    },
    {
      question: "I just finalized my order but I still have not received the order summary.",
      answer: "You may experience a short delay after you have placed your order and before you receive the order summary. You should also check your \"Spam\" inbox, as the message may have been redirected depending on your email settings. If you still have not received an email, please contact us.",
      icon: <Mail className="h-12 w-12 text-emerald-600" />
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
            Order Information
          </h1>
          <p className="text-lg text-gray-600">
            Help and support for your orders
          </p>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-12">
          <div className="flex items-center justify-center space-x-2 text-emerald-600 mb-4">
            <HelpCircle className="h-8 w-8" />
            <h2 className="text-2xl font-semibold">Customer Support</h2>
          </div>
          <div className="text-center text-gray-600">
            <p className="mb-2">Contact us by phone: +91-9319198930 (Option 1)</p>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 6:00 PM EST</p>
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {orderInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="mx-auto mb-4 flex justify-center">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold">
                {info.question.split('?')[0].split(' ').slice(0, 3).join(' ')}...
              </h3>
            </div>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {orderInfo.map((info, index) => (
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