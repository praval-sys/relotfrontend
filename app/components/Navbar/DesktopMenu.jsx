"use client"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Tag, Sparkles } from "lucide-react"

const DesktopMenu = ({ menuData, activeSubmenu, setActiveSubmenu }) => {
  return (
    <>
      {/* Main menu list wrapper with flex container */}
      <div className="flex w-full items-center justify-between">
        {/* Regular menu items in a flex container */}
        <div className="flex items-center space-x-6">
          {menuData.map((item) => (
            <li className="relative group" key={item.id}>
              <Link
                href={item.link}
                className="flex items-center py-2 hover:text-red-600 transition-colors duration-300 ease-in-out font-extrabold"
                onMouseEnter={() => setActiveSubmenu(item.id)}
              >
                {item.label} 
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              </Link>

              {item.submenu && (
                <div
                  className="absolute left-0 mt-2 bg-white shadow-xl rounded-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-1 w-[600px] p-4 border border-gray-100 font-bold"
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <div className="w-1/3 pr-4 border-r border-gray-100">
                    <h3 className="font-medium text-lg mb-3 text-gray-800">{item.label} Categories</h3>
                    <ul className="space-y-1">
                      {item.submenu.map((subItem, idx) => (
                        <li key={idx} className="relative group/submenu">
                          <Link
                            href={subItem.link}
                            className="py-2 px-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-between font-bold"
                          >
                            {subItem.label}
                            {subItem.submenu && <ChevronDown className="h-4 w-4 rotate-[-90deg]" />}
                          </Link>

                          {subItem.submenu && (
                            <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-2 px-3 z-20 hidden group-hover/submenu:block -mt-2 ml-1 border border-gray-100">
                              <h4 className="font-medium text-sm mb-2 text-gray-700 border-b border-gray-100 pb-1">
                                {subItem.label}
                              </h4>
                              {subItem.submenu.map((nestedItem, nestedIdx) => (
                                <Link
                                  key={nestedIdx}
                                  href={nestedItem.link}
                                  className="block py-1.5 text-sm hover:text-red-600 transition-colors"
                                >
                                  {nestedItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-2/3 pl-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Featured items with images */}
                      {item.submenu.slice(0, 4).map((subItem, idx) => (
                        <Link href={subItem.link} key={idx} className="group/card">
                          <div className="rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-all">
                            <div className="h-32 overflow-hidden">
                              <Image
                                src={subItem.image || `/placeholder.svg?height=128&width=200`}
                                alt={subItem.label}
                                width={200}
                                height={128}
                                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-sm group-hover/card:text-red-600 transition-colors">
                                {subItem.label}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">Shop Collection</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </div>

        {/* Best Offers pushed to the right */}
        <li className="relative group ml-auto">
          <Link
            href="/offers"
            className="flex items-center py-2 text-red-600 hover:text-red-700 transition-colors duration-300 ease-in-out font-extrabold"
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
