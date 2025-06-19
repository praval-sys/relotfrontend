"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { footerData } from "../../../data/footerData"
import { SocialIcon } from "./social-icons"
import { ContactItem } from "./contactItem"
import { ChevronDown, ChevronUp } from "lucide-react" // Keep Lucid Icons for dropdowns

export default function Footer() {
  // Initialize openSections as an empty array - Keep this for dropdown functionality
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (title) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    )
  }

  // Placeholder payment icons data - Hardcoded as footerData cannot be changed
  const paymentIcons = [
    { name: "Visa", src: "/path/to/visa-icon.png" }, // Replace with actual paths or SVGs
    { name: "CB", src: "/path/to/cb-icon.png" },
    { name: "American Express", src: "/path/to/amex-icon.png" },
    { name: "Maestro", src: "/path/to/maestro-icon.png" },
    { name: "Mastercard", src: "/path/to/mastercard-icon.png" },
    { name: "PayPal", src: "/path/to/paypal-icon.png" },
    // Add Razorpay icon - you might need to add an SVG file and import it
    // { name: "Razorpay", src: "/path/to/razorpay-icon.png" },
  ];


  return (
    // Changed background to a light cream/off-white shade and text to dark gray
    <footer className="bg-[#F8F8F8] px-6 md:px-16 py-12 text-gray-700"> {/* Light background, dark text */}
      <div className="container mx-auto">
        {/* Keep the existing 4-column grid structure */}
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/assets/logo.jpg" // Ensure this logo works well on a light background
                alt="Relot Logo"
                width={150}
                height={40}
                className="mb-4"
              />
            </Link>
            {/* Changed heading color to dark gray and font to bold */}
            <h2 className="font-bold text-xl mb-4 text-gray-800">{footerData.tagline}</h2>
            {/* Changed description text color to a slightly lighter dark gray */}
            <p className="text-base leading-relaxed text-gray-600">{footerData.description}</p>
          </div>

          {/* Information */}
          <div>
            {/* Changed heading color to dark gray and border to light gray */}
            <h3 className="font-bold text-xl mb-5 border-b border-gray-300 pb-2 text-gray-800">
              {footerData.informationTitle}
            </h3>
            <ul className="space-y-3">
              {footerData.informationLinks.map((link) => (
                <li key={link.text} className="text-base">
                  <div
                    // Changed link colors to dark gray, hover to darker gray
                    className="flex items-center justify-between cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => link.subsections && toggleSection(link.text)}
                  >
                    <Link href={link.href} className="hover:underline">
                      {link.text}
                    </Link>
                    {link.subsections && (
                      // Changed icon color to a slightly lighter dark gray
                      <span className="text-gray-500">
                        {openSections.includes(link.text) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    )}
                  </div>
                  {link.subsections && openSections.includes(link.text) && (
                    // Changed sub-link text color to a lighter dark gray
                    <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-500">
                      {link.subsections.map((sublink) => (
                        <li key={sublink.text}>
                          <Link href={sublink.href} className="hover:text-gray-800 hover:underline transition-colors">
                            {sublink.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Shop */}
          <div>
             {/* Changed heading color to dark gray and border to light gray */}
            <h3 className="font-bold text-xl mb-5 border-b border-gray-300 pb-2 text-gray-800">
              {footerData.quickShopTitle}
            </h3>
            <ul className="space-y-3">
              {footerData.quickShopLinks.map((link) => (
                 // Changed link colors to dark gray, hover to darker gray
                <li key={link.text} className="text-base text-gray-600 hover:text-gray-800 hover:underline transition-colors">
                  <Link href={link.href}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          {/* Removed dark background, border, and padding from this div */}
          <div>
             {/* Changed heading color to dark gray and border to light gray */}
            <h3 className="font-bold text-xl mb-5 border-b border-gray-300 pb-2 text-gray-800">
              {footerData.contactTitle}
            </h3>
            {/* Assuming ContactItem component uses appropriate text colors for light background */}
            <div className="space-y-4"> {/* Adjusted spacing */}
              {footerData.contactInfo.map((item) => (
                <ContactItem key={item.type} icon={item.icon} content={item.content} />
              ))}
            </div>

            {/* Changed heading color to dark gray */}
            <h3 className="font-bold text-xl mt-8 mb-4 text-gray-800">{footerData.socialTitle}</h3>
            {/* Changed icon color to dark gray */}
            <div className="flex gap-4 text-2xl text-gray-600">
              {footerData.socialLinks.map((social) => (
                 // Assuming SocialIcon component uses appropriate icon colors for light background
                <SocialIcon key={social.platform} href={social.href} icon={social.icon} platform={social.platform} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      {/* Changed border color to light gray and adjusted layout for medium screens */}
      <div className="border-t border-gray-300 mt-10 pt-6 text-center md:flex md:justify-between md:items-center">
        {/* Changed copyright text color to dark gray */}
        <p className="text-base text-gray-600 mb-4 md:mb-0">{footerData.copyright}</p>
         {/* Payment Icons */}
         <div className="flex justify-center md:justify-end items-center gap-3">
            {paymentIcons.map((icon) => (
                // You will need to replace these with actual Image or SVG components
                <Image key={icon.name} src={icon.src} alt={icon.name} width={30} height={20} className="h-5 object-contain" />
                // If using an SVG component directly:
                // <div key={icon.name}>{icon.icon}</div>
            ))}
             {/* Placeholder for Razorpay if not in react-icons */}
             {/* <span className="text-gray-600 text-sm">Razorpay Icon Here</span> */}
         </div>
      </div>
    </footer>
  )
}
