"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getWishlist, removeItem, clearWishlist, moveToCart } from "../../lib/wishlist";
import { RemoveWish, clearWish } from "../../redux/reducer/wishSlice";
import { ShoppingCart, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wish.wishlist);
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleRemoveItem = async (productId) => {
    try {
      setLoading(true);
      await removeItem(productId);
      dispatch(RemoveWish(productId));
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
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
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      setLoading(true);
      await moveToCart(productId);
      dispatch(RemoveWish(productId));
      toast.success("Item moved to cart");
    } catch (error) {
      toast.error("Failed to move item to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              disabled={loading}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Product Image */}
                <div 
                  className="relative w-24 h-24 flex-shrink-0 cursor-pointer"
                  onClick={() => handleProductClick(item.productId)}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md hover:opacity-75 transition-opacity"
                    sizes="(max-width: 768px) 96px, 96px"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-medium text-gray-900 hover:text-black cursor-pointer"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-gray-700 mt-1">₹{item.price}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleMoveToCart(item.productId)}
                      disabled={loading}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 bg-gray-50 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={loading}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 bg-red-50 rounded-full border border-red-100 hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
