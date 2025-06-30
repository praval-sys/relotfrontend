"use client";
import { useState } from 'react';
import { Key, Mail, ArrowRight } from 'lucide-react';

export default function ForgottenPasswordPage() {
  const steps = [
    {
      title: "Click Account",
      description: "Navigate to \"your account\" at the top right of the Relot.in website",
      icon: <Key className="h-12 w-12 text-red-600" />
    },
    {
      title: "Reset Password",
      description: "Click \"forgotten your password?\" link",
      icon: <Mail className="h-12 w-12 text-red-600" />
    },
    {
      title: "Check Email",
      description: "Enter your email address and follow the reset instructions sent to your inbox",
      icon: <ArrowRight className="h-12 w-12 text-red-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Forgotten Password?
          </h1>
          <p className="text-lg text-gray-600">
            Follow these simple steps to reset your password
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100" />
          <div className="space-y-8 relative">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-8 bg-white p-6 rounded-lg shadow-sm relative z-10"
              >
                <div className="bg-blue-50 p-3 rounded-full">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Password Button */}
        <div className="mt-12 text-center">
          <button className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors duration-200 text-lg font-medium" onClick={() => window.location.href = '/reset-password'}>
            Reset Password Now
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Additional Help?
          </h3>
          <p className="text-gray-600">
            Contact our customer service at +91-9319198930 during business hours
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