
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaPinterestP, FaYoutube } from "react-icons/fa"
import { MdLocationOn, MdEmail, MdCall } from "react-icons/md"

export const footerData = {
  tagline: "Relot – Your Trusted Online Store",
  description:
    "Enjoy a seamless shopping experience as you browse through our various collection, and find the ideal accessories that reflect your style. Transform your outfit with our fashionable offerings today.",

  informationTitle: "Information",
  informationLinks: [
    { text: "About", href: "/about" },
    { text: "Contact Us", href: "/contactus" },
    { text: "FAQ's", href: "/faqs" },
    {
      text: "House of Relot",
      href: "#",
      subsections: [
        { text: "Security and Data Protection", href: "/houseofrelot/securityanddataprotection" },
        { text: "Manufacture", href: "/houseofrelot/manufacture" },
        { text: "Cookies", href: "/houseofrelot/cookies" }
      ]
    },
    {
      text: "Online Shopping",
      href: "#",
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
      href: "#",
      subsections: [
        { text: "Account Creation", href: "/customeraccount/accountcreation" },
        { text: "Forgotten Password", href: "/customeraccount/forgottenpassword" },
        { text: "Settings and Cancellation", href: "/customeraccount/settingandcancellation" }
      ]
    },
    {
      text: "Products",
      href: "#",
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
    // ✅ New Arrivals - Recently added products
    { text: "New Arrivals", href: "/products?sort=createdAt&order=desc&featured=true" },
    
    // ✅ Best Sellers - High rated and popular products
    { text: "Best Sellers", href: "/products?sort=rating&order=desc&rating=4" },
    
    // ✅ Sale Items - Products with discounts
    { text: "Sale", href: "/products?minDiscount=10&sort=discount&order=desc" },
    
    // ✅ Best Offers - Maximum discounts (60% or more)
    { text: "Best Offers", href: "/products?maxDiscount=60&sort=discount&order=desc" },
    
    // ✅ Featured Products
    { text: "Featured", href: "/products?featured=true&sort=popularity&order=desc" },
    
    // ✅ Premium Products - Higher price range
    { text: "Premium", href: "/products?minPrice=5000&sort=price&order=desc" },
    
    // ✅ Budget Friendly - Lower price range
    { text: "Under ₹2000", href: "/products?maxPrice=2000&sort=price&order=asc" },
    
    // ✅ Top Rated - 4+ star products
    { text: "Top Rated", href: "/products?rating=4&sort=rating&order=desc" },
    
    // ✅ In Stock - Available products only
    { text: "In Stock", href: "/products?inStock=true&sort=popularity&order=desc" },
    
    // ✅ Category-specific quick links
    { text: "Men's Collection", href: "/products?category=men&sort=popularity&order=desc" },
    { text: "Women's Collection", href: "/products?category=women&sort=popularity&order=desc" },
    { text: "Bags & Accessories", href: "/products?category=bags&sort=popularity&order=desc" },
    { text: "Fragrances", href: "/products?category=fragrances&sort=popularity&order=desc" },
  ],

  contactTitle: "Contact Us",
  contactInfo: [
    {
      type: "address",
      content: "Plot no.7 , Suman enclave , opposite to lotus 300 gate number 2 , sector 107 , Noida , Uttar pradesh , 201303",
      icon: <MdLocationOn className="text-2xl flex-shrink-0" />,
    },
    {
      type: "email",
      content: "relot2025@gmail.com",
      icon: <MdEmail className="text-2xl flex-shrink-0" />,
    },
    {
      type: "phone",
      content: "+91-9319198930",
      icon: <MdCall className="text-2xl flex-shrink-0" />,
    },
  ],

  socialTitle: "Social Links",
  socialLinks: [
    { platform: "Facebook", href: "https://www.facebook.com/profile.php?id=61571605739440", icon: <FaFacebookF /> },
    { platform: "YouTube", href: "https://www.youtube.com/@RelotLeatherGoods", icon: <FaYoutube /> },
    { platform: "Instagram", href: "https://www.instagram.com/relot.store?igsh=MWNzZmV1MmF4NW16cA%3D%3D&utm_source=qr", icon: <FaInstagram /> },
    // { platform: "LinkedIn", href: "https://linkedin.com", icon: <FaLinkedinIn /> },
    // { platform: "Twitter", href: "https://twitter.com", icon: <FaTwitter /> },
    { platform: "Pinterest", href: "https://in.pinterest.com/relotstore", icon: <FaPinterestP /> },
  ],

  copyright: "© 2025 Relot. All Rights Reserved.",
}