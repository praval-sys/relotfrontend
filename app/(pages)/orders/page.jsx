"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserOrders, cancelOrder } from '../../lib/orders';
import { Package, ChevronRight, Loader2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  shipped: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  delivered: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getUserOrders(page);
      
      // Handle the new response structure
      if (response.success) {
        setOrders(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh orders list
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  const handleViewOrder = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  // Format delivery status for display
  const formatDeliveryStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Get proper image URL
  const getItemImage = (item) => {
    return item.image || '/placeholder.png';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="lining-nums container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">You haven't placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-red-300 transition-colors"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-900 text-sm">
                          #{order._id.slice(-8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium self-start md:self-center ${ORDER_STATUS_COLORS[order.deliveryStatus] || 'bg-gray-100 text-gray-800'}`}>
                      {formatDeliveryStatus(order.deliveryStatus)}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Payment: <span className="font-medium text-gray-700 capitalize">{order.paymentMethod}</span>
                      {order.paymentStatus && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          order.paymentStatus === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 space-y-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item._id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={getItemImage(item)}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="64px"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            {item.finalPrice ? (
                              <span>₹{item.finalPrice.toLocaleString()} each</span>
                            ) : (
                              <span>₹{item.price.toLocaleString()} each</span>
                            )}
                          </div>
                          {/* Variant Info */}
                          {(item.color || item.size) && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span>Size: {item.size}</span>}
                            </div>
                          )}
                        </div>
                        {/* Discount Info */}
                        {item.discount > 0 && (
                          <div className="text-right">
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                              {item.discount}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500 pl-20">
                        +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Shipping Address Preview */}
                  {order.shippingAddress && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.shippingAddress.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {(order.deliveryStatus === 'PENDING' || order.deliveryStatus === 'pending') && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 text-sm rounded-md transition-colors
                  ${page === i + 1 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}