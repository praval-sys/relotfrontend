// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Search, Heart, User, ShoppingBag, ChevronDown } from "lucide-react"

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

//   const cartItemCount = 0 // Replace with your cart state

//   const handleSearch = (e) => {
//     e.preventDefault()
//     // Implement search functionality
//     console.log("Searching for:", searchQuery)
//   }

//   return (
//     <header className="w-full border-b border-gray-200">
//       {/* Top navbar */}
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="flex-shrink-0">
//           <div className="relative h-14 w-32">
//             <div className="font-bold text-3xl flex items-center">
//               <span>RE</span>
//               <span className="bg-red-600 text-white px-2">LOT</span>
//             </div>
//           </div>
//         </Link>

//         {/* Search Bar */}
//         <div className="hidden md:flex flex-1 max-w-xl mx-4">
//           <form onSubmit={handleSearch} className="w-full flex">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Search Store"
//                 className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-red-600 text-white px-4 rounded-r-full hover:bg-red-700 transition-colors"
//             >
//               <Search className="h-5 w-5" />
//             </button>
//           </form>
//         </div>

//         {/* Icons */}
//         <div className="flex items-center space-x-4">
//           <Link href="/wishlist" className="hidden sm:block">
//             <Heart className="h-6 w-6" />
//           </Link>
//           <Link href="/account">
//             <User className="h-6 w-6" />
//           </Link>
//           <Link href="/cart" className="relative">
//             <ShoppingBag className="h-6 w-6" />
//             {cartItemCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                 {cartItemCount}
//               </span>
//             )}
//           </Link>
//         </div>
//       </div>

//       {/* Navigation Menu */}
//       <nav className="container mx-auto px-4 py-2">
//         <ul className="flex items-center space-x-6">
//         <li className="relative group">
//   <Link className="flex items-center py-2 hover:text-red-600">
//     Women <ChevronDown className="ml-1 h-4 w-4" />
//   </Link>
//   <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-1 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
//     <Link href="/women/handbags" className="block px-4 py-3 text-sm hover:bg-gray-100">
//       Handbags
//     </Link>
//     <Link href="/women/wallets-and-small-leather-goods" className="block px-4 py-3 text-sm hover:bg-gray-100">
//       Wallets and Small Leather Goods
//     </Link>

//     {/* Accessories submenu */}
//     <div className="relative group/submenu">
//       <Link
//         href="/women/accessories"
//         className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100"
//       >
//         Accessories
//         <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
//       </Link>
//       <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 invisible opacity-0 group-hover/submenu:visible group-hover/submenu:opacity-100 transition-all duration-200">
//         <Link href="/women/accessories/jewelry" className="block px-4 py-3 text-sm hover:bg-gray-100">
//           Jewelry
//         </Link>
//         <Link href="/women/accessories/scarves" className="block px-4 py-3 text-sm hover:bg-gray-100">
//           Scarves
//         </Link>
//         <Link href="/women/accessories/belts" className="block px-4 py-3 text-sm hover:bg-gray-100">
//           Belts
//         </Link>
//       </div>
//     </div>

//     {/* Travel submenu */}
//     <div className="relative group/submenu">
//       <Link
//         href="/women/travel"
//         className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100"
//       >
//         Travel
//         <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
//       </Link>
//       <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 invisible opacity-0 group-hover/submenu:visible group-hover/submenu:opacity-100 transition-all duration-200">
//         <Link href="/women/travel/luggage" className="block px-4 py-3 text-sm hover:bg-gray-100">
//           Luggage
//         </Link>
//         <Link href="/women/travel/travel-accessories" className="block px-4 py-3 text-sm hover:bg-gray-100">
//           Travel Accessories
//         </Link>
//         <Link href="/women/travel/travel-bags" className="block px-4 py-3 text-sm hover:bg-gray-100">
//           Travel Bags
//         </Link>
//       </div>
//     </div>
//   </div>
// </li>
//           <li className="relative group">
//             <Link href="/mens" className="flex items-center py-2 hover:text-red-600">
//               Mens <ChevronDown className="ml-1 h-4 w-4" />
//             </Link>
//             {/* Dropdown would go here */}
//           </li>
//           <li className="relative group">
//             <Link href="/fragrances" className="flex items-center py-2 hover:text-red-600">
//               FRAGRANCES <ChevronDown className="ml-1 h-4 w-4" />
//             </Link>
//             {/* Dropdown would go here */}
//           </li>
//           <li className="relative group">
//             <Link href="/bags" className="flex items-center py-2 hover:text-red-600">
//               BAGS AND SMALL LEATHER GOODS <ChevronDown className="ml-1 h-4 w-4" />
//             </Link>
//             {/* Dropdown would go here */}
//           </li>
//           <li className="relative group">
//             <Link href="/services" className="flex items-center py-2 hover:text-red-600">
//               SERVICES <ChevronDown className="ml-1 h-4 w-4" />
//             </Link>
//             {/* Dropdown would go here */}
//           </li>

//           {/* Language Selector */}
//           <li className="relative ml-auto">
//             <button
//               className="flex items-center space-x-2 py-2"
//               onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
//             >
//               <span className="flex items-center">
//                 {/* <Image
//                   src="/placeholder.svg?height=20&width=30"
//                   alt="UK Flag"
//                   width={30}
//                   height={20}
//                   className="mr-2"
//                 /> */}
//                 EN
//               </span>
//               <ChevronDown className="h-4 w-4" />
//             </button>

//             {isLanguageDropdownOpen && (
//               <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 invisible opacity-0 group-hover/submenu:visible group-hover/submenu:opacity-100 transition-all duration-200">
//                 <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
//                   {/* <Image
//                     src="/placeholder.svg?height=20&width=30"
//                     alt="UK Flag"
//                     width={30}
//                     height={20}
//                     className="mr-2"
//                   /> */}
//                   English
//                 </button>
//                 <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
//                   {/* <Image
//                     src="/placeholder.svg?height=20&width=30"
//                     alt="France Flag"
//                     width={30}
//                     height={20}
//                     className="mr-2"
//                   /> */}
//                   Français
//                 </button>
//                 <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
//                   {/* <Image
//                     src="/placeholder.svg?height=20&width=30"
//                     alt="Germany Flag"
//                     width={30}
//                     height={20}
//                     className="mr-2"
//                   /> */}
//                   Deutsch
//                 </button>
//               </div>
//             )}
//           </li>
//         </ul>
//       </nav>

//       {/* Mobile Search - Only visible on mobile */}
//       <div className="md:hidden container mx-auto px-4 py-2">
//         <form onSubmit={handleSearch} className="w-full flex">
//           <div className="relative w-full">
//             <input
//               type="text"
//               placeholder="Search Store"
//               className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-red-600 text-white px-4 rounded-r-full hover:bg-red-700 transition-colors"
//           >
//             <Search className="h-5 w-5" />
//           </button>
//         </form>
//       </div>
//     </header>
//   )
// }

// export default Navbar


"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Heart, User, ShoppingBag, ChevronDown } from "lucide-react"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const cartItemCount = 0 // Replace with your cart state

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <header className="w-full border-b border-gray-200">
      {/* Top navbar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="relative h-14 w-32">
            <div className="font-bold text-3xl flex items-center">
              <span>RE</span>
              <span className="bg-red-600 text-white px-2">LOT</span>
            </div>
          </div>
        </Link> 

        

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="w-full flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Store"
                className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 rounded-r-full hover:bg-red-700 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4"> 
          <Link href="/wishlist" className="hidden sm:block">
            <Heart className="h-6 w-6" />
          </Link>
          <Link href="/login">
            <User className="h-6 w-6" />
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingBag className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="container mx-auto px-4 py-2">
        <ul className="flex items-center space-x-6">
          <li className="relative group">
            <Link href="/women" className="flex items-center py-2 hover:text-red-600">
              Women <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-1 z-10 hidden group-hover:block">
              <Link href="/women/handbags" className="block px-4 py-3 text-sm hover:bg-gray-100">
                Handbags
              </Link>
              <Link href="/women/wallets-and-small-leather-goods" className="block px-4 py-3 text-sm hover:bg-gray-100">
                Wallets and Small Leather Goods
              </Link>
              <div className="relative group/submenu">
                <Link
                  href="/women/accessories"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Accessories
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </Link>
                <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 hidden group-hover/submenu:block">
                  <Link href="/women/accessories/jewelry" className="block px-4 py-3 text-sm hover:bg-gray-100">
                    Jewelry
                  </Link>
                  <Link href="/women/accessories/scarves" className="block px-4 py-3 text-sm hover:bg-gray-100">
                    Scarves
                  </Link>
                  <Link href="/women/accessories/belts" className="block px-4 py-3 text-sm hover:bg-gray-100">
                    Belts
                  </Link>
                </div>
              </div>
              <div className="relative group/submenu">
                <Link
                  href="/women/travel"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Travel
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </Link>
                <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 hidden group-hover/submenu:block">
                  <Link href="/women/travel/luggage" className="block px-4 py-3 text-sm hover:bg-gray-100">
                    Luggage
                  </Link>
                  <Link href="/women/travel/travel-accessories" className="block px-4 py-3 text-sm hover:bg-gray-100">
                    Travel Accessories
                  </Link>
                  <Link href="/women/travel/travel-bags" className="block px-4 py-3 text-sm hover:bg-gray-100">
                    Travel Bags
                  </Link>
                </div>
              </div>
            </div>
          </li>
          <li className="relative group">
            <Link href="/mens" className="flex items-center py-2 hover:text-red-600">
              Mens <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            {/* Dropdown would go here */}
          </li>
          <li className="relative group">
            <Link href="/fragrances" className="flex items-center py-2 hover:text-red-600">
              FRAGRANCES <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            {/* Dropdown would go here */}
          </li>
          <li className="relative group">
            <Link href="/bags" className="flex items-center py-2 hover:text-red-600">
              BAGS AND SMALL LEATHER GOODS <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            {/* Dropdown would go here */}
          </li>
          <li className="relative group">
            <Link href="/services" className="flex items-center py-2 hover:text-red-600">
              SERVICES <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            {/* Dropdown would go here */}
          </li>

          {/* Language Selector */}
          <li className="relative ml-auto">
            <button
              className="flex items-center space-x-2 py-2"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <span className="flex items-center">
                <Image
                  src="/placeholder.svg?height=20&width=30"
                  alt="UK Flag"
                  width={30}
                  height={20}
                  className="mr-2"
                />
                EN
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10">
                <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                  <Image
                    src="/placeholder.svg?height=20&width=30"
                    alt="UK Flag"
                    width={30}
                    height={20}
                    className="mr-2"
                  />
                  English
                </button>
                <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                  <Image
                    src="/placeholder.svg?height=20&width=30"
                    alt="France Flag"
                    width={30}
                    height={20}
                    className="mr-2"
                  />
                  Français
                </button>
                <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                  <Image
                    src="/placeholder.svg?height=20&width=30"
                    alt="Germany Flag"
                    width={30}
                    height={20}
                    className="mr-2"
                  />
                  Deutsch
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile Search - Only visible on mobile */}
      <div className="md:hidden container mx-auto px-4 py-2">
        <form onSubmit={handleSearch} className="w-full flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Store"
              className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 rounded-r-full hover:bg-red-700 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  )
}

export default Navbar
