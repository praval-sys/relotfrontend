"use client";
import { useState, useEffect, useRef } from "react";
import { Heart, X, Loader, ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AddWish, RemoveWish, clearWish } from "../redux/reducer/wishSlice";
import { addItemToCart } from "../redux/actions/cartActions";
import { getWishlist, removeItem, clearWishlist, moveToCart } from "../lib/wishlist";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function WishlistDialog() {
  const wishList = useSelector((state) => state.wish.wishlist) || [];
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncingWithAPI, setSyncingWithAPI] = useState(false);
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ✅ Enhanced: Fetch wishlist with fallback support
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setSyncingWithAPI(true);
        const response = await getWishlist();
        
        if (response.success && response.data.items) {
          // Success: Update Redux store with API data
          dispatch(clearWish()); // Clear existing items
          response.data.items.forEach(item => {
            dispatch(AddWish(item));
          });
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        
        if (error.response?.status === 401) {
          // User not logged in - keep using Redux state
          console.log("User not logged in, using local wishlist");
        } else {
          // Other API errors - keep using Redux state
          console.log("API error, using local wishlist");
        }
      } finally {
        setSyncingWithAPI(false);
      }
    };

    fetchWishlist();
  }, [dispatch]);

  // ✅ Enhanced: Remove item with fallback support
  const handleRemoveItem = async (productId, variantId) => {
    try {
      setLoading(true);
      
      // Try to remove from API first
      await removeItem(productId, variantId ? { variantId } : undefined);
      
      // Success: Remove from Redux state
      dispatch(RemoveWish({ productId, variantId }));
      toast.success("Item removed from wishlist");
      
    } catch (error) {
      console.error("Remove error:", error);
      
      if (error.response?.status === 401) {
        // User not logged in - remove from Redux only
        dispatch(RemoveWish({ productId, variantId }));
        toast.success("Item removed from wishlist (Sign in to sync across devices)");
      } else if (error.response?.status === 404) {
        // Item not found in API - remove from Redux anyway
        dispatch(RemoveWish({ productId, variantId }));
        toast.success("Item removed from wishlist");
      } else {
        // Other API errors - still remove from Redux (local fallback)
        dispatch(RemoveWish({ productId, variantId }));
        toast.success("Item removed from wishlist (Saved locally)");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced: Clear wishlist with fallback support
  const handleClearWishlist = async () => {
    try {
      setLoading(true);
      
      // Try to clear API wishlist first
      await clearWishlist();
      
      // Success: Clear Redux state
      dispatch(clearWish());
      toast.success("Wishlist cleared");
      
    } catch (error) {
      console.error("Clear error:", error);
      
      if (error.response?.status === 401) {
        // User not logged in - clear Redux only
        dispatch(clearWish());
        toast.success("Wishlist cleared (Sign in to sync across devices)");
      } else {
        // Other API errors - still clear Redux (local fallback)
        dispatch(clearWish());
        toast.success("Wishlist cleared (Saved locally)");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced: Move to cart with correct final price calculation
  const handleMoveToCart = async (item) => {
    try {
      setLoading(true);
      
      const productId = item.product?._id || item.product;
      const variantId = item.variantId;

      // ✅ FIXED: Calculate final price with discount
      const basePrice = item.price || 0;
      const discount = item.discount || 0;
      const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

      // Create cart item from wishlist item with final price
      const cartItem = {
        id: `${productId}${variantId ? `-${variantId}` : ''}`,
        product: productId,
        productId: productId,
        variantId: variantId,
        quantity: 1,
        price: basePrice, // Keep original price for display
        finalPrice: finalPrice, // ✅ FIXED: Store calculated final price
        discount: item.discount || 0,
        name: item.name,
        image: item.image || '/placeholder.png',
        color: item.color,
        size: item.size,
        sku: item.sku,
        category: item.category,
        brand: item.brand,
        inStock: item.inStock !== false,
        maxQuantity: item.maxQuantity || 999,
        addedAt: new Date().toISOString()
      };

      try {
        await moveToCart(productId, {
          variantId,
          quantity: 1
        });
        
        dispatch(addItemToCart(cartItem));
        dispatch(RemoveWish({ productId, variantId }));
        toast.success("Item moved to cart");
        
      } catch (moveError) {
        console.error("Move to cart API error:", moveError);
        
        if (moveError.response?.status === 401) {
          dispatch(addItemToCart(cartItem));
          dispatch(RemoveWish({ productId, variantId }));
          toast.success("Item moved to cart (Sign in to sync across devices)");
        } else {
          dispatch(addItemToCart(cartItem));
          dispatch(RemoveWish({ productId, variantId }));
          toast.success("Item moved to cart (Saved locally)");
        }
      }
      
    } catch (error) {
      console.error("Move to cart error:", error);
      toast.error("Failed to move item to cart");
    } finally {
      setLoading(false);
    }
  };

  // Add navigation handler
  const handleProductClick = (item) => {
    const productId = item.product?._id || item.productId || item.product;
    setIsOpen(false);
    router.push(`/products/${productId}`);
  };

  // Calculate final price with discount
  const getFinalPrice = (item) => {
    if (item.finalPrice) return item.finalPrice;
    if (item.discount && item.discount > 0) {
      return item.price * (1 - item.discount / 100);
    }
    return item.price;
  };

  return (
    <>
      {/* Wishlist Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
      >
        <Heart 
          className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 
            ${wishList.length > 0 ? 'text-red-600 fill-red-600' : 'text-gray-500'}`} 
        />
        {wishList.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {wishList.length}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-[60] transform transition-transform duration-300 ease-in-out
          w-full sm:w-[400px] md:w-[450px] lg:w-[500px]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Wishlist</h2>
              {syncingWithAPI && (
                <Loader className="h-4 w-4 animate-spin text-red-600" />
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          {/* Clear All Button & Item Count */}
          {wishList.length > 0 && (
            <div className="px-4 md:px-6 pb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {wishList.length} {wishList.length === 1 ? 'item' : 'items'}
              </span>
              <button
                onClick={handleClearWishlist}
                disabled={loading}
                className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-140px)] overflow-y-auto">
          {loading && !syncingWithAPI ? (
            <div className="h-full flex items-center justify-center">
              <Loader className="h-6 w-6 animate-spin text-red-600" />
            </div>
          ) : wishList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
              <Heart className="h-16 w-16 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-sm text-gray-500 mb-4">Save items you love to see them here</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/products');
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-4">
              {wishList.map((item) => {
                const productId = item.product?._id || item.productId || item.product;
                const finalPrice = getFinalPrice(item);
                
                return (
                  <div
                    key={`${productId}${item.variantId || ''}`}
                    className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div 
                      className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 cursor-pointer group"
                      onClick={() => handleProductClick(item)}
                    >
                      <Image
                        src={item.image || item.images?.[0] || '/placeholder.png'}
                        alt={item.name || 'Product image'}
                        fill
                        className="object-cover rounded-md group-hover:opacity-75 transition-opacity"
                        sizes="(max-width: 768px) 80px, 96px"
                        unoptimized
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-md transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-medium text-sm md:text-base text-gray-900 truncate cursor-pointer hover:text-red-600 transition-colors leading-tight"
                        onClick={() => handleProductClick(item)}
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      
                      {/* Brand */}
                      {item.brand && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.brand}
                        </p>
                      )}
                      
                      {/* Variant Details */}
                      {(item.color || item.size) && (
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                          {item.color && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price Display */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm md:text-base font-semibold text-gray-900">
                          ₹{finalPrice?.toLocaleString()}
                        </span>
                        {item.discount > 0 && finalPrice < item.price && (
                          <>
                            <span className="text-xs text-gray-500 line-through">
                              ₹{item.price?.toLocaleString()}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                              {item.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mt-2">
                        {item.inStock === false ? (
                          <span className="inline-flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                            Out of Stock
                          </span>
                        ) : item.lowStock ? (
                          <span className="inline-flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mr-1"></span>
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            In Stock
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          disabled={loading || item.inStock === false}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors font-medium"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {item.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => handleRemoveItem(productId, item.variantId)}
                          disabled={loading}
                          className="px-3 py-1.5 text-xs md:text-sm text-red-600 hover:text-red-700 bg-white rounded-md border border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Quick Actions */}
        {wishList.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:p-6">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/products');
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  // Move all in-stock items to cart
                  wishList.filter(item => item.inStock !== false).forEach(item => {
                    handleMoveToCart(item);
                  });
                }}
                disabled={loading || wishList.every(item => item.inStock === false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WishlistDialog;
