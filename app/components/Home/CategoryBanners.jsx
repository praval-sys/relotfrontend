"use client"

import Link from "next/link"
import { useState } from "react"

export default function CategoryBanners() {
  const [hoveredBanner, setHoveredBanner] = useState(null)

  const banners = [
    {
      id: 'women',
      title: 'Women Handbags',
      subtitle: 'Elegant & Sophisticated',
      description: 'Discover our premium collection of women\'s handbags',
      image: '/images/relot front page img 13-6/womenbags hero.jpg',
      href: '/products/?category=women&subCategory=handbags',
      badge: 'New Collection'
    },
    {
      id: 'men',
      title: 'Men Bags',
      subtitle: 'Professional & Stylish',
      description: 'Explore our range of men\'s bags and leather goods',
      image: '/images/relot front page img 13-6/men-handbbag (1).avif',
      href: '/products/?category=men&subCategory=handbags',
      badge: 'Best Seller'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="block"
            onMouseEnter={() => setHoveredBanner(banner.id)}
            onMouseLeave={() => setHoveredBanner(null)}
          >
            <div className="relative h-[70vh] rounded-2xl overflow-hidden group cursor-pointer">
              {/* Background Image with Enhanced Hover Effect */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                  hoveredBanner === banner.id 
                    ? 'scale-110 brightness-110' 
                    : 'scale-100 brightness-100'
                }`}
                style={{
                  backgroundImage: `url("${banner.image}")`,
                }}
              />

              {/* Enhanced Gradient Overlay */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                hoveredBanner === banner.id
                  ? 'bg-gradient-to-t from-red-900/80 via-black/40 to-transparent'
                  : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
              }`} />

              {/* Red Accent Border on Hover */}
              <div className={`absolute inset-0 rounded-2xl border-4 transition-all duration-500 ${
                hoveredBanner === banner.id
                  ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                  : 'border-transparent'
              }`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                {/* Badge */}
                <div className={`mb-4 transition-all duration-500 transform ${
                  hoveredBanner === banner.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-80'
                }`}>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold transition-all duration-500 ${
                    hoveredBanner === banner.id
                      ? 'bg-red-500 text-white shadow-lg scale-110'
                      : 'bg-white/20 backdrop-blur-sm text-white'
                  }`}>
                    {banner.badge}
                  </span>
                </div>

                {/* Subtitle */}
                <div className={`mb-2 transition-all duration-500 transform ${
                  hoveredBanner === banner.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-70'
                }`}>
                  <p className="text-red-400 font-semibold text-lg tracking-wide">
                    {banner.subtitle}
                  </p>
                </div>

                {/* Title */}
                <h2 className={`text-4xl lg:text-5xl font-bold mb-4 transition-all duration-500 transform ${
                  hoveredBanner === banner.id 
                    ? 'translate-y-0 scale-105 text-white' 
                    : 'translate-y-0 scale-100 text-white'
                }`}>
                  {banner.title}
                </h2>

                {/* Description */}
                <p className={`text-gray-200 mb-6 text-lg transition-all duration-500 transform ${
                  hoveredBanner === banner.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'
                }`}>
                  {banner.description}
                </p>

                {/* Enhanced Shop Now Button */}
                <div className={`transition-all duration-500 transform ${
                  hoveredBanner === banner.id ? 'translate-y-0 scale-105' : 'translate-y-2 scale-100'
                }`}>
                  <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-500 group/btn ${
                    hoveredBanner === banner.id
                      ? 'bg-red-500 text-white shadow-2xl shadow-red-500/40 border-2 border-red-400'
                      : 'bg-white text-black border-2 border-white hover:bg-gray-100'
                  }`}>
                    <span>SHOP NOW</span>
                    <svg 
                      className={`w-6 h-6 transition-all duration-300 ${
                        hoveredBanner === banner.id 
                          ? 'translate-x-2 text-white' 
                          : 'translate-x-0 text-black group-hover/btn:translate-x-1'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-8 right-8 transition-all duration-700 transform ${
                  hoveredBanner === banner.id ? 'opacity-100 rotate-12 scale-110' : 'opacity-30 rotate-0 scale-100'
                }`}>
                  <div className="w-16 h-16 border-4 border-red-400 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Red Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-700 pointer-events-none ${
                hoveredBanner === banner.id
                  ? 'bg-gradient-to-br from-red-500/20 via-transparent to-red-500/20 blur-xl scale-110'
                  : 'bg-transparent'
              }`} style={{ zIndex: -1 }} />

              {/* Animated Particles Effect */}
              {hoveredBanner === banner.id && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping" />
                  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-red-300 rounded-full animate-pulse" />
                  <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
                </>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Call-to-Action Section */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Explore Our Complete Collection
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Discover thousands of premium products across all categories. From handbags to fragrances, 
            find everything you need to express your unique style.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-8 py-4 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
          >
            <span>View All Products</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
