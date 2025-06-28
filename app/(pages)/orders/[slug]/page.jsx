"use client";
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { getOrderById } from '../../../lib/orders';
import { PackageCheck, Truck, CheckCircle2, Clock, AlertCircle, Download } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import api from '../../../lib/api';

const STATUS_STYLES = {
  pending: { icon: Clock, className: 'text-yellow-600 bg-yellow-50' },
  processing: { icon: Truck, className: 'text-blue-600 bg-blue-50' },
  shipped: { icon: PackageCheck, className: 'text-purple-600 bg-purple-50' },
  delivered: { icon: CheckCircle2, className: 'text-green-600 bg-green-50' },
  cancelled: { icon: AlertCircle, className: 'text-red-600 bg-red-50' }
};

export default function OrderPage({ params }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const orderId = resolvedParams.slug;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        if (orderData.success) {
          setOrder(orderData.data);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (error) {
        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/v1/user/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  };

  // Get proper image URL
  const getItemImage = (item) => {
    return item.image || '/placeholder.png';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  const StatusIcon = STATUS_STYLES[order.deliveryStatus.toLowerCase()]?.icon || PackageCheck;
  const statusClassName = STATUS_STYLES[order.deliveryStatus.toLowerCase()]?.className || 'text-gray-600 bg-gray-50';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Order Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-500 mt-1">Order ID: #{order._id.slice(-8)}</p>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
              >
                <Download className="h-4 w-4" />
                <span>Download Invoice</span>
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusClassName}`}>
                <StatusIcon className="h-5 w-5" />
                <span className="text-sm font-medium capitalize">{order.deliveryStatus}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {order.items.map((item) => (
                <div 
                  key={item._id || item.id}
                  className="flex gap-4 p-4 border-b last:border-b-0 border-gray-100"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={getItemImage(item)}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="80px"
                      unoptimized
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    
                    {/* Variant Info */}
                    {(item.color || item.size || item.sku) && (
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                        {item.sku && <span>SKU: {item.sku}</span>}
                      </div>
                    )}
                    
                    {/* Price Info */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{item.finalPrice ? item.finalPrice.toLocaleString() : item.price.toLocaleString()} each
                        </p>
                        {item.discount > 0 && item.finalPrice && (
                          <>
                            <p className="text-sm text-gray-500 line-through">₹{item.price.toLocaleString()}</p>
                            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
                              {item.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Total: ₹{((item.finalPrice || item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`font-medium capitalize px-2 py-1 rounded-full text-xs ${
                    order.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                {/* Price Breakdown */}
                <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">
                      ₹{order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}
                    </span>
                  </div>
                  
                  {order.items.some(item => item.discount > 0 && item.finalPrice) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-red-600">
                        -₹{order.items.reduce((acc, item) => {
                          if (item.discount > 0 && item.finalPrice) {
                            return acc + ((item.price - item.finalPrice) * item.quantity);
                          }
                          return acc;
                        }, 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-100">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress.street}</p>
                <p className="text-sm text-gray-500">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-sm text-gray-500">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        {(order.transactionId || order.razorpayPaymentId) && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Transaction Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {(order.transactionId || order.razorpayPaymentId) && (
                <div>
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="ml-2 text-gray-900 font-mono text-xs">
                    {order.transactionId || order.razorpayPaymentId}
                  </span>
                </div>
              )}
              {order.razorpayOrderId && (
                <div>
                  <span className="text-gray-500">Razorpay Order ID:</span>
                  <span className="ml-2 text-gray-900 font-mono text-xs">{order.razorpayOrderId}</span>
                </div>
              )}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}