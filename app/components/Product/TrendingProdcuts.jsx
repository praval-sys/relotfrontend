// components/product/RelatedProducts.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Tag, TrendingUp, Zap } from 'lucide-react';
import { getTrendingProducts } from '../../lib/products';

export default function TrendingProducts({ productId, category }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await getTrendingProducts();
        if (response.success && response.data) {
          setRelatedProducts(response.data.slice(0, 4)); // Limit to 4 products
        }
      } catch (error) {
        console.error('Failed to fetch trending products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, category]);

  // Get images from updated schema (same as ProductPageCard)
  const getProductImages = (product) => {
    if (product.gallery?.images?.length > 0) {
      return product.gallery.images.map(img => img.url)
    }
    if (product.media?.length > 0) {
      return product.media.map(img => img.url)
    }
    if (product.images?.length > 0) {
      return product.images
    }
    return ['/placeholder-product.jpg']
  }

  if (loading) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Skeleton */}
          <div className="text-center mb-8 md:mb-12">
            <div className="h-6 md:h-8 bg-gray-200 animate-pulse rounded-lg w-48 md:w-64 mx-auto mb-3 md:mb-4"></div>
            <div className="h-3 md:h-4 bg-gray-200 animate-pulse rounded w-64 md:w-96 mx-auto"></div>
          </div>
          
          {/* Products Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80 md:h-96 w-full max-w-xs"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced Header Section */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          {/* Icon and Badge */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-red-200">
              <Zap className="w-3 h-3 md:w-4 lg:w-5 md:h-4 lg:h-5" />
              <span className="font-semibold text-xs md:text-sm uppercase tracking-wide">What's Hot</span>
            </div>
          </div>
          
          {/* Main Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Trending <span className="text-red-600">Right Now</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-xl lg:max-w-2xl mx-auto mb-4 md:mb-6">
            Stay ahead with the latest trends and most popular items flying off our shelves
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div className="w-12 md:w-16 lg:w-20 h-0.5 bg-gradient-to-r from-transparent to-red-500"></div>
            <TrendingUp className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:h-6 text-red-500" />
            <div className="w-12 md:w-16 lg:w-20 h-0.5 bg-gradient-to-l from-transparent to-red-500"></div>
          </div>
        </div>

        {/* Products Grid - Properly Centered */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-items-center">
          {relatedProducts.map((product, index) => {
            const productImages = getProductImages(product);
            const currentImage = productImages[0];
            
            return (
              <Link key={product._id || product.id} href={`/products/${product._id || product.id}`} className="w-full max-w-xs">
                <div 
                  className="group bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 md:duration-500 hover:-translate-y-1 md:hover:-translate-y-2 cursor-pointer relative w-full h-full"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Trending Badge */}
                  <div className="absolute top-2 md:top-3 lg:top-4 left-2 md:left-3 lg:left-4 z-20">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                      <span className="hidden sm:inline">Trending</span>
                      <span className="sm:hidden">Hot</span>
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image 
                      src={currentImage}
                      alt={product.name}
                      fill
                      className={`object-cover transition-all duration-500 md:duration-700 ${
                        hoveredIndex === index ? 'scale-105 md:scale-110 brightness-110' : 'scale-100'
                      }`}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      unoptimized
                    />
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 md:top-3 lg:top-4 right-2 md:right-3 lg:right-4 z-20">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          -{product.discount}%
                        </div>
                      </div>
                    )}

                    {/* Stock Status Badge */}
                    {(product.stock === 0 || !product.inStock) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <div className="bg-gray-900 text-white text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                          Out of Stock
                        </div>
                      </div>
                    )}

                    {/* Enhanced Hover Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-red-900/50 via-red-600/20 to-transparent transition-all duration-300 md:duration-500 ${
                      hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                    }`} />

                    {/* Hover Quick View Button - Hidden on mobile */}
                    <div className={`hidden md:block absolute bottom-3 lg:bottom-4 left-3 lg:left-4 right-3 lg:right-4 transition-all duration-500 transform ${
                      hoveredIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                      <div className="bg-white/95 backdrop-blur-sm text-red-600 font-bold py-2 px-4 rounded-lg text-center text-sm">
                        Quick View
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Product Info */}
                  <div className="p-3 md:p-4 lg:p-5">
                    {/* Product Name */}
                    <h3 className={`font-bold text-sm md:text-base mb-2 md:mb-3 line-clamp-2 leading-tight transition-colors duration-300 ${
                      hoveredIndex === index ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.name}
                    </h3>
                    
                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs md:text-sm font-medium text-gray-700">
                          {product.averageRating || product.ratings || 0}
                        </span>
                      </div>
                      {product.reviewCount > 0 && (
                        <span className="text-xs text-gray-500 hidden sm:inline">
                          ({product.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                    
                    {/* Enhanced Price Section */}
                    <div className="mb-3 md:mb-4">
                      {product.discount > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 md:gap-2">
                            <span className={`font-bold text-base md:text-lg lg:text-xl transition-colors duration-300 ${
                              hoveredIndex === index ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              ₹{product.finalPrice?.toLocaleString() || 
                                (product.price * (1 - product.discount / 100)).toFixed(0)}
                            </span>
                            <span className="text-xs md:text-sm text-gray-400 line-through">
                              ₹{product.price?.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs md:text-sm font-medium text-green-600">
                            Save ₹{((product.price * product.discount) / 100).toFixed(0)}
                          </div>
                        </div>
                      ) : (
                        <span className={`font-bold text-base md:text-lg lg:text-xl transition-colors duration-300 ${
                          hoveredIndex === index ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          ₹{product.price?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between">
                      {/* Stock or Shipping Info */}
                      {product.stock > 0 && product.inStock !== false ? (
                        product.shipping?.freeShipping ? (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <span className="hidden sm:inline">🚚 </span>Free Ship
                          </span>
                        ) : product.stock <= 5 && product.stock > 0 ? (
                          <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
                            <span className="hidden sm:inline">Only </span>{product.stock} left!
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            In Stock
                          </span>
                        )
                      ) : (
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}

                      {/* View Details Link */}
                      <span className={`text-xs md:text-sm font-semibold transition-colors duration-300 ${
                        hoveredIndex === index ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        <span className="hidden sm:inline">View Details </span>→
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Red Border on Hover */}
                  <div className={`absolute inset-0 rounded-xl md:rounded-2xl border-2 md:border-3 transition-all duration-300 md:duration-500 pointer-events-none ${
                    hoveredIndex === index ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] md:shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-transparent'
                  }`} />

                  {/* Glow Effect - Hidden on mobile for performance */}
                  <div className={`hidden md:block absolute inset-0 rounded-2xl transition-all duration-700 -z-10 ${
                    hoveredIndex === index
                      ? 'bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20 blur-xl scale-110'
                      : 'bg-transparent'
                  }`} />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 md:mt-10 lg:mt-12">
          <Link
            href="/products/?trending=true"
            className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group text-sm md:text-base"
          >
            <span>Explore All Trending</span>
            <Zap className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}