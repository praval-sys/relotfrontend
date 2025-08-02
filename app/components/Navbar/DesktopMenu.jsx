"use client"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Sparkles, ChevronRight, ArrowUpRight, ChevronLeft } from "lucide-react"
import NavbarLogo from "./NavbarLogo"
import { useEffect, useState } from "react"

const DesktopMenu = ({ menuData, activeSubmenu, setActiveSubmenu }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeNestedMenu, setActiveNestedMenu] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Static images for the slider
  const sliderImages = [
    "/images/relot front page img 13-6/1st setion women_s bag.png",
    "/images/relot front page img 13-6/1st sec men_s bag.avif",
    "/images/relot front page img 13-6/womenbags hero.jpg",
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Remove the dynamic height calculation function and use static height
  const staticDropdownHeight = 600 // Fixed height for all dropdowns

  return (
    <>
      <div className="flex w-full items-center justify-between">
        {/* Logo only when scrolled */}
        {isScrolled && (
          <div className="flex-shrink-0 mr-8 transform transition-all duration-500 ease-out">
            <NavbarLogo />
          </div>
        )}

        <div className="flex items-center space-x-8">
          {menuData.map((item) => (
            <li className="relative group" key={item.id}>
              <Link
                href={item.link}
                className="relative flex items-center py-3 font-bold text-[15px] text-gray-800 transition-all duration-300 ease-out group-hover:text-red-600"
                onMouseEnter={() => {
                  setActiveSubmenu(item.id)
                  setActiveNestedMenu(null)
                }}
              >
                <span className="relative">
                  {item.label}
                  {/* Animated underline */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                </span>
                {item.submenu && (
                  <ChevronDown className="ml-2 h-4 w-4 transition-all duration-300 ease-out group-hover:rotate-180 group-hover:text-red-500" />
                )}
              </Link>

              {item.submenu && (
                <div
                  className="fixed left-0 right-0 mt-4 bg-white shadow-2xl z-[70] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out transform group-hover:translate-y-0 translate-y-4 border-t border-gray-100"
                  onMouseLeave={() => {
                    setActiveSubmenu(null)
                    setActiveNestedMenu(null)
                  }}
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                    height: `${staticDropdownHeight}px`, // Use static height
                    transition: "opacity 0.5s ease-out, transform 0.5s ease-out", // Remove height transition
                  }}
                >
                  <div className="container mx-auto px-8 py-8 h-full">
                    <div className="flex gap-12 h-full">
                      {/* Categories Section - Left Side */}
                      <div className="w-1/4 border-r border-gray-200 pr-8 overflow-y-auto max-h-full">
                        {" "}
                        {/* Add scroll if needed */}
                        <div className="mb-6">
                          <h3 className="font-bold text-2xl mb-2 text-gray-900">{item.label}</h3>
                          <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                        </div>
                        <ul className="space-y-2 pb-4">
                          {" "}
                          {/* Add bottom padding */}
                          {item.submenu.map((subItem, idx) => (
                            <li key={idx} className="relative">
                              <Link
                                href={subItem.link}
                                className="group/link flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 ease-out"
                                onMouseEnter={() =>
                                  subItem.submenu ? setActiveNestedMenu(idx) : setActiveNestedMenu(null)
                                }
                                onMouseLeave={() => {
                                  // Don't immediately hide nested menu, let the nested menu handle it
                                }}
                              >
                                <span className="text-base font-semibold text-gray-700 group-hover/link:text-red-600 transition-colors duration-300">
                                  {subItem.label}
                                </span>
                                {subItem.submenu && (
                                  <ChevronDown
                                    className={`ml-2 h-4 w-4 text-gray-400 group-hover/link:text-red-500 transition-all duration-300 ${activeNestedMenu === idx ? "rotate-180" : ""}`}
                                  />
                                )}
                              </Link>

                              {/* Nested Submenu - Positioned below the parent item */}
                              {subItem.submenu && activeNestedMenu === idx && (
                                <div
                                  className="mt-2 ml-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border-l-4 border-red-500 shadow-inner transition-all duration-300 ease-out max-h-48 overflow-y-auto" // Add max height and scroll
                                  onMouseEnter={() => setActiveNestedMenu(idx)}
                                  onMouseLeave={() => setActiveNestedMenu(null)}
                                >
                                  <div className="mb-3">
                                    <h4 className="font-bold text-sm text-red-700 mb-1">{subItem.label} Categories</h4>
                                    <div className="w-6 h-0.5 bg-red-500 rounded-full"></div>
                                  </div>

                                  <ul className="grid grid-cols-1 gap-1">
                                    {subItem.submenu.map((nestedItem, nestedIdx) => (
                                      <li key={nestedIdx}>
                                        <Link
                                          href={nestedItem.link}
                                          className="group/nested-link flex items-center py-2 px-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300 transform hover:translate-x-1"
                                        >
                                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3 group-hover/nested-link:bg-red-600 transition-colors duration-300"></div>
                                          <span className="text-sm text-gray-700 group-hover/nested-link:text-red-600 transition-colors duration-300 font-medium">
                                            {nestedItem.label}
                                          </span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Featured Collections - Center */}
                      <div className="w-1/2">
                        <div className="mb-6">
                          <h3 className="font-bold text-2xl mb-2 text-gray-900">Featured Collections</h3>
                          <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 h-80">
                          {" "}
                          {/* Increased height from h-64 to h-80 */}
                          {item.submenu
                            .filter((subItem) => subItem.image)
                            .slice(0, 4)
                            .map((subItem, idx) => (
                              <Link
                                href={subItem.link}
                                key={idx}
                                className="group/card block transform transition-all duration-500 ease-out hover:scale-105"
                              >
                                <div className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 ease-out border border-gray-100 hover:border-red-200 h-full">
                                  <div className="h-32 relative overflow-hidden">
                                    {" "}
                                    {/* Keep image container at h-32 */}
                                    <Image
                                      // src={`/placeholder.svg?height=128&width=200&query=${subItem.label}`}
                                      src={`${subItem.image}`}
                                      alt={subItem.label}
                                      fill
                                      className="object-cover transition-all duration-700 ease-out group-hover/card:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                                      <ArrowUpRight className="w-3 h-3 text-red-600" />
                                    </div>
                                  </div>
                                  <div className="p-4 flex-1 flex flex-col justify-center">
                                    {" "}
                                    {/* Use flex-1 for remaining space */}
                                    <h4 className="font-semibold text-sm text-gray-900 group-hover/card:text-red-600 transition-colors duration-300 line-clamp-2">
                                      {subItem.label}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">Shop Collection</p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>

                      {/* Image Slider - Right Side */}
                      <div className="w-1/4">
                        <div className="mb-6">
                          <h3 className="font-bold text-2xl mb-2 text-gray-900">Trending Now</h3>
                          <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                        </div>

                        <div className="relative h-96 rounded-xl overflow-hidden group/slider shadow-lg">
                          {" "}
                          {/* Increased from h-80 to h-96 */}
                          <Image
                            src={sliderImages[currentImageIndex] || "/placeholder.svg"}
                            alt="Trending collection"
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          {/* Slider Content */}
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="text-white">
                              <h4 className="font-bold text-xl mb-2">Premium Collection</h4>
                              <p className="text-white/90 text-sm mb-4">Discover luxury items crafted with precision</p>

                              {/* Slider Dots */}
                              <div className="flex justify-center space-x-2">
                                {sliderImages.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Navigation Arrows */}
                          <button
                            onClick={() =>
                              setCurrentImageIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-white/30"
                          >
                            <ChevronLeft className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-white/30"
                          >
                            <ChevronRight className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </div>

        {/* Best Offers - Right aligned */}
        <li className="relative group ml-auto">
          <Link
            href="/products/?maxDiscount=60"
            className="group/offer flex items-center py-3 px-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg font-bold text-[15px]"
          >
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
            <span className="relative">
              Best Offers
              <span className="absolute -top-1 -right-3 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            </span>
            <div className="ml-2 w-0 group-hover/offer:w-4 transition-all duration-300 overflow-hidden">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </li>
      </div>
    </>
  )
}

export default DesktopMenu
