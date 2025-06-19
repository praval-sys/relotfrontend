"use client";
import { useState, useEffect, useRef } from "react";
import { Heart, X, Loader, ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AddWish, RemoveWish, clearWish } from "../redux/reducer/wishSlice";
import { getWishlist, removeItem, clearWishlist, moveToCart } from "../lib/wishlist";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function WishlistDialog() {
  const wishList = useSelector((state) => state.wish.wishlist) || [];
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Fetch wishlist on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await getWishlist();
        if (response.success && response.data.items) {
          // Update Redux store with items array from the response
          dispatch(AddWish(response.data.items));
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [dispatch]);

  const handleRemoveItem = async (productId, variantId) => {
    try {
      setLoading(true);
      await removeItem(productId, variantId ? { variantId } : undefined);
      dispatch(RemoveWish({ productId, variantId }));
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
      console.error("Remove error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearWishlist = async () => {
    try {
      setLoading(true);
      await clearWishlist();
      dispatch(clearWish());
      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error("Failed to clear wishlist");
      console.error("Clear error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCart = async (productId, variantId) => {
    try {
      setLoading(true);
      await moveToCart(productId, {
        variantId,
        quantity: 1
      });
      dispatch(RemoveWish({ productId, variantId }));
      toast.success("Item moved to cart");
    } catch (error) {
      toast.error("Failed to move item to cart");
      console.error("Move to cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add navigation handler
  const handleProductClick = (productId) => {
    setIsOpen(false); // Close sidebar when navigating
    router.push(`/products/${productId}`);
  };

  // Calculate final price with discount
  const calculateFinalPrice = (price, discount) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
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
            ${wishList.length > 0 ? 'text-black' : 'text-gray-500'}`} 
        />
        {wishList.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Wishlist</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          {/* Clear All Button */}
          {wishList.length > 0 && (
            <div className="px-4 md:px-6 pb-4">
              <button
                onClick={handleClearWishlist}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-140px)] overflow-y-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader className="h-6 w-6 animate-spin text-gray-600" />
            </div>
          ) : wishList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
              <Heart className="h-12 w-12 mb-4 text-gray-400" />
              <p className="text-gray-600">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-4">
              {wishList.map((item) => {
                const finalPrice = calculateFinalPrice(item.price, item.discount);
                return (
                  <div
                    key={`${item.product}${item.variantId || ''}`}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 cursor-pointer"
                      onClick={() => handleProductClick(item.product)}
                    >
                      <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md hover:opacity-75 transition-opacity"
                        sizes="(max-width: 768px) 80px, 96px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base text-gray-900 truncate">
                        {item.name}
                      </h3>
                      
                      {/* Variant Details */}
                      {(item.color || item.size) && (
                        <div className="mt-1 space-x-2 text-sm text-gray-500">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      )}

                      {/* Price Display */}
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm md:text-base font-medium text-gray-900">
                          ₹{finalPrice}
                        </span>
                        {item.discount > 0 && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.price.toFixed(2)}
                            </span>
                            <span className="text-xs text-green-600 font-medium">
                              {item.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* SKU Display */}
                      {item.sku && (
                        <p className="mt-1 text-xs text-gray-500">
                          SKU: {item.sku}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-3">
                        <button
                          onClick={() => handleMoveToCart(item.product, item.variantId)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm text-gray-700 hover:text-gray-900 bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Move to Cart
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.product, item.variantId)}
                          className="px-3 py-1.5 text-xs md:text-sm text-red-600 hover:text-red-700 bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
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
      </div>
    </>
  );
}

export default WishlistDialog;
