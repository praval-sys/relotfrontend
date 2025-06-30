'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronDown, Truck, RotateCcw, Shield, Award, Minus, Plus } from 'lucide-react';

export default function ProductInfo({ 
  product, 
  selectedVariant, 
  setSelectedVariant,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity
}) {
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    features: false,
    specifications: false,
    shipping: false
  });

  // Initialize selected variant when product loads
  useEffect(() => {
    if (product.hasVariants && product.variants?.length > 0) {
      const firstActiveVariant = product.variants.find(v => v.isActive);
      if (firstActiveVariant) {
        setSelectedColor(firstActiveVariant.color);
        setSelectedSize(firstActiveVariant.size);
      }
    }
  }, [product, setSelectedColor, setSelectedSize]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (product.hasVariants) {
      const variant = product.variants?.find(
        v => v.color === selectedColor && v.size === selectedSize && v.isActive
      );
      setSelectedVariant(variant);
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, product, setSelectedVariant, setQuantity]);

  // Calculate final price with discount
  const finalPrice = selectedVariant
    ? (selectedVariant.price || product.price) * (1 - (product.discount || 0) / 100)
    : product.price * (1 - (product.discount || 0) / 100);

  // Get available stock
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Simple expandable section
  const renderExpandableSection = (key, title, content, icon) => {
    if (!content) return null;
    
    return (
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection(key)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            {icon && <div className="text-gray-600">{icon}</div>}
            <span className="font-semibold text-black">{title}</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-600 transform transition-transform ${expandedSections[key] ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections[key] && (
          <div className="p-4 pt-0 border-t border-gray-100">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 mt-10">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-black text-black leading-tight">
          {product.name}
        </h1>
        
        {/* Brand and Category */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {product.brand && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
              {product.brand}
            </span>
          )}
          {product.category && (
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium capitalize">
              {product.category}
            </span>
          )}
        </div>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-gray-700 text-lg">{product.shortDescription}</p>
        )}
        
        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 ${
                  i < Math.floor(product.averageRating || product.ratings || 0) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm">
            {product.averageRating?.toFixed(1) || '0.0'} ({product.reviewCount || 0} reviews)
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-3xl font-bold text-black">
            ₹{finalPrice.toFixed(2)}
          </div>
          {product.discount > 0 && (
            <>
              <div className="text-xl text-gray-500 line-through">
                ₹{(selectedVariant?.price || product.price).toFixed(2)}
              </div>
              <div className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
                {product.discount}% OFF
              </div>
            </>
          )}
        </div>
        {product.discount > 0 && (
          <p className="text-green-600 font-medium">
            You save ₹{((selectedVariant?.price || product.price) - finalPrice).toFixed(2)}
          </p>
        )}
      </div>

      {/* Variant Selection */}
      {product.hasVariants && product.variants?.length > 0 && (
        <div className="space-y-6">
          {/* Color Selection */}
          {product.availableColors?.length > 0 && (
            <div className="space-y-3">
              <label className="text-lg font-bold text-black">
                Color: <span className="text-red-600 font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border font-medium ${
                      selectedColor === color 
                        ? 'border-red-600 bg-red-50 text-red-700' 
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.availableSizes?.length > 0 && (
            <div className="space-y-3">
              <label className="text-lg font-bold text-black">
                Size: <span className="text-red-600 font-normal">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border font-medium ${
                      selectedSize === size 
                        ? 'border-red-600 bg-red-50 text-red-700' 
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SKU Display */}
          {selectedVariant?.sku && (
            <div className="text-sm text-gray-600">
              SKU: <span className="font-mono text-black">{selectedVariant.sku}</span>
            </div>
          )}
        </div>
      )}

      {/* Stock & Quantity */}
      <div className="space-y-4">
        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-black">Availability:</span>
          <span className={`font-medium ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {availableStock > 0 ? `${availableStock} in stock` : "Out of Stock"}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="space-y-3">
          <span className="font-bold text-black">Quantity:</span>
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black border border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="1"
              max={availableStock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(
                availableStock, 
                Math.max(1, parseInt(e.target.value) || 1)
              ))}
              className="w-20 text-center border border-gray-300 rounded-lg py-2 font-bold text-black focus:outline-none focus:border-gray-500"
            />
            <button 
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black border border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50"
              onClick={() => setQuantity(prev => Math.min(availableStock, prev + 1))}
              disabled={quantity >= availableStock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
          <Truck className="h-5 w-5 text-gray-600" />
          <div>
            <p className="font-bold text-black">Free Shipping</p>
            <p className="text-sm text-gray-600">On orders over ₹500</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
          <RotateCcw className="h-5 w-5 text-gray-600" />
          <div>
            <p className="font-bold text-black">Easy Returns</p>
            <p className="text-sm text-gray-600">30 days return policy</p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-black">Product Details</h3>

        {/* Description */}
        {renderExpandableSection(
          'description',
          'Description',
          <div className="space-y-3">
            {product.detailedDescription && product.detailedDescription.length > 0 ? (
              <div className="space-y-4">
                {product.detailedDescription
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <div key={index} className="space-y-2">
                      {section.title && (
                        <h4 className="font-bold text-black">{section.title}</h4>
                      )}
                      <div className="text-gray-700">
                        {section.type === 'html' ? (
                          <div dangerouslySetInnerHTML={{ __html: section.content }} />
                        ) : (
                          <p>{section.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-gray-700">{product.description}</p>
            )}
          </div>,
          <Shield className="h-5 w-5" />
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && renderExpandableSection(
          'features',
          'Key Features',
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>,
          <Award className="h-5 w-5" />
        )}

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && renderExpandableSection(
          'specifications',
          'Specifications',
          <div className="space-y-2">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700">{spec.name}:</span>
                <span className="text-black font-medium">{spec.value}</span>
              </div>
            ))}
          </div>,
          <Shield className="h-5 w-5" />
        )}

        {/* Shipping Info */}
        {renderExpandableSection(
          'shipping',
          'Shipping & Returns',
          <div className="space-y-4">
            <div>
              <h5 className="font-bold text-black mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping Information
              </h5>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Free shipping on orders over ₹500</li>
                <li>• Standard delivery: 3-5 business days</li>
                <li>• Express delivery available</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-black mb-2 flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Return Policy
              </h5>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• 30-day return policy</li>
                <li>• Item must be in original condition</li>
                <li>• Free return shipping</li>
              </ul>
            </div>
          </div>,
          <Truck className="h-5 w-5" />
        )}
      </div>
    </div>
  );
}