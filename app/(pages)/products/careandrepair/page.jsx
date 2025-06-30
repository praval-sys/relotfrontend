"use client";
import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Wrench,      // Replace Tool
  Shirt,       // Keep Shirt
  Briefcase,   // Keep Briefcase
  Compass      // Replace Horse with Compass for saddle/equestrian
} from 'lucide-react';

export default function CareAndRepairPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const careCategories = [
    {
      title: "Repair Services",
      description: "Professional repair and refurbishment",
      icon: <Wrench className="h-12 w-12 text-cyan-600" />, // Changed from Tool to Wrench
      tips: [
        "Visit nearest Relot store",
        "Get expert examination",
        "Receive estimate and timeline",
        "Professional workshop repair"
      ]
    },
    {
      title: "Scarf & Tie Care",
      description: "Proper maintenance for silk items",
      icon: <Shirt className="h-12 w-12 text-cyan-600" />,
      tips: [
        "Use professional dry cleaning",
        "Protect hand-rolled edges",
        "Avoid rain exposure",
        "Prevent direct sunlight"
      ]
    },
    {
      title: "Leather Care",
      description: "Maintain bags and leather goods",
      icon: <Briefcase className="h-12 w-12 text-cyan-600" />,
      tips: [
        "Protect from humidity",
        "Avoid extreme conditions",
        "Regular workshop maintenance",
        "Use approved care products"
      ]
    },
    {
      title: "Saddle Care",
      description: "Specialized equestrian care",
      icon: <Compass className="h-12 w-12 text-cyan-600" />, // Changed from Horse to Compass
      tips: [
        "Regular maintenance",
        "Protect from elements",
        "Professional cleaning",
        "Expert consultation"
      ]
    }
  ];

  const careInfo = [
    {
      question: "How do I repair an Hermès item?",
      answer: "Our workshops are able to respond to numerous repair and refurbishment requests for Relot products. We invite you to visit your nearest Relot store to have your object examined by one of our sales consultants. They will then provide an estimate and waiting period for the planned repair. For any questions, please contact us or visit one of our stores.",
      icon: <Wrench className="h-12 w-12 text-cyan-600" /> // Changed from Tool to Wrench
    },
    {
      question: "How do I clean my Relot scarf or tie?",
      answer: "We recommend that you avoid washing your scarves and ties and instead entrust them to your dry cleaner, who will clean them professionally and pay careful attention to their hand-rolled edges. Also, remember that any printing on silk may be damaged by the rain.",
      icon: <Shirt className="h-12 w-12 text-cyan-600" />
    },
    {
      question: "How do I care for my Relot bag or leather good?",
      answer: "Leather is a living material that evolves, changes colour, softens, and becomes patinated over time. It should be protected from humidity and prolonged exposure to light or extreme heat. It is not recommended to use care products available on the market that are not adapted to Hermès leathers. The best way to maintain your bag is to regularly return it to our workshops to be cleaned and, if needed, restitched and repolished.",
      icon: <Briefcase className="h-12 w-12 text-cyan-600" />
    },
    {
      question: "How do I care for my saddle?",
      answer: "Saddle leather is a living material that evolves, changes colour, softens, and becomes patinated over time. It should be protected and maintained with care. Please do not hesitate to visit the dedicated page for more information or to contact our experts for any assistance.",
      icon: <Compass className="h-12 w-12 text-cyan-600" />
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
            Care & Repair
          </h1>
          <p className="text-lg text-gray-600">
            Expert guidance for maintaining your Relot pieces
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {careCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                {category.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
              <ul className="space-y-2">
                {category.tips.map((tip, idx) => (
                  <li 
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <div className="h-2 w-2 bg-cyan-600 rounded-full" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Service Banner */}
        <div className="bg-cyan-50 border border-cyan-100 p-6 rounded-lg mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Wrench className="h-8 w-8 text-cyan-600" />
              <div>
                <h2 className="text-xl font-semibold text-cyan-900">
                  Professional Care Services
                </h2>
                <p className="text-cyan-700">
                  Visit our stores for expert assessment
                </p>
              </div>
            </div>
            <button className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition-colors duration-200" onClick={() => window.location.href = '/contactus'}>
              Find a Store
            </button>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {careInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center gap-4">
                  {info.icon}
                  <span className="text-lg font-medium text-gray-900">
                    {info.question}
                  </span>
                </div>
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
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            For specialized care inquiries, contact us at:
            <br />
            +91-9319198930
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