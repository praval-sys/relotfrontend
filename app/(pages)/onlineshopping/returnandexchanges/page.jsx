"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, Gift, Store, Clock, Info } from 'lucide-react';

export default function ReturnsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const returnsInfo = [
    {
      question: "How do I return or exchange an item ordered via Relot.in?",
      answer: [
        "Your order will be accepted for refund or exchange if returned in original condition and packaging, within thirty (10) days from the delivery date. The returned item(s) must be accompanied by the original receipt or a copy in the case of a partial return.",
        "Returning a product for exchange or refund is complimentary. In order to do this, you must return the articles via shiprocket using the pre-paid return label provided through your Relot.in account.",
        "If you wish to return an item received as a gift, you may exchange it for an item(s) of equal value. Please contact us, Customer Service will send you the pre-paid return label by email.",
        "For the Holiday season, the online return policy is extended.",
        "Returns brought to an Relot store in the India are only eligible for exchange or store credit.",
        "The following conditions apply to fragrance returns:",
        "1.) The product must not be open and must be returned in its original packaging (with transparent film)",
        "2.) when returning products that may have been damaged during delivery, the client must ensure that the bottle is still hermetically sealed (if this is not the case, contact us).",
        "The following conditions apply to shoes:",
        "Shoes must be returned in their original packaging and the sole must not be damaged or marked.",
        "Connect to your account and select \"return or exchange items\" in the selection \"your orders\".",
        "Within your Relot.in account, you can:",
        "- choose the articles to return as well as the reason for the return",
        "- download and print your pre-paid return label",
        "If you are unable or do not wish to use the pre-paid label service, please contact us to obtain authorization for your return. You can then return your package by a carrier of your choice to the following address:",
        "H.O.P.\nAttn: Internet Returns and Exchanges\nRelot Suman Enclave plot No.07, Noida Sector -107,\nopposite Lotus 300 Gate No.02\nGoutam Buddha Nagar,Uttar Pradesh -201304,India"
      ],
      icon: <RefreshCw className="h-12 w-12 text-rose-600" />
    },
    {
      question: "If I give a gift to someone, can that person exchange it for something else?",
      answer: "Accompanied with an invoice or priceless invoice, a gift may be exchanged for an item of equal or greater value. The difference must be paid at the time of the exchange. Online orders are eligible for a pre-paid return shipping label through your online account or please contact us.",
      icon: <Gift className="h-12 w-12 text-rose-600" />
    },
    {
      question: "Can I return or exchange an item in store?",
      answer: "Items may be exchanged or returned for store credit at an Relot's location in the India within thirty calendar days following the delivery. A list of Relot's stores can be found by clicking on find store.",
      icon: <Store className="h-12 w-12 text-rose-600" />
    },
    {
      question: "How long will my refund take?",
      answer: "We aim to process returns within 7 to 10 business days from delivery to our distribution center. You will receive a confirmation email when complete.",
      icon: <Clock className="h-12 w-12 text-rose-600" />
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
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600">
            Information about our return and exchange policies
          </p>
        </div>

        {/* Returns Policy Banner */}
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-lg mb-12">
          <div className="flex items-center justify-center gap-4">
            <Info className="h-8 w-8 text-rose-600" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-rose-900">10-Day Return Policy</h2>
              <p className="text-rose-700">Items must be in original condition with tags attached</p>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {returnsInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
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

        {/* FAQ Sections */}
        <div className="space-y-4">
          {returnsInfo.map((info, index) => (
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
                          paragraph.startsWith('-') || paragraph.startsWith('1.') || paragraph.startsWith('2.') 
                            ? 'pl-4 my-1' 
                            : 'my-3'
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