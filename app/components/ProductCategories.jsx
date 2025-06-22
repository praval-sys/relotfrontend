"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Enhanced categories with proper query parameters based on navbar data
const categories = [
  {
    href: '/products/?category=women&subCategory=handbags',
    imgSrc: '/images/relot front page img 13-6/1st setion women_s bag.png',
    title: "Women's Handbags",
    description: "Discover elegant handbags for every occasion"
  },
  {
    href: '/products/?category=women&subCategory=wallets-and-small-leather-goods',
    imgSrc: '/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif',
    title: "Women's Wallet and Small Leather Good",
    description: "Premium wallets and leather accessories"
  },
  {
    href: '/products/?category=men&subCategory=handbags',
    imgSrc: '/images/relot front page img 13-6/1st sec men_s bag.avif',
    title: "Men's Bags",
    description: "Sophisticated bags for the modern man"
  },
  {
    href: '/products/?category=men&subCategory=wallets-and-small-leather-goods',
    imgSrc: '/images/relot front page img 13-6/Men_s Wallet and Small Leather Good.avif',
    title: "Men's Wallet and Small Leather Good",
    description: "Crafted leather goods for everyday use"
  },
  {
    href: '/products/?category=fragrances&subCategory=perfume',
    imgSrc: '/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif',
    title: "Fragrances",
    description: "Captivating scents for every personality"
  },
  {
    href: '/products/?category=women&subCategory=accessories&childCategory=jewelry',
    imgSrc: '/images/relot front page img 13-6/topbnr3.jpg',
    title: "Women's Jewelry",
    description: "Exquisite jewelry to complete your look"
  }
]

export default function ProductCategories() {
  const router = useRouter()

  const handleCategoryClick = (href, e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
            Shop by Category
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our curated collection of premium bags, leather goods, and fragrances
          </p>
        </div>

        {/* Categories Grid - Responsive and Centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {categories.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              onClick={(e) => handleCategoryClick(item.href, e)}
              className="group w-full max-w-sm"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] h-full">
                {/* Fixed Image Container */}
                <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={item.imgSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-all duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="text-center text-white p-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold">Explore Collection</p>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Popular
                  </div>
                </div>

                {/* Fixed Content Section */}
                <div className="p-6 h-32 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Shop Now Button */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-red-600 font-semibold text-sm group-hover:text-red-700 transition-colors duration-300">
                      Shop Now
                    </span>
                    <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                      <svg className="w-5 h-5 text-red-600 group-hover:text-red-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-300 transition-colors duration-500" />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-400/0 via-pink-400/0 to-red-400/0 group-hover:from-red-400/20 group-hover:via-pink-400/20 group-hover:to-red-400/20 transition-all duration-700 -z-10 blur-xl transform scale-110" />
              </div>
            </Link>
          ))}
        </div>

        {/* Browse All Categories Button */}
        <div className="text-center mt-12 lg:mt-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-8 py-4 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
          >
            <span>Browse All Categories</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
