"use client";
import { useState, useEffect, useRef } from "react";
import { Heart, X, Loader, ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AddWish, RemoveWish, clearWish } from "../redux/reducer/wishSlice";
import { getWishlist, removeItem, clearWishlist, moveToCart } from "../lib/wishlist";
import Image from "next/image";
import toast from "react-hot-toast";

function WishlistDialog() {
  const wishList = useSelector((state) => state.wish.wishlist) || [];
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const dispatch = useDispatch();

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
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

  const handleRemoveItem = async (productId) => {
    try {
      setLoading(true);
      await removeItem(productId);
      // Use RemoveWish action instead of AddWish
      dispatch(RemoveWish(productId));
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

  const handleMoveToCart = async (productId) => {
    try {
      setLoading(true);
      await moveToCart(productId);
      // Use RemoveWish action to remove item from wishlist
      dispatch(RemoveWish(productId));
      toast.success("Item moved to cart");
    } catch (error) {
      toast.error("Failed to move item to cart");
      console.error("Move to cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dialogRef}>
      {/* Wishlist Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Heart className={`h-6 w-6 ${wishList.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
        {wishList.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {wishList.length}
          </span>
        )}
      </button>

      {/* Wishlist Dialog */}
      {isOpen && (
        <div className="absolute top-14 right-0 z-50 w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Wishlist</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {wishList.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <button
                    onClick={handleClearWishlist}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>
              )}

              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {wishList.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 stroke-1" />
                    <p>Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {wishList.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="relative w-20 h-20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{item.name}</h3>
                          <p className="text-sm text-gray-600">₹{item.price}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleMoveToCart(item.productId)}
                              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Move to Cart
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default WishlistDialog;
