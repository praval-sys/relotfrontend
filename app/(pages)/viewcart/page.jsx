'use client';
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import QuantityDial from '../../components/Cart/QuantityDial';
import { updateCartItemQuantity } from "../../redux/actions/cartActions";

export default function ViewCart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Responsive: Hide address logic, only cart items and summary
  const handleQuantityChange = (itemId, quantity) => {
    dispatch(updateCartItemQuantity(itemId, quantity));
  };

  // Use finalPrice if present, else calculate from price and discount
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.finalPrice ?? (item.price * (1 - (item.discount || 0) / 100));
      return total + price * item.quantity;
    }, 0);
  };

  const calculateTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.discount) {
        const savings = (item.price - (item.finalPrice ?? (item.price * (1 - item.discount / 100)))) * item.quantity;
        return total + savings;
      }
      return total;
    }, 0);
  };

  const deliveryCharges = 5.99;
  const processingFee = 2.99;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryCharges + processingFee;
  const totalSavings = calculateTotalSavings();

  const handlePlaceOrder = async () => {
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="text-lg text-gray-600">Your cart is currently empty.</p>
        <button 
          onClick={() => router.push('/products')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const hasDiscount = !!item.discount;
              const finalPrice = item.finalPrice ?? (item.price * (1 - (item.discount || 0) / 100));
              return (
                <div key={item._id} className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4 border rounded-lg bg-white shadow-sm">
                  <div className="relative w-24 h-24 mx-auto sm:mx-0 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{item.name}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">Product ID: {item._id}</p>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-black">
                          ₹{finalPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-gray-400 line-through text-sm">
                              ₹{item.price.toFixed(2)}
                            </span>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                              {item.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <QuantityDial
                        quantity={item.quantity}
                        onIncrease={() => handleQuantityChange(item._id, item.quantity + 1)}
                        onDecrease={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-full sm:w-auto"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 w-full">
          <div className="border rounded-lg p-4 sticky top-4 bg-white shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Charges</span>
                <span>₹{deliveryCharges}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee</span>
                <span>₹{processingFee}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-sm text-green-700 font-medium">
                  <span>Total Savings</span>
                  <span>-₹{totalSavings.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 font-semibold flex justify-between text-base">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors text-base font-semibold"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}