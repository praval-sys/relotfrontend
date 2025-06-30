"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Truck, Clock, Package } from 'lucide-react';

export default function DeliveryPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const deliveryInfo = {
    title: "Delivery Information",
    subtitle: "Shipping costs and delivery options",
    sections: [
      {
        title: "Standard Shipping Thresholds",
        icon: <Truck className="h-12 w-12 text-red-600" />,
        items: [
          "Complimentary Ground shipping on all items up to ₹3,999",
          "Express delivery required for items greater than ₹5,000",
          "White Glove delivery required for items greater than ₹25,000"
        ]
      },
      {
        title: "Delivery Service Costs",
        icon: <Clock className="h-12 w-12 text-red-600" />,
        items: [
          "Express 2-day service: ₹200",
          "Standard Overnight service: ₹400",
          "Priority Overnight service: ₹300",
          "Saturday Delivery service: ₹400",
          "White Glove delivery: ₹500"
        ]
      }
    ]
  };

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {deliveryInfo.title}
          </h1>
          <p className="text-lg text-gray-600">
            {deliveryInfo.subtitle}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {deliveryInfo.sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                {section.icon}
                <h2 className="text-xl font-semibold ml-4">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li 
                    key={idx}
                    className="flex items-start text-gray-600"
                  >
                    <Package className="h-5 w-5 mr-2 mt-0.5 text-red-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Delivery Price Calculator - Optional */}
        <div className="bg-white p-8 rounded-lg shadow-sm mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Shipping Methods Overview
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Service Type</th>
                  <th className="px-4 py-2 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">Express 2-day</td>
                  <td className="px-4 py-2 text-right">₹200</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Standard Overnight</td>
                  <td className="px-4 py-2 text-right">₹400</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Priority Overnight</td>
                  <td className="px-4 py-2 text-right">₹300</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Saturday Delivery</td>
                  <td className="px-4 py-2 text-right">₹400</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">White Glove</td>
                  <td className="px-4 py-2 text-right">₹500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}