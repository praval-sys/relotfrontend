"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, X, Plus, Minus, Trash2, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateCartItemQuantity, removeItemFromCart } from "../../redux/actions/cartActions";
import { updateCartItem, removeCartItem } from "../../lib/cart";


export default function CartDialog() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter();
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false);

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

  const handleQuantityChange = async (item, change) => {
    const newQuantity = (item.quantity || 1) + change;
    if (newQuantity < 1) return;

    try {
      setLoading(true);
      // Update backend
      await updateCartItem(item._id, newQuantity);
      // Update Redux store
      dispatch(updateCartItemQuantity(item._id, newQuantity));
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setLoading(true);
      // Update backend
      await removeCartItem(itemId);
      // Update Redux store
      dispatch(removeItemFromCart(itemId));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
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

  const totalAmount = cartItems.reduce((sum, item) => 
    sum + (item.price * (item.quantity || 1)), 0
  );

  return (
    <div className="relative" ref={dialogRef}>
      {/* Cart Icon Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* Cart Dialog */}
      {isOpen && (
        <div className="absolute top-14 right-0 z-50 w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 stroke-1" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.image || item.images?.[0] || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={loading}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm">{item.quantity || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={loading}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={loading}
                          className="p-1 hover:bg-red-100 text-red-600 rounded ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleViewCart}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Eye className="h-4 w-4" />
                  View Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
