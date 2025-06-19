// components/product/ProductDetails.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, ZoomIn, ChevronDown, ChevronUp, Truck, Shield, RotateCcw, Award } from 'lucide-react';
import { addItemToCart } from '../../redux/actions/cartActions';
import { addToCart } from '../../lib/cart';
import { addToWishlist } from '../../lib/wishlist';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';
import { AddWish } from '../../redux/reducer/wishSlice';


function ProductDetails({ product, addItem, AddWishh }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Initialize selected variant when product loads
  useEffect(() => {
    if (product.hasVariants && product.variants.length > 0) {
      const firstActiveVariant = product.variants.find(v => v.isActive);
      if (firstActiveVariant) {
        setSelectedColor(firstActiveVariant.color);
        setSelectedSize(firstActiveVariant.size);
      }
    }
  }, [product]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (product.hasVariants) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize && v.isActive
      );
      setSelectedVariant(variant);
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, product]);

  // Calculate final price with discount
  const finalPrice = selectedVariant
    ? selectedVariant.price * (1 - (product.discount || 0) / 100)
    : product.price * (1 - (product.discount || 0) / 100);

  // Get available stock
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    // Format product data for cart
    const cartData = {
      products: [{
        product: product._id,
        variantId: selectedVariant?._id,
        quantity: quantity,
        price: selectedVariant?.price || product.price,
        discount: product.discount,
        name: product.name,
        image: product.images?.[0] || '/placeholder.png',
        color: selectedVariant?.color,
        size: selectedVariant?.size,
        sku: selectedVariant?.sku
      }]
    };

    const cartItem = {
      product: product._id,
      variantId: selectedVariant?._id,
      quantity: quantity,
      price: selectedVariant?.price || product.price,
      discount: product.discount,
      name: product.name,
      image: product.images?.[0] || '/placeholder.png',
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      sku: selectedVariant?.sku
    };

    try {
      const response = await addToCart(cartData);
      
      if (response.success) {
        addItem(response.data.items[0]);
        toast.success(response.message || "Added to cart!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else {
        toast.error("Failed to add to cart. Please try again.");
      }
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    // Create data specifically formatted for the API call
    const wishlistData = {
      productId: product._id, // Make sure we use productId, not product
      variantId: selectedVariant?._id,
    };

    // Create item for Redux store (can maintain your original format)
    const wishlistItem = {
      product: product._id,
      variantId: selectedVariant?._id,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image: product.images?.[0] || '/placeholder.png',
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      sku: selectedVariant?.sku
    };

    try {
      const response = await addToWishlist(wishlistData);
      
      if (response.success) {
        AddWishh(response.data); // Use response data instead of local item
        toast.success(response.message || "Added to wishlist!");
        return;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to add to wishlist");
        return;
      } 
      
      if (error.response?.status === 400) {
        if (error.response.data?.message.includes("already in wishlist")) {
          toast.error("Item is already in your wishlist!");
        } else {
          toast.error(error.response.data?.message || "Failed to add to wishlist");
        }
        return;
      }

      toast.error("Failed to add to wishlist. Please try again.");
      console.error("Wishlist error:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <div 
                className="relative aspect-square cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <Image
                  src={product.images?.[selectedImage] || '/placeholder.png'}
                  //src="/images/relot front page img 13-6/1st setion women_s bag.png"
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300"
                  style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                  }}
                  priority
                />
                {isZoomed && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg">
                    <ZoomIn className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratings || 0) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.ratings || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-4 mb-2">
                <div className="text-3xl font-bold text-blue-600">
                  ₹{finalPrice.toFixed(2)}
                </div>
                {product.discount > 0 && (
                  <>
                    <div className="text-xl text-gray-500 line-through">
                      ₹{(selectedVariant?.price || product.price).toFixed(2)}
                    </div>
                    <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                      {product.discount}% OFF
                    </div>
                  </>
                )}
              </div>
              {product.discount > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  You save ₹{((selectedVariant?.price || product.price) - finalPrice).toFixed(2)}
                </p>
              )}
            </div>

            {/* Variant Selection */}
            {product.hasVariants && (
              <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                {/* Color Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">
                    Color: <span className="text-blue-600">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableColors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                          selectedColor === color 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">
                    Size: <span className="text-blue-600">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                          selectedSize === size 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SKU Display */}
                {selectedVariant?.sku && (
                  <div className="text-sm text-gray-500">
                    SKU: <span className="font-mono">{selectedVariant.sku}</span>
                  </div>
                )}
              </div>
            )}

            {/* Stock & Quantity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Availability:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  availableStock > 0 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {availableStock > 0 
                    ? `${availableStock} in stock` 
                    : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button 
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    -
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
                    className="w-20 py-2 text-center bg-transparent focus:outline-none font-medium"
                  />
                  <button 
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    onClick={() => setQuantity(prev => Math.min(availableStock, prev + 1))}
                    disabled={quantity >= availableStock}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={availableStock <= 0 || (product.hasVariants && !selectedVariant)}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all transform hover:scale-105 ${
                  availableStock > 0 && (!product.hasVariants || selectedVariant) 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={handleAddToWishlist}
                disabled={product.hasVariants && !selectedVariant}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white border-2 border-gray-300 font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart className="h-6 w-6" />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <Truck className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <RotateCcw className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">30 days return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Product Description</h3>
                <div className={`text-gray-700 leading-relaxed ${
                  !isDescriptionExpanded ? 'line-clamp-4' : ''
                }`}>
                  <p>{product.description}</p>
                  {/* Add more description content here if needed */}
                  <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="mt-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Read More</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Category:</span>
                      <span className="text-gray-900 capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Stock:</span>
                      <span className="text-gray-900">{product.totalStock || product.stock}</span>
                    </div>
                    {product.hasVariants && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600">Variants:</span>
                        <span className="text-gray-900">{product.variants?.length || 0}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{product.ratings || 0}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(product.ratings || 0) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Based on 0 reviews</div>
                  </div>
                </div>
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItemToCart(item)),
  AddWishh: (item) => dispatch(AddWish(item))
});

export default connect(null, mapDispatchToProps)(ProductDetails);