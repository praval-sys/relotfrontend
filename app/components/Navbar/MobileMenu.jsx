"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, ChevronRight } from "lucide-react"
import NavbarLogo from "./NavbarLogo"
import { footerData } from "../../../data/footerData"

const mobileMenuData = [
  { id: "home", label: "Home", link: "/" },
  { id: "women", label: "Women", submenu: [
    { label: "Handbags", link: "/products/?category=women&subCategory=handbags" },
    { label: "Wallets", link: "/products/?category=women&subCategory=wallets-and-small-leather-goods" },
    { label: "Accessories", link: "/products/?category=women&subCategory=accessories" },
    { label: "Travel", link: "/products/?category=women&subCategory=travel" }
  ]},
  { id: "men", label: "Men", submenu: [
    { label: "Bags", link: "/products/?category=men&subCategory=handbags" },
    { label: "Wallets", link: "/products/?category=men&subCategory=wallets-and-small-leather-goods" },
    { label: "Accessories", link: "/products/?category=men&subCategory=accessories" },
    { label: "Travel", link: "/products/?category=men&subCategory=travel" }
  ]},
  { id: "fragrances", label: "Fragrances", link: "/products/?category=fragrances" },
  { id: "bags", label: "Bags & Leather", link: "/products/?category=bags" },
  { id: "blogs", label: "Blogs", link: "/blogs" },
  { id: "services", label: "Services", link: "/products/?category=services" }
]

export default function MobileMenu({ isOpen, setIsOpen }) {
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-xs bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
        style={{ minHeight: "100dvh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Responsive Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 flex items-center">
            <NavbarLogo className="w-10 h-10 md:w-14 md:h-14" />
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-7 w-7 text-red-600" />
          </button>
        </div>
        {/* Menu Items */}
        <ul className="flex-1 overflow-y-auto">
          {mobileMenuData.map(item => (
            <li key={item.id} className="border-b border-gray-100">
              <button
                className={`w-full flex items-center justify-between px-6 py-4 text-base font-extrabold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis
                  ${item.label === "SALE" ? "text-red-600" : "text-gray-900"}
                  bg-transparent hover:bg-red-50 transition`}
                style={{ fontSize: "1.1rem" }}
                onClick={() => {
                  if (item.submenu) {
                    setActiveMobileSubmenu(activeMobileSubmenu === item.id ? null : item.id)
                  } else {
                    setIsOpen(false)
                    router.push(item.link)
                  }
                }}
              >
                <span className="truncate">{item.label}</span>
                {item.submenu && (
                  <ChevronRight
                    className={`h-6 w-6 ml-2 text-red-400 transition-transform ${activeMobileSubmenu === item.id ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {item.submenu && activeMobileSubmenu === item.id && (
                <ul className="bg-red-50">
                  {item.submenu.map((sub, idx) => (
                    <li key={idx} className="border-t border-red-100">
                      <button
                        className="w-full text-left px-10 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-100 truncate"
                        onClick={() => {
                          setIsOpen(false)
                          router.push(sub.link)
                        }}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {/* Footer */}
        <div className="mt-auto border-t border-gray-200 px-6 py-4 flex flex-col gap-2">
          <div className="flex justify-center gap-4 mt-1">
            {footerData.socialLinks.map(link => (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800 transition text-xl"
                aria-label={link.platform}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
