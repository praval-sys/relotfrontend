'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, ZoomIn, Play, View, ChevronLeft, ChevronRight } from 'lucide-react';
import { addItemToCart } from '../../redux/actions/cartActions';
import { addToCart } from '../../lib/cart';
import { addToWishlist } from '../../lib/wishlist';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';
import { AddWish } from '../../redux/reducer/wishSlice';

function ProductImageGallery({ product, selectedVariant, quantity, addItem, AddWishh }) {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const imageRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          type: 'image', // Force type to image for gallery images
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

    return uniqueMedia.length > 0 ? uniqueMedia : [{ url: '/placeholder-product.jpg', type: 'image', alt: product.name }];
  };

  const allMedia = getAllMedia();
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

  // ✅ ENHANCED: Check if current media is an image
  const isCurrentMediaImage = () => {
    const currentMedia = allMedia[selectedMedia];
    return currentMedia && currentMedia.type === 'image';
  };

  // ✅ ENHANCED: Zoom functionality - only works for images
  const handleMouseMove = (e) => {
    if (!imageRef.current || !isZooming || isMobile || !isCurrentMediaImage()) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculate percentage position for zoom
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;
    
    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, xPercent));
    const clampedY = Math.max(0, Math.min(100, yPercent));
    
    setZoomPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    if (isCurrentMediaImage() && !isMobile) {
      setIsZooming(true);
    }
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  // Navigation functions
  const goToPrevious = () => {
    setSelectedMedia((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const goToNext = () => {
    setSelectedMedia((prev) => (prev + 1) % allMedia.length);
  };

  // Calculate final price with discount
  const getFinalPrice = () => {
    if (product.finalPrice) return product.finalPrice;
    const basePrice = selectedVariant?.price || product.price;
    const discount = product.discount || 0;
    return discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
  };

  const finalPrice = getFinalPrice();

  // ✅ Enhanced handleAddToCart with correct final price calculation
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      setIsLoading(false);
      return;
    }

    const basePrice = selectedVariant?.price || product.price;
    const cartItem = {
      id: `${product._id}${selectedVariant?._id ? `-${selectedVariant._id}` : ''}`,
      product: product._id,
      productId: product._id,
      variantId: selectedVariant?._id,
      quantity: quantity,
      price: basePrice,
      finalPrice: finalPrice,
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

    const cartData = { products: [cartItem] };

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
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Enhanced handleAddToWishlist with fallback for non-logged-in users
  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    setWishlistLoading(true);
    
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      setWishlistLoading(false);
      return;
    }

    const wishlistItem = {
      id: `${product._id}${selectedVariant?._id ? `-${selectedVariant._id}` : ''}`,
      productId: product._id,
      variantId: selectedVariant?._id,
      name: product.name,
      price: selectedVariant?.price || product.price,
      discount: product.discount,
      finalPrice: finalPrice,
      image: allMedia[0]?.url || '/placeholder.png',
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      sku: selectedVariant?.sku,
      category: product.category,
      brand: product.brand,
      inStock: availableStock > 0,
      addedAt: new Date().toISOString()
    };

    const wishlistData = {
      productId: product._id,
      variantId: selectedVariant?._id,
    };

    try {
      const response = await addToWishlist(wishlistData);
      if (response.success) {
        AddWishh(response.data);
        toast.success(response.message || "Added to wishlist!");
        return;
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
      if (error.response?.status === 401) {
        toast.success("Added to wishlist! (Sign in to sync across devices)");
        AddWishh(wishlistItem);
        return;
      } else if (error.response?.status === 400) {
        if (error.response.data?.message.includes("already in wishlist")) {
          toast.error("Item is already in your wishlist!");
        } else {
          toast.error(error.response.data?.message || "Failed to add to wishlist");
        }
        return;
      } else {
        toast.success("Added to wishlist! (Saved locally)");
        AddWishh(wishlistItem);
        return;
      }
    } finally {
      setWishlistLoading(false);
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
              className="w-full h-full object-contain" 
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
            className={`object-contain ${className}`}
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
          />
        );
    }
  };

  return (
    <div className="lg:sticky lg:top-8 space-y-6 w-full">
      {/* Gallery Layout */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Thumbnails */}
          {allMedia.length > 1 && (
            <div className="order-2 lg:order-1 flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[700px] pb-2 lg:pb-0 lg:w-32 flex-shrink-0">
              {allMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia(index)}
                  className={`relative flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-lg overflow-hidden border-2 transition-all ${
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

          {/* Main Image */}
          <div className="order-1 lg:order-2 flex-1 w-full">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square w-full max-w-[400px] mx-auto lg:max-w-none">
              <div 
                ref={imageRef}
                className={`relative w-full h-full bg-white ${
                  isCurrentMediaImage() && !isMobile ? 'cursor-zoom-in' : 'cursor-default'
                }`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* ✅ Image renders at full width/height with object-contain to maintain aspect ratio */}
                <div className="relative w-full h-full">
                  {renderMedia(allMedia[selectedMedia], "w-full h-full", allMedia[selectedMedia]?.type === 'video')}
                </div>
                
                {/* Navigation Arrows */}
                {allMedia.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* ✅ Zoom Icon (Desktop only and only for images) */}
                {isCurrentMediaImage() && !isMobile && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-lg z-10">
                    <ZoomIn className="h-6 w-6" />
                  </div>
                )}

                {/* Media counter */}
                {allMedia.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                    {selectedMedia + 1} / {allMedia.length}
                  </div>
                )}

                {/* ✅ ENHANCED: Zoom lens indicator on original image (only for images) */}
                {isZooming && !isMobile && isCurrentMediaImage() && (
                  <div 
                    className="absolute border-2 border-red-400 bg-white/20 pointer-events-none z-20 rounded-lg"
                    style={{
                      width: '150px',
                      height: '150px',
                      left: `calc(${zoomPosition.x}% - 75px)`,
                      top: `calc(${zoomPosition.y}% - 75px)`,
                      boxShadow: '0 0 0 3000px rgba(0,0,0,0.4)'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Preview: Only on large screens */}
      {isZooming && !isMobile && isCurrentMediaImage() && (
        <div 
          className="hidden lg:block fixed z-50 w-[400px] h-[500px] border-4 border-red-200 rounded-xl shadow-2xl bg-white overflow-hidden pointer-events-none"
          style={{
            zIndex: 9999,
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {/* ✅ Zoomed image with higher magnification */}
          <Image
            src={allMedia[selectedMedia].url}
            alt={allMedia[selectedMedia].alt}
            fill
            className="object-cover"
            unoptimized
            style={{
              transform: `scale(3)`,
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            }}
          />
          
          {/* ✅ Enhanced zoom indicator */}
          <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium">
            Zoom 3x
          </div>
          
          {/* ✅ Position indicator */}
          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded text-xs">
            {Math.round(zoomPosition.x)}%, {Math.round(zoomPosition.y)}%
          </div>
          
          {/* ✅ Mini preview showing zoomed area on original image */}
          <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded bg-black/50 overflow-hidden">
            <Image
              src={allMedia[selectedMedia].url}
              alt="Preview"
              fill
              className="object-cover opacity-60"
              unoptimized
            />
            {/* Red dot showing zoom position */}
            <div 
              className="absolute w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${zoomPosition.x}%`,
                top: `${zoomPosition.y}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={handleAddToCart}
          disabled={availableStock <= 0 || (product.hasVariants && !selectedVariant) || isLoading}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-5 rounded-xl text-white font-semibold text-base sm:text-lg transition-all transform hover:scale-105 ${
            availableStock > 0 && (!product.hasVariants || selectedVariant) && !isLoading
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
          <span className="text-base sm:text-lg font-semibold">
            {availableStock <= 0 
              ? "Out of Stock" 
              : isLoading 
              ? "Adding..." 
              : "Add to Cart"
            }
          </span>
        </button>
        
        <button
          onClick={handleAddToWishlist}
          disabled={(product.hasVariants && !selectedVariant) || wishlistLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-5 rounded-xl bg-white border-2 border-red-300 font-semibold text-base sm:text-lg hover:border-red-400 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-red-600"
        >
          {wishlistLoading ? (
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
          <span className="text-base sm:text-lg font-semibold">
            {wishlistLoading ? "Adding..." : "Add to Wishlist"}
          </span>
        </button>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItemToCart(item)),
  AddWishh: (item) => dispatch(AddWish(item))
});

export default connect(null, mapDispatchToProps)(ProductImageGallery);