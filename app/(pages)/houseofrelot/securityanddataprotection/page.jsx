"use client";
import { useState } from 'react';
import { securityFaqs } from '../../../data/securityData';
import { ChevronDown, ChevronUp, Shield, Lock, UserCheck } from 'lucide-react';

export default function SecurityPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Security and Data Protection
          </h1>
          <p className="text-lg text-gray-600">
            Your privacy and security are our top priorities
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-600">Advanced security measures to protect your data</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Data Privacy</h3>
            <p className="text-gray-600">GDPR compliant data protection policies</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">User Rights</h3>
            <p className="text-gray-600">Full control over your personal data</p>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {securityFaqs.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <span className="text-lg font-medium text-gray-900">
                  {section.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  {section.answer.map((paragraph, idx) => (
                    <p 
                      key={idx} 
                      className={`text-gray-600 ${
                        paragraph.startsWith('-') ? 'pl-4 my-1' : 'my-3'
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}