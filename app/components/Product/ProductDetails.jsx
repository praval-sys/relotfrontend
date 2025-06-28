// components/product/ProductDetails.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, ZoomIn, ChevronDown, ChevronUp, Truck, RotateCcw, Play, View, X } from 'lucide-react';
import { addItemToCart } from '../../redux/actions/cartActions';
import { addToCart } from '../../lib/cart';
import { addToWishlist } from '../../lib/wishlist';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';
import { AddWish } from '../../redux/reducer/wishSlice';


function ProductDetails({ product, addItem, AddWishh }) {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Zoom functionality states
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoomDialog, setShowZoomDialog] = useState(false);
  const [currentZoomImage, setCurrentZoomImage] = useState(null);
  
  const imageRef = useRef(null);
  const zoomRef = useRef(null);

  // Helper function to get media URL
  const getMediaUrl = (mediaItem) => {
    if (typeof mediaItem === 'string') return mediaItem;
    return mediaItem?.url || mediaItem;
  };

  // Combine all media from different sources
  const getAllMedia = () => {
    const allMedia = [];

    // Gallery images
    if (product.gallery?.images && Array.isArray(product.gallery.images)) {
      product.gallery.images.forEach(img => {
        allMedia.push({
          url: getMediaUrl(img),
          type: img.type || 'image',
          alt: img.alt || `${product.name} gallery image`,
          source: 'gallery'
        });
      });
    }

    // Gallery videos
    if (product.gallery?.videos && Array.isArray(product.gallery.videos)) {
      product.gallery.videos.forEach(video => {
        allMedia.push({
          url: getMediaUrl(video),
          type: 'video',
          alt: video.alt || `${product.name} video`,
          source: 'gallery'
        });
      });
    }

    // Gallery 3D models
    if (product.gallery?.models3D && Array.isArray(product.gallery.models3D)) {
      product.gallery.models3D.forEach(model => {
        allMedia.push({
          url: getMediaUrl(model),
          type: '3d_model',
          alt: model.alt || `${product.name} 3D model`,
          source: 'gallery'
        });
      });
    }

    // Remove duplicates based on URL
    const uniqueMedia = allMedia.filter((media, index, self) => 
      index === self.findIndex(m => m.url === media.url)
    );

    return uniqueMedia;
  };

  const allMedia = getAllMedia();

  // Initialize selected variant when product loads
  useEffect(() => {
    if (product.hasVariants && product.variants?.length > 0) {
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
      const variant = product.variants?.find(
        v => v.color === selectedColor && v.size === selectedSize && v.isActive
      );
      setSelectedVariant(variant);
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, product]);

  // Calculate final price with discount
  const finalPrice = selectedVariant
    ? (selectedVariant.price || product.price) * (1 - (product.discount || 0) / 100)
    : product.price * (1 - (product.discount || 0) / 100);

  // Get available stock
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Enhanced zoom functionality
  const handleMouseMove = (e) => {
    if (!imageRef.current || !isZooming) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculate percentage position for zoom
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;
    
    setZoomPosition({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => {
    const currentMedia = allMedia[selectedMedia];
    if (currentMedia?.type === 'image') {
      setIsZooming(true);
      setCurrentZoomImage(currentMedia);
    }
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setCurrentZoomImage(null);
  };

  // Toggle full screen zoom dialog
  const toggleZoomDialog = () => {
    const currentMedia = allMedia[selectedMedia];
    if (currentMedia?.type === 'image') {
      setCurrentZoomImage(currentMedia);
      setShowZoomDialog(!showZoomDialog);
    }
  };

  // ✅ Enhanced handleAddToCart with correct final price calculation
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    // ✅ FIXED: Calculate final price with discount
    const basePrice = selectedVariant?.price || product.price;
    const discount = product.discount || 0;
    const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

    // Create cart item object with final price
    const cartItem = {
      id: `${product._id}${selectedVariant?._id ? `-${selectedVariant._id}` : ''}`,
      product: product._id,
      productId: product._id,
      variantId: selectedVariant?._id,
      quantity: quantity,
      price: basePrice, // Keep original price for display
      finalPrice: finalPrice, // ✅ FIXED: Store calculated final price
      discount: product.discount,
      name: product.name,
      image: allMedia[0]?.url || '/placeholder.png',
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      sku: selectedVariant?.sku,
      category: product.category,
      brand: product.brand,
      inStock: availableStock > 0,
      maxQuantity: availableStock,
      addedAt: new Date().toISOString()
    };

    // API payload for logged-in users
    const cartData = {
      products: [cartItem]
    };

    try {
      const response = await addToCart(cartData);
      
      if (response.success) {
        addItem(response.data.items[0]);
        toast.success(response.message || "Added to cart!");
        return;
      }
    } catch (error) {
      console.error("Cart API error:", error);
      
      if (error.response?.status === 401) {
        toast.success("Added to cart! (Sign in to sync across devices)");
        addItem(cartItem);
        return;
      } else {
        toast.success("Added to cart! (Saved locally)");
        addItem(cartItem);
        return;
      }
    }
  };

  // ✅ Enhanced handleAddToWishlist with fallback for non-logged-in users
  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    // Create wishlist item object
    const wishlistItem = {
      id: `${product._id}${selectedVariant?._id ? `-${selectedVariant._id}` : ''}`,
      productId: product._id,
      variantId: selectedVariant?._id,
      // Additional product details for offline wishlist
      name: product.name,
      price: selectedVariant?.price || product.price,
      discount: product.discount,
      image: allMedia[0]?.url || '/placeholder.png',
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      sku: selectedVariant?.sku,
      category: product.category,
      brand: product.brand,
      inStock: availableStock > 0,
      addedAt: new Date().toISOString()
    };

    // API payload for logged-in users
    const wishlistData = {
      productId: product._id,
      variantId: selectedVariant?._id,
    };

    try {
      // Try to add to API wishlist (for logged-in users)
      const response = await addToWishlist(wishlistData);
      
      if (response.success) {
        // Success: Add to Redux state from API response
        AddWishh(response.data);
        toast.success(response.message || "Added to wishlist!");
        return;
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
      
      if (error.response?.status === 401) {
        // User not logged in - use Redux fallback
        toast.success("Added to wishlist! (Sign in to sync across devices)");
        AddWishh(wishlistItem);
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

      // Other API errors - use Redux fallback
      toast.success("Added to wishlist! (Saved locally)");
      AddWishh(wishlistItem);
      return;
    }
  };

  // Render media based on type
  const renderMedia = (media, className = "", showControls = false) => {
    switch (media.type) {
      case 'video':
        return (
          <div className={`relative ${className}`}>
            <video 
              src={media.url} 
              className="w-full h-full object-cover" 
              controls={showControls}
              muted
              poster="/video-placeholder.png"
            />
            {!showControls && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
        );
      case '3d_model':
        return (
          <div className={`relative ${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
            <div className="text-center">
              <View className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <span className="text-sm text-gray-600">3D Model</span>
            </div>
          </div>
        );
      default:
        return (
          <Image
            src={media.url}
            alt={media.alt}
            fill
            className={`object-cover ${className}`}
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Media Section with Zoom */}
          <div className="space-y-4">
            {/* Main Media Display with Zoom */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <div 
                ref={imageRef}
                className={`relative aspect-square ${
                  allMedia[selectedMedia]?.type === 'image' ? 'cursor-zoom-in' : 'cursor-default'
                }`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={toggleZoomDialog}
              >
                {allMedia.length > 0 ? (
                  renderMedia(allMedia[selectedMedia], "", allMedia[selectedMedia]?.type === 'video')
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
                
                {allMedia[selectedMedia]?.type === 'image' && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg">
                    <ZoomIn className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Zoom Lens Overlay */}
              {isZooming && currentZoomImage && (
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="absolute w-32 h-32 border-2 border-white shadow-lg rounded-full opacity-50"
                    style={{
                      left: `calc(${zoomPosition.x}% - 64px)`,
                      top: `calc(${zoomPosition.y}% - 64px)`,
                      background: 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Media Thumbnails */}
            {allMedia.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMedia(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedMedia === index 
                        ? 'border-red-500 ring-2 ring-red-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {renderMedia(media, "w-full h-full")}
                    
                    {/* Media type indicator */}
                    <div className="absolute bottom-1 right-1">
                      {media.type === 'video' && (
                        <div className="bg-black/70 text-white p-1 rounded text-xs">
                          <Play className="h-3 w-3" />
                        </div>
                      )}
                      {media.type === '3d_model' && (
                        <div className="bg-black/70 text-white p-1 rounded text-xs">
                          <View className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Media counter */}
            <div className="text-center text-sm text-gray-500">
              {selectedMedia + 1} of {allMedia.length} media
            </div>
          </div>

          {/* Zoom Preview Panel (Side Panel) */}
          {isZooming && currentZoomImage && (
            <div className="hidden lg:block fixed left-30 top-1/2 transform -translate-y-1/2 w-120 h-200 bg-white rounded-2xl shadow-2xl border-4 border-red-200 z-50 overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={currentZoomImage.url}
                  alt={currentZoomImage.alt}
                  fill
                  className="object-cover"
                  unoptimized
                  style={{
                    transform: `scale(2)`,
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  }}
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  Zoom View (2x)
                </div>
              </div>
            </div>
          )}
          
          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              {/* Brand and Category */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {product.brand && (
                  <span className="font-medium">Brand: <span className="text-gray-900">{product.brand}</span></span>
                )}
                {product.category && (
                  <span>Category: <span className="text-gray-900 capitalize">{product.category}</span></span>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
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
                <span className="text-sm text-gray-600">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-4 mb-2">
                <div className="text-3xl font-bold text-red-600">
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
              {product.comparePrice && product.comparePrice > finalPrice && (
                <p className="text-sm text-gray-500">
                  Compare at ₹{product.comparePrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Variant Selection */}
            {product.hasVariants && product.variants?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                {/* Color Selection */}
                {product.availableColors?.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">
                      Color: <span className="text-red-600">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                            selectedColor === color 
                              ? 'border-red-500 bg-red-50 text-red-600' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
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
                    <label className="text-sm font-medium text-gray-900">
                      Size: <span className="text-red-600">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                            selectedSize === size 
                              ? 'border-red-500 bg-red-50 text-red-600' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
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
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={handleAddToWishlist}
                disabled={product.hasVariants && !selectedVariant}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white border-2 border-red-300 font-semibold text-lg hover:border-red-400 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-red-600"
              >
                <Heart className="h-6 w-6" />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <Truck className="h-6 w-6 text-red-600" />
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

        {/* Enhanced Product Details Tabs */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: 'description', label: 'Description' },
                ...(product.features && product.features.length > 0 ? [{ key: 'features', label: 'Features' }] : []),
                ...(product.specifications && product.specifications.length > 0 ? [{ key: 'specifications', label: 'Specifications' }] : []),
                { key: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-8 py-4 text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Product Description</h3>
                
                {/* Detailed Description Sections */}
                {product.detailedDescription && product.detailedDescription.length > 0 ? (
                  <div className="space-y-6">
                    {product.detailedDescription
                      .sort((a, b) => a.order - b.order)
                      .map((section, index) => (
                        <div key={index} className="space-y-2">
                          {section.title && (
                            <h4 className="text-lg font-medium text-gray-800">{section.title}</h4>
                          )}
                          <div className={`text-gray-700 leading-relaxed ${
                            section.type === 'html' ? 'prose max-w-none' : ''
                          }`}>
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
                  <div className={`text-gray-700 leading-relaxed ${
                    !isDescriptionExpanded ? 'line-clamp-4' : ''
                  }`}>
                    <p>{product.description}</p>
                  </div>
                )}

                {!product.detailedDescription?.length && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
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
                )}
              </div>
            )}

            {activeTab === 'features' && product.features && product.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && product.specifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">{spec.name}:</span>
                      <span className="text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {product.averageRating || product.ratings || 0}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(product.averageRating || product.ratings || 0) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Based on {product.reviewCount || 0} reviews
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Zoom Dialog */}
      {showZoomDialog && currentZoomImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl max-w-5xl max-h-[95vh] overflow-hidden">
            <button
              onClick={() => setShowZoomDialog(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-[90vh]">
              <Image
                src={currentZoomImage.url}
                alt={currentZoomImage.alt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded">
              {currentZoomImage.alt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItemToCart(item)),
  AddWishh: (item) => dispatch(AddWish(item))
});

export default connect(null, mapDispatchToProps)(ProductDetails);