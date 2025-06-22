"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, X, Plus, Minus, Trash2, Eye ,Loader} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { setCartItems, setCartTotal, updateCartItemQuantity, removeItemFromCart } from "../../redux/actions/cartActions";
import { getCart, updateCartItem, removeCartItem } from "../../lib/cart";


export default function CartDialog() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  // Assuming your Redux state structure is state.cart.items and state.cart.totalPrice
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalPrice); // Use the total from state
  const router = useRouter();
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Fetch cart data on mount
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const response = await getCart();
        if (response.success && response.data) {
          dispatch(setCartItems(response.data.items));
          dispatch(setCartTotal(response.data.totalPrice));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          // User not authenticated - keep local cart state or clear if preferred
          // For now, we'll just log the error and not clear the state
          console.warn("User not authenticated, cannot fetch server cart.");
        } else {
          console.error("Failed to fetch cart:", error);
          toast.error("Failed to load cart");
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is likely logged in or you want to handle anonymous carts
    // You might add a check here if you have user authentication state in Redux
    fetchCartData();
  }, [dispatch]); // Added dispatch to dependency array

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

  // Function to get a unique identifier for an item (product + variant)
  const getItemIdentifier = (item) => {
    // Use item.product._id if populated, otherwise item.product
    const productId = item.product?._id || item.product;
    return { productId, variantId: item.variantId };
  };

  const handleQuantityChange = async (item, change) => {
    const newQuantity = (item.quantity || 1) + change;
    if (newQuantity < 1) return;

    const itemIdentifier = getItemIdentifier(item);

    try {
      setLoading(true);
      // Pass variantId to the API call
      const response = await updateCartItem(itemIdentifier.productId, newQuantity, itemIdentifier.variantId);
      if (response.success) {
        // Backend response should contain the updated cart
        dispatch(setCartItems(response.data.items));
        dispatch(setCartTotal(response.data.totalPrice));
        toast.success("Quantity updated");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // User is not logged in - just update Redux state locally
        dispatch(updateCartItemQuantity(itemIdentifier, newQuantity));
        toast.success("Quantity updated locally");
      } else {
        toast.error(error.response?.data?.message || "Failed to update quantity");
        console.error("Cart error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (item) => {
    const itemIdentifier = getItemIdentifier(item);

    try {
      setLoading(true);
      // Pass variantId to the API call
      const response = await removeCartItem(itemIdentifier.productId, itemIdentifier.variantId);
      if (response.success) {
        // Backend response should contain the updated cart
        dispatch(setCartItems(response.data.items));
        dispatch(setCartTotal(response.data.totalPrice));
        toast.success("Item removed from cart");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // User is not logged in - just update Redux state locally
        dispatch(removeItemFromCart(itemIdentifier));
        toast.success("Item removed locally");
      } else {
        toast.error(error.response?.data?.message || "Failed to remove item");
        console.error("Cart error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    setIsOpen(false);
    router.push("/viewcart");
  };

  // Add navigation handler
  const handleProductClick = (item) => {
    setIsOpen(false); // Close sidebar when navigating
    // Use item.product._id if populated, otherwise item.product
    const productId = item.product?._id || item.product;
    router.push(`/products/${productId}`);
  };

  // Calculate total savings based on price and finalPrice
  const totalSavings = cartItems.reduce((sum, item) =>
    sum + ((item.price - (item.finalPrice || item.price)) * (item.quantity || 1)), 0
  );


  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center p-2 hover:bg-gray-50 rounded-full transition-colors"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-black" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>
        {/* Display total price from Redux state */}
        {cartItems.length > 0 && (
          <span className="ml-2 text-black font-semibold text-sm md:text-base">
            ₹{totalAmount.toFixed(2)}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Cart */}
      <div
        ref={dialogRef}
        className={`fixed top-0 right-0 h-screen bg-white shadow-xl z-[60] transform transition-transform duration-300 ease-in-out
          w-full sm:w-[400px] md:w-[450px] lg:w-[500px]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex items-center justify-between p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="h-[calc(100vh-180px)] overflow-y-auto">
          {loading ? (
             <div className="h-full flex items-center justify-center">
              <Loader className="h-6 w-6 animate-spin text-gray-600" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
              <ShoppingCart className="h-12 w-12 mb-4 text-gray-400" />
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  // Use product ID and variant ID for a unique key
                  key={`${item.product._id || item.product}-${item.variantId || 'no-variant'}`}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Update image container with click handler */}
                  <div
                    className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 cursor-pointer"
                    onClick={() => handleProductClick(item)}
                  >
                    <Image
                      src={item.image || item.images?.[0] || '/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md hover:opacity-75 transition-opacity"
                      sizes="(max-width: 768px) 80px, 96px"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm md:text-base text-gray-900 truncate">
                      {item.name}
                    </h3>

                    {/* Variant Details (Color, Size, SKU) */}
                    {(item.color || item.size || item.sku) && (
                       <div className="mt-1 space-x-2 text-sm text-gray-500">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                          {item.sku && <span>SKU: {item.sku}</span>}
                       </div>
                    )}

                    {/* Price Display with Discount */}
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          ₹{(item.finalPrice || item.price).toFixed(2)}
                        </p>
                        {item.discount > 0 && (
                          <>
                            <p className="text-sm text-gray-500 line-through">
                              ₹{item.price.toFixed(2)}
                            </p>
                            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
                              {item.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-white rounded-full border border-gray-200">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={loading || (item.quantity || 1) <= 1}
                          className="p-1.5 hover:bg-gray-50 text-gray-500 rounded-l-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                        <span className="w-8 text-center text-sm md:text-base text-gray-900">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={loading} // You might want to add stock check here
                          className="p-1.5 hover:bg-gray-50 text-gray-500 rounded-r-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        disabled={loading}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Total Savings:</span>
                  <span>
                    ₹{totalSavings.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-base md:text-lg font-medium text-gray-900">Total:</span>
                <span className="text-base md:text-lg font-semibold text-gray-900">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Existing action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleViewCart}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm md:text-base text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="h-4 w-4 md:h-5 md:w-5" />
                View Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || loading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm md:text-base text-white bg-black rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
