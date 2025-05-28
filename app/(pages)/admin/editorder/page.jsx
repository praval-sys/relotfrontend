"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const OrderDetailsPage = () => {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState();

  useEffect(() => {
    const orderParam = searchParams.get("order");
    debugger;
    if (orderParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(orderParam));
        setOrder({
          ...decoded,
          images: Array.isArray(decoded.images)
            ? decoded.images
            : [decoded.images],
        });
      } catch (error) {
        console.error("Error decoding order:", error);
      }
    }
  }, [searchParams]);

  const handleChange = (e) => {
    if (!order) return;
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Fields:", {
      deliveryStatus: order.deliveryStatus,
      paymentStatus: order.paymentStatus,
      transactionId: order.transactionId,
    });
    // Optionally send to backend
  };

  if (!order) return <p>Loading order data...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p>
          <span className="font-semibold">User ID:</span> {order.user}
        </p>
        <p>
          <span className="font-semibold">Order ID:</span> {order._id}
        </p>
        <p>
          <span className="font-semibold">Created:</span>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Updated:</span>{" "}
          {new Date(order.updatedAt).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Total Amount:</span> $
          {order.totalAmount}
        </p>
        <p>
          <span className="font-semibold">Payment Method:</span>{" "}
          {order.paymentMethod}
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <ul className="list-disc list-inside">
          {order.shippingAddress &&
            Object.entries(order.shippingAddress).map(([key, val]) => (
              <li key={key}>
                <span className="capitalize font-medium">{key}</span>: {val}
              </li>
            ))}
        </ul>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        <ul className="space-y-2">
          {order.items?.map((item) => (
            <li key={item._id}>
              <span className="font-medium">Product:</span> {item.product} —
              <span className="font-medium"> Qty:</span> {item.quantity} —
              <span className="font-medium"> Price:</span> ${item.price}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Editable Fields</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Status
            </label>
            <select
              name="deliveryStatus"
              value={order.deliveryStatus}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="shipped">Shipped</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              value={order.paymentStatus}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID
            </label>
            <input
              type="text"
              name="transactionId"
              value={order.transactionId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
