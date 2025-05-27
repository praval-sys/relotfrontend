import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaPinterestP, FaYoutube } from "react-icons/fa"
import { MdLocationOn, MdEmail, MdCall } from "react-icons/md"

export const footerData = {
  tagline: "Relot – Your Trusted Online Store",
  description:
    "Enjoy a seamless shopping experience as you browse through our various collection, and find the ideal accessories that reflect your style. Transform your outfit with our fashionable offerings today.",

  informationTitle: "Information",
  informationLinks: [
    { text: "About", href: "/about" },
    { text: "Contact Us", href: "/contact" },
    { text: "FAQ's", href: "/faqs" },
    {
      text: "House of Relot",
      subsections: [
        { text: "Security and Data Protection", href: "/houseofrelot/securityanddataprotection" },
        { text: "Manufacture", href: "/houseofrelot/manufacture" },
        { text: "Cookies", href: "/houseofrelot/cookies" }
      ]
    },
    {
      text: "Online Shopping",
      subsections: [
        { text: "Browsing", href: "/onlineshopping/browsing" },
        { text: "Collect in Store", href: "/onlineshopping/collectinstore" },
        { text: "Delivery ", href: "/onlineshopping/delivery" },
        { text: "Payments", href: "/onlineshopping/payments" },
        { text: "Gifting", href: "/onlineshopping/gifting" },
        { text: "Orders", href: "/onlineshopping/orders" },
        { text: "Returns & Exchanges", href: "/onlineshopping/returnandexchanges" }
      ]
    },
    {
      text: "Customer Account",
      subsections: [
        { text: "Account Creation", href: "/customeraccount/accountcreation" },
        { text: "Forgotten Password", href: "/customeraccount/forgottenpassword" },
        { text: "Settings and Cancellation", href: "/customeraccount/settingandcancellation" }
      ]
    },
    {
      text: "Products",
      subsections: [
        { text: "Authentication", href: "/products/authentication" },
        { text: "Availability", href: "/products/availability" },
        { text: "Size Guide", href: "/products/sizeguide" },
        { text: "Bespoke", href: "/products/bespoke" },
        { text: "Orange Box", href: "/products/orangebox" },
        { text: "Care & Repair", href: "/products/careandrepair" }
      ]
    }
  ],

  quickShopTitle: "Quick Shop",
  quickShopLinks: [
    { text: "New Arrivals", href: "/shop/new-arrivals" },
    { text: "Best Sellers", href: "/shop/best-sellers" },
    { text: "Sale", href: "/shop/sale" },
    { text: "Accessories", href: "/shop/accessories" },
  ],

  contactTitle: "Contact Us",
  contactInfo: [
    {
      type: "address",
      content: "Suman enclave plot No. 07 pin code - 202414. India",
      icon: <MdLocationOn className="text-2xl flex-shrink-0" />,
    },
    {
      type: "email",
      content: "Relot2025@gmail.com",
      icon: <MdEmail className="text-2xl flex-shrink-0" />,
    },
    {
      type: "phone",
      content: "+91-XXXXXXX",
      icon: <MdCall className="text-2xl flex-shrink-0" />,
    },
  ],

  socialTitle: "Social Links",
  socialLinks: [
    { platform: "Facebook", href: "https://facebook.com", icon: <FaFacebookF /> },
    { platform: "YouTube", href: "https://youtube.com", icon: <FaYoutube /> },
    { platform: "Instagram", href: "https://instagram.com", icon: <FaInstagram /> },
    { platform: "LinkedIn", href: "https://linkedin.com", icon: <FaLinkedinIn /> },
    { platform: "Twitter", href: "https://twitter.com", icon: <FaTwitter /> },
    { platform: "Pinterest", href: "https://pinterest.com", icon: <FaPinterestP /> },
  ],

  copyright: "© 2025 Relot. All Rights Reserved.",
}
