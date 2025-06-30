"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, CreditCard, Lock, Globe, Wallet, Clock, Shield } from 'lucide-react';

export default function PaymentPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const paymentInfo = [
    {
      question: "Which means of payment are accepted by Relot.in?",
      answer: "You can only pay for your purchases with a credit or charge card: MasterCard®, Visa®, UPI. You should enter your credit card or charge card number, its expiry date and its card verification number on the relevant page.",
      icon: <CreditCard className="h-12 w-12 text-red-600" />
    },
    {
      question: "Is my payment secure?",
      answer: "All the transactions made on the Relot.in website are secure. The padlock symbol next to the address bar of the page beginning with \"https\" indicates that you are in a secure setting. Relot has also established specific security measures to protect your personal information from non-authorized access and use. However, you should never consider the transmission of data by Internet to be 100% secure. Any information that you make available online can potentially be recuperated and used by third parties.",
      icon: <Lock className="h-12 w-12 text-red-600" />
    },
    {
      question: "Do you accept international credit cards?",
      answer: "We accept international credit cards; however, when placing your order, you must enter the international billing address that is linked to your credit card.",
      icon: <Globe className="h-12 w-12 text-red-600" />
    },
    {
      question: "Can I place an order using a bank card that is not my own?",
      answer: "Yes, in this case please indicate the billing address associated with the card.",
      icon: <Wallet className="h-12 w-12 text-red-600" />
    },
    {
      question: "When will my credit card be debited?",
      answer: "Cards and other payment methods are not debited until an order has been accepted and sent. However, it is possible that your credit card or other payment method may indicate a reserve amount as soon as the order is placed.",
      icon: <Clock className="h-12 w-12 text-red-600" />
    },
    {
      question: "What is the security code on my payment card?",
      answer: [
        "A unique code made up of 3 or 4 digits secures remote sale transactions.",
        "This code can be found:",
        "- on the back of your credit card in the signature field. It is made up of 3 digits (Visa or MasterCard, for example)."
      ],
      icon: <Shield className="h-12 w-12 text-red-600" />
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
            Payment Information
          </h1>
          <p className="text-lg text-gray-600">
            Secure payment options and processing
          </p>
        </div>

        {/* Security Banner */}
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-lg mb-12">
          <div className="flex items-center justify-center gap-4">
            <Lock className="h-8 w-8 text-red-600" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-indigo-900">Secure Payments</h2>
              <p className="text-indigo-700">All transactions are encrypted and secure</p>
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {paymentInfo.slice(0, 3).map((info, index) => (
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
          {paymentInfo.map((info, index) => (
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
                          paragraph.startsWith('-') ? 'pl-4 my-1' : 'my-3'
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