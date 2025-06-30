'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSimilarProducts, getRelatedProducts, getCategoryRecommendations } from '../../lib/products';

// Simple Product Card Component
const ProductCard = ({ product }) => {
  const getImageUrl = () => {
    if (product.gallery?.images && product.gallery.images.length > 0) {
      return product.gallery.images[0].url;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/placeholder-product.jpg';
  };

  const finalPrice = product.finalPrice || (product.price * (1 - (product.discount || 0) / 100));

  return (
    <Link href={`/products/${product.id || product._id}`}>
      <div className="group flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100">
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
          <Image
            src={getImageUrl()}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="256px"
            unoptimized
          />
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-black text-sm line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          {(product.ratings > 0 || product.averageRating > 0) && (
            <div className="flex items-center gap-1">
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.round(product.ratings || product.averageRating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-black">₹{finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-red-600">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-600">Out of stock</p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Horizontal Scrollable Section Component
const ProductSection = ({ title, products, loading }) => {
  const scrollRef = useRef(null); // ✅ Fixed: Use useRef instead of useState

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 bg-gray-200 rounded-lg animate-pulse h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main ProductRecommendations Component
export default function ProductRecommendations({ productId, category }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState({
    related: true,
    similar: true,
    category: true
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!productId) return;

      try {
        // Fetch Related Products
        setLoading(prev => ({ ...prev, related: true }));
        try {
          const relatedResponse = await getRelatedProducts(productId, { limit: 10 });
          if (relatedResponse.success && relatedResponse.data) {
            setRelatedProducts(relatedResponse.data);
          }
        } catch (error) {
          console.error('Failed to fetch related products:', error);
        } finally {
          setLoading(prev => ({ ...prev, related: false }));
        }

        // Fetch Similar Products
        setLoading(prev => ({ ...prev, similar: true }));
        try {
          const similarResponse = await getSimilarProducts(productId, { limit: 10 });
          if (similarResponse.success && similarResponse.data) {
            setSimilarProducts(similarResponse.data);
          }
        } catch (error) {
          console.error('Failed to fetch similar products:', error);
        } finally {
          setLoading(prev => ({ ...prev, similar: false }));
        }

        // Fetch Category Recommendations
        if (category) {
          setLoading(prev => ({ ...prev, category: true }));
          try {
            const categoryResponse = await getCategoryRecommendations(category, { 
              limit: 10,
              excludeId: productId 
            });
            if (categoryResponse.success && categoryResponse.data) {
              setCategoryProducts(categoryResponse.data);
            }
          } catch (error) {
            console.error('Failed to fetch category recommendations:', error);
          } finally {
            setLoading(prev => ({ ...prev, category: false }));
          }
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading({ related: false, similar: false, category: false });
      }
    };

    fetchRecommendations();
  }, [productId, category]);

  return (
    <div className="space-y-12 py-8">
      {/* Related Products Section */}
      <ProductSection
        title="Related Products"
        products={relatedProducts}
        loading={loading.related}
      />

      {/* Similar Products Section */}
      <ProductSection
        title="Similar Products"
        products={similarProducts}
        loading={loading.similar}
      />

      {/* Category Recommendations Section */}
      {category && (
        <ProductSection
          title={`More in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
          products={categoryProducts}
          loading={loading.category}
        />
      )}
    </div>
  );
}