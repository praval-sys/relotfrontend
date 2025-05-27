"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Compass, Clock, Phone } from 'lucide-react';

export default function BespokePage() {
  const [openIndex, setOpenIndex] = useState(null);

  const bespokeServices = [
    {
      title: "Custom Objects",
      description: "Create unique, personalized items",
      process: [
        "Provide detailed requirements",
        "Receive price estimate within a month",
        "Get expected waiting period",
        "Work with our design team"
      ],
      icon: <Pencil className="h-12 w-12 text-purple-600" />
    },
    {
      title: "Custom-Fit Saddles",
      description: "Tailored equestrian equipment",
      process: [
        "Schedule appointment with saddle expert",
        "Test and measure specifications",
        "Choose model for riding style",
        "Customize to rider and horse"
      ],
      icon: <Compass className="h-12 w-12 text-purple-600" />
    }
  ];

  const bespokeInfo = [
    {
      question: "How can I order a bespoke object?",
      answer: "To create a customized object, begin by providing us with a detailed explanation of what you would like. We will respond within a month with an agreement in principle, a price estimate, and the expected waiting period. Our team of designers will design this unique object for you. Please visit an Relot Store or contact us by email or telephone at +91-9319198930.",
      icon: <Pencil className="h-12 w-12 text-purple-600" />
    },
    {
      question: "How do I order a custom-fit saddle?",
      answer: "With its saddles, Relot seeks to bring together horse and rider. For a custom-fit saddle, we suggest making an appointment with one of our saddle experts to organize testing and have your equipment made to measure. From the first meeting to the final adjustments, we help you to choose the best model for your riding style, and adapt your saddle to suit your preferences, your body shape and your horse.",
      icon: <Compass className="h-12 w-12 text-purple-600" />
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
            Bespoke Services
          </h1>
          <p className="text-lg text-gray-600">
            Create your unique, custom-made Relot pieces
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {bespokeServices.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-4 mb-6">
                {service.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {service.process.map((step, idx) => (
                  <li 
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <div className="h-2 w-2 bg-purple-600 rounded-full" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-lg mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Phone className="h-8 w-8 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold text-purple-900">
                  Start Your Bespoke Journey
                </h2>
                <p className="text-purple-700">
                  Contact us to discuss your custom creation
                </p>
              </div>
            </div>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200">
              Contact Us
            </button>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {bespokeInfo.map((info, index) => (
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

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Call us at +91-9319198930
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