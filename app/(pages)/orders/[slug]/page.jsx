import Image from 'next/image';
import { getOrderById } from '../../../lib/orders';
import { PackageCheck, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const STATUS_STYLES = {
  pending: { icon: Clock, className: 'text-yellow-600 bg-yellow-50' },
  processing: { icon: Truck, className: 'text-blue-600 bg-blue-50' },
  delivered: { icon: CheckCircle2, className: 'text-green-600 bg-green-50' },
  cancelled: { icon: AlertCircle, className: 'text-red-600 bg-red-50' }
};

export default async function OrderPage({ params }) {
  const resolvedParams = await params;
  const orderData = await getOrderById(resolvedParams.slug);
  const order = orderData.data;

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
              <p className="text-sm text-gray-500 mt-1">Order ID: {order._id}</p>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusClassName}`}>
              <StatusIcon className="h-5 w-5" />
              <span className="text-sm font-medium capitalize">{order.deliveryStatus}</span>
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
                  key={item._id}
                  className="flex gap-4 p-4 border-b last:border-b-0 border-gray-100"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="font-medium text-gray-900 capitalize">{order.paymentStatus}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">₹{order.totalAmount}</span>
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
        {order.transactionId && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Transaction Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Transaction ID:</span>
                <span className="ml-2 text-gray-900">{order.transactionId}</span>
              </div>
              <div>
                <span className="text-gray-500">Razorpay Order ID:</span>
                <span className="ml-2 text-gray-900">{order.razorpayOrderId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}