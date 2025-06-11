"use client"

import { useState } from 'react';
import { MdLocationOn, MdEmail, MdCall } from "react-icons/md"; // Using React Icons
import { Button } from '../../components/ui/Button'; // Assuming you have a Button component

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to an API)
    console.log('Form submitted:', formData);
    alert('Message sent!'); // Placeholder for success feedback
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">Get in Touch</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Details Section */}
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h2>
          <div className="space-y-6 text-gray-700">
            <div className="flex items-start">
              <MdLocationOn className="text-2xl text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800">Our Location</h3>
                <p>Suman enclave plot No. 07 pin code - 202414. India</p>
              </div>
            </div>
            <div className="flex items-start">
              <MdEmail className="text-2xl text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800">Email Us</h3>
                <p>Relot2025@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <MdCall className="text-2xl text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800">Call Us</h3>
                <p>+91-9319198930</p>
              </div>
            </div>
            {/* Add more contact details or a map embed here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}