'use client';

import { useState } from 'react';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReview';
import AddReview from './AddReview';
import ProductRecommendations from './ProductRecommendations'; // Add this import

export default function ProductDetails({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12">
          {/* Left Column - Sticky Image Gallery (7/10 of width) */}
          <div className="lg:col-span-6 lg:h-screen lg:overflow-hidden">
            <ProductImageGallery 
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
            />
          </div>

          {/* Right Column - Scrollable Product Info (3/10 of width) */}
          <div className="lg:col-span-4 lg:h-screen lg:overflow-y-auto lg:pr-4 space-y-8">
            <ProductInfo 
              product={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            {/* Reviews Section */}
            <div className="rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
              <ProductReviews productId={product._id} />
            </div>

            {/* Add Review Section */}
            <div className=" rounded-xl  p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Write a Review</h3>
              <AddReview productId={product._id} />
            </div>
          </div>
        </div>

        {/* ✅ Product Recommendations Section - Full Width */}
        <div className="mt-16">
          <ProductRecommendations 
            productId={product._id} 
            category={product.category} 
          />
        </div>
      </div>
    </div>
  );
}