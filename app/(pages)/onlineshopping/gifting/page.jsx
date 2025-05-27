"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Gift, CreditCard, MessageSquare, FileText, RefreshCw } from 'lucide-react';

export default function GiftingPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const giftingInfo = [
    {
      question: "Will my order be gift wrapped?",
      answer: "Your purchases are delivered in an orange box tied with a Bolduc ribbon, with the exception of fragrances.",
      icon: <Gift className="h-12 w-12 text-purple-600" />
    },
    {
      question: "Can I use a gift card or store credit for an online purchase?",
      answer: "Hermès gift cards and store credits may not be used on the Relot.in website. Please consult the conditions listed on your gift card for its terms of use in stores.",
      icon: <CreditCard className="h-12 w-12 text-purple-600" />
    },
    {
      question: "Can I include a personalized gift message with my purchase?",
      answer: "When viewing the items in your cart before checking out, you may include a blank or printed card and priceless invoice. Personalized messages should only be written in English language characters to guarantee accuracy. Use of other characters or images may not print correctly.",
      icon: <MessageSquare className="h-12 w-12 text-purple-600" />
    },
    {
      question: "Will my gift order include an invoice where the price of the items are not shown?",
      answer: [
        "An order will be considered a \"gift\" if the civil status, last name or first name of the invoicing information is different from that of the delivery information. In this specific case, an invoice where the price of the items are not shown will be included in the package that is sent to the gift recipient.",
        "To request an invoice where the price is not shown, even if your invoicing information is identical to your delivery information, please contact us as soon as possible by email or telephone at +91-9319198930, option 1, Monday through Friday from 9:00 a.m. to 6 p.m. and Saturday from 10 a.m. to 6 p.m EST."
      ],
      icon: <FileText className="h-12 w-12 text-purple-600" />
    },
    {
      question: "If I give a gift to someone, can that person exchange it for something else?",
      answer: "Accompanied with an invoice or priceless invoice, a gift may be exchanged for an item of equal or greater value. The difference must be paid at the time of the exchange. Online orders are eligible for a pre-paid return shipping label through your online account or please contact us.",
      icon: <RefreshCw className="h-12 w-12 text-purple-600" />
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
            Gifting Services
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about our gifting options
          </p>
        </div>

        {/* Feature Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {giftingInfo.slice(0, 3).map((info, index) => (
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
          {giftingInfo.map((info, index) => (
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
                      <p key={idx} className="text-gray-600 leading-relaxed my-3">
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