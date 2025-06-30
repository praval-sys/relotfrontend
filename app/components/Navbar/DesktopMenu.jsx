"use client"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Tag, Sparkles, ChevronRight } from "lucide-react" // Import ChevronRight for nested items

const DesktopMenu = ({ menuData, activeSubmenu, setActiveSubmenu }) => {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-6">
          {menuData.map((item) => (
            <li className="relative group" key={item.id}>
              <Link
                href={item.link}
                className="flex items-center py-2 hover:text-red-600 transition-colors duration-300 ease-in-out font-bold text-[15px]"
                onMouseEnter={() => setActiveSubmenu(item.id)}
              >
                {item.label}
                {/* Only show ChevronDown if there's a top-level submenu */}
                {item.submenu && <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />}
              </Link>

              {item.submenu && (
                <div
                  className="absolute left-0 mt-2 bg-white shadow-xl rounded-lg z-[70] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-1 w-[800px] p-6"
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <div className="flex gap-6">
                    {/* Categories Section - Left Side */}
                    <div className="w-1/4 border-r border-gray-100 pr-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-800 pb-2 border-b">
                        {item.label} Categories
                      </h3>
                      <ul className="space-y-2">
                        {item.submenu.map((subItem, idx) => (
                          // Apply group class for nested dropdowns
                          <li key={idx} className="relative group/nested">
                            <Link
                              href={subItem.link}
                              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-semibold"
                            >
                              {subItem.label}
                              {/* Show ChevronRight if there's a nested submenu */}
                              {subItem.submenu && <ChevronRight className="ml-1 h-4 w-4" />}
                            </Link>

                            {/* Nested Submenu */}
                            {subItem.submenu && (
                              <div 
                                // 🔥 CHANGED: Increased nested menu z-index to z-[80]
                                className="absolute left-full top-0 ml-2 bg-white shadow-xl rounded-lg z-[80] opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-300 ease-in-out transform group-hover/nested:translate-x-0 translate-x-1 w-60 p-4"
                              >
                                <h4 className="font-bold text-base mb-3 text-gray-800 pb-1 border-b">
                                  {subItem.label}
                                </h4>
                                <ul className="space-y-2">
                                  {subItem.submenu.map((nestedItem, nestedIdx) => (
                                    <li key={nestedIdx}>
                                      <Link
                                        href={nestedItem.link}
                                        className="block py-1 px-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                                      >
                                        {nestedItem.label}
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

                    {/* Featured Items Grid - Right Side */}
                    <div className="w-3/4">
                      <h3 className="font-bold text-lg mb-4 text-gray-800 pb-2 border-b">
                        Featured Collections
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        {/* Ensure these subItems have an 'image' property in navbarData */}
                        {item.submenu.filter(subItem => subItem.image).slice(0, 4).map((subItem, idx) => (
                          <Link
                            href={subItem.link}
                            key={idx}
                            className="group/card block"
                          >
                            <div className="rounded-lg overflow-hidden bg-gray-50 hover:shadow-lg transition-all duration-300">
                              <div className="aspect-[16/10] relative overflow-hidden">
                                <Image
                                  src={subItem.image || `/placeholder.svg`}
                                  alt={subItem.label}
                                  fill
                                  className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-sm group-hover/card:text-red-600 transition-colors">
                                  {subItem.label}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 font-medium">
                                  Shop Collection
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
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
            className="flex items-center py-2 text-red-600 hover:text-red-700 transition-colors duration-300 ease-in-out font-bold text-[15px]"
          >
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
            <span className="relative">
              Best Offers
              <span className="absolute -top-1 -right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </span>
          </Link>
        </li>
      </div>
    </>
  )
}

export default DesktopMenu
