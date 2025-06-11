"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { footerData } from "../../../data/footerData"
import { SocialIcon } from "./social-icons"
import { ContactItem } from "./contactItem"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function Footer() {
  // Initialize openSections as an empty array
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (title) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    )
  }

  return (
    <footer className="bg-[#1A1A1A] px-6 md:px-16 py-12 text-gray-300"> {/* Darker background */}
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/assets/logo.jpg" // Ensure this logo works well on a dark background
                alt="Relot Logo" 
                width={150} 
                height={40} 
                className="mb-4" 
              />
            </Link>
            <h2 className="font-bold text-xl mb-4 text-white">{footerData.tagline}</h2> {/* White heading */}
            <p className="text-base leading-relaxed text-gray-400">{footerData.description}</p> {/* Lighter gray for description */}
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-xl mb-5 border-b border-gray-700 pb-2 text-white"> {/* Semibold heading, dark border */}
              {footerData.informationTitle}
            </h3>
            <ul className="space-y-3">
              {footerData.informationLinks.map((link) => (
                <li key={link.text} className="text-base">
                  <div 
                    className="flex items-center justify-between cursor-pointer text-gray-400 hover:text-white transition-colors" // Lighter gray links, hover to white
                    onClick={() => link.subsections && toggleSection(link.text)}
                  >
                    <Link href={link.href} className="hover:underline">
                      {link.text}
                    </Link>
                    {link.subsections && (
                      <span className="text-gray-500"> {/* Slightly lighter icon */}
                        {openSections.includes(link.text) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    )}
                  </div>
                  {link.subsections && openSections.includes(link.text) && (
                    <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-500"> {/* Even lighter gray for sub-links */}
                      {link.subsections.map((sublink) => (
                        <li key={sublink.text}>
                          <Link href={sublink.href} className="hover:text-white hover:underline transition-colors">
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
            <h3 className="font-semibold text-xl mb-5 border-b border-gray-700 pb-2 text-white"> {/* Semibold heading, dark border */}
              {footerData.quickShopTitle}
            </h3>
            <ul className="space-y-3">
              {footerData.quickShopLinks.map((link) => (
                <li key={link.text} className="text-base text-gray-400 hover:text-white hover:underline transition-colors"> {/* Lighter gray links, hover to white */}
                  <Link href={link.href}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-[#242424] p-6 rounded-lg border border-gray-700 text-gray-300"> {/* Darker shade background, light gray text, dark border */}
            <h3 className="font-semibold text-xl mb-5 border-b border-gray-600 pb-2 text-white"> {/* White heading, slightly lighter border */}
              {footerData.contactTitle}
            </h3>

            {footerData.contactInfo.map((item) => (
              // Assuming ContactItem component uses appropriate text colors for dark background
              <ContactItem key={item.type} icon={item.icon} content={item.content} />
            ))}

            <h3 className="font-semibold text-xl mt-8 mb-4 text-white">{footerData.socialTitle}</h3> {/* White heading */}
            <div className="flex gap-5 text-2xl text-gray-400"> {/* Lighter gray icons */}
              {footerData.socialLinks.map((social) => (
                // Assuming SocialIcon component uses appropriate text colors for dark background
                <SocialIcon key={social.platform} href={social.href} icon={social.icon} platform={social.platform} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center"> {/* Dark border */}
        <p className="text-base text-gray-500">{footerData.copyright}</p> {/* Even lighter gray copyright */}
      </div>
    </footer>
  )
}
