"use client";
import { useState } from 'react';
import { Ruler, CircleDot, ArrowRight, Info } from 'lucide-react';

export default function SizeGuidePage() {
  const measurementSteps = [
    {
      title: "Measure Existing Belt",
      description: "Measure from the base of the tongue to your most used hole",
      icon: <Ruler className="h-12 w-12 text-slate-600" />
    },
    {
      title: "Measure Waist",
      description: "Or measure your waist where you normally wear your belt",
      icon: <CircleDot className="h-12 w-12 text-slate-600" />
    },
    {
      title: "Choose Size",
      description: "Your measurement in centimeters is your Relot belt size",
      icon: <ArrowRight className="h-12 w-12 text-slate-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Belt Size Guide
          </h1>
          <p className="text-lg text-gray-600">
            Find your perfect Relot belt size
          </p>
        </div>

        {/* Measurement Guide */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Ruler className="h-8 w-8 text-slate-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              How to Measure
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {measurementSteps.map((step, index) => (
              <div 
                key={index}
                className="relative"
              >
                {index < measurementSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-slate-300" />
                  </div>
                )}
                <div className="text-center">
                  {step.icon}
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Box */}
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-lg mb-12">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-slate-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Size Example
              </h3>
              <p className="text-gray-600">
                If your waist measures 85 cm, your Relot belt size would be 85.
              </p>
            </div>
          </div>
        </div>

        {/* Size Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Quick Reference Chart
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Waist (cm)</th>
                  <th className="px-4 py-2 text-left">Belt Size</th>
                </tr>
              </thead>
              <tbody>
                {[75, 80, 85, 90, 95, 100].map((size) => (
                  <tr key={size} className="border-b">
                    <td className="px-4 py-2">{size}</td>
                    <td className="px-4 py-2">{size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Note */}
        <div className="mt-12 text-center text-gray-600">
          <p>
            Need help finding your size?
            <br />
            Contact our customer service at +91-9319198930
          </p>
        </div>
      </div>
    </div>
  );
}