// components/product/RelatedProducts.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getTrendingProducts } from '../../lib/products';

export default function TrendingProducts({ productId, category }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await getTrendingProducts();
        if (response.success && response.data) {
          setRelatedProducts(response.data.slice(0, 4)); // Limit to 4 products
        }
      } catch (error) {
        console.error('Failed to fetch related products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, category]);

  const calculateFinalPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-4 h-64"></div>
        ))}
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return <p className="text-gray-500">No related products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
            {/* Discount Badge */}
            {product.discount > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{product.discount}% OFF
                </div>
              </div>
            )}
            
            <div className="aspect-square relative">
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-400">No image</p>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-lg truncate">{product.name}</h3>
              
              <div className="flex items-center space-x-1 mt-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i}
                    size={14}
                    className={i < Math.round(product.ratings || 0) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"}
                  />
                ))}
              </div>
              
              {/* Updated Price Display */}
              <div className="mt-2 flex items-center gap-2">
                {product.discount > 0 ? (
                  <>
                    <span className="font-bold text-lg text-blue-600">
                      ₹{calculateFinalPrice(product.price, product.discount).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-lg text-blue-600">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {product.stock <= 5 && product.stock > 0 && (
                <p className="mt-2 text-xs text-red-500">
                  Only {product.stock} left!
                </p>
              )}
              {product.stock === 0 && (
                <p className="mt-2 text-xs text-red-500">
                  Out of stock
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}