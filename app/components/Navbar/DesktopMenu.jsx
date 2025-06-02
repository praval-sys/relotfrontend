"use client"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Tag, Sparkles } from "lucide-react"

const DesktopMenu = ({ menuData, activeSubmenu, setActiveSubmenu }) => {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-6">
          {menuData.map((item) => (
            <li className="relative group" key={item.id}>
              <Link
                href={item.link}
                className="flex items-center py-2 hover:text-red-600 transition-colors duration-300 ease-in-out font-bold text-[15px]" // Updated font weight and size
                onMouseEnter={() => setActiveSubmenu(item.id)}
              >
                {item.label} 
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              </Link>

              {item.submenu && (
                <div
                  className="absolute left-0 mt-2 bg-white shadow-xl rounded-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-1 w-[800px] p-6"
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <div className="flex gap-6">
                    {/* Categories Section - Left Side */}
                    <div className="w-1/4 border-r border-gray-100 pr-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-800 pb-2 border-b"> {/* Updated font weight */}
                        {item.label} Categories
                      </h3>
                      <ul className="space-y-2">
                        {item.submenu.map((subItem, idx) => (
                          <li key={idx} className="relative group/submenu">
                            <Link
                              href={subItem.link}
                              className="block py-2 px-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-semibold" // Updated font weight
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Featured Items Grid - Right Side */}
                    <div className="w-3/4">
                      <h3 className="font-bold text-lg mb-4 text-gray-800 pb-2 border-b"> {/* Updated font weight */}
                        Featured Collections
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        {item.submenu.slice(0, 4).map((subItem, idx) => (
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
                                <h4 className="font-semibold text-sm group-hover/card:text-red-600 transition-colors"> {/* Updated font weight */}
                                  {subItem.label}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 font-medium"> {/* Updated font weight */}
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
            href="/offers"
            className="flex items-center py-2 text-red-600 hover:text-red-700 transition-colors duration-300 ease-in-out font-bold text-[15px]" // Updated font weight and size
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
