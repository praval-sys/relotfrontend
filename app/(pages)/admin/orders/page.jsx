// pages/products.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../lib/api";

import { Line } from "react-chartjs-2";
import { useRef } from "react";
import { FaShoppingCart, FaStar, FaComment, FaGem } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const pageSize = 5;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsData, setProductsData] = useState([]);
  const chartRef = useRef(null);

  const router = useRouter();

  const totalPages = Math.ceil(productsData.length / pageSize);
  const currentProducts = productsData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getAllProducts = async () => {
    debugger;
    const response = await api.get("v1/admin/orders");
    console.log(response.data.data);

    setProductsData(response.data.data);
  };

  useEffect(() => {
    getAllProducts();
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const ctx = chart.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, "rgba(58,123,213,1)");
    gradientFill.addColorStop(1, "rgba(0,210,255,0.3)");
    setGradient(gradientFill);
  }, []);

  const deleteProduct = async (order) => {
    debugger;
    const response = await api.delete(`v1/admin/orders/${order._id}`);
    getAllProducts();
    console.log(response);
  };

  function editOrder(order) {
    debugger;
    router.push(
      `/admin/editorder?order=${encodeURIComponent(JSON.stringify(order))}`
    );
  }

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages.map((page, i) =>
      page === "..." ? (
        <span key={i} className="px-2 py-1 text-gray-500">
          ...
        </span>
      ) : (
        <span
          key={i}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? "bg-purple-600 text-white" : ""
          }`}
        >
          {page}
        </span>
      )
    );
  };

  return (
    <div className="bodyy">
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          gap: "81px",
        }}
      >
        {/* chart */}
      </div>

      <div className="flex flex-col w-full justify-center h-full">
        <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Orders List</h2>
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 text-left whitespace-nowrap">
                      Customer
                    </th>
                    <th className="p-2 text-left whitespace-nowrap">Phone</th>
                    <th className="p-2 text-left whitespace-nowrap">Address</th>
                    <th className="p-2 text-left whitespace-nowrap">Items</th>
                    <th className="p-2 text-left whitespace-nowrap">Total</th>
                    <th className="p-2 text-left whitespace-nowrap">Payment</th>
                    <th className="p-2 text-left whitespace-nowrap">
                      Delivery
                    </th>

                    <th className="p-2 text-left whitespace-nowrap">Date</th>
                    <th className="p-2 whitespace-nowrap text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {productsData.map((order) => (
                    <tr key={order._id}>
                      <td className="p-2 whitespace-nowrap font-medium text-gray-800">
                        {order.shippingAddress.name}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {order.shippingAddress.phone}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {order.shippingAddress.street},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.zipCode}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {order.items.map((item) => (
                          <div key={item._id}>
                            {item.quantity} x ${item.price.toFixed(2)}
                          </div>
                        ))}
                      </td>
                      <td className="p-2 whitespace-nowrap font-semibold text-green-600">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold inline-block px-2 py-1 rounded-full ${
                            order.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold inline-block px-2 py-1 rounded-full ${
                            order.deliveryStatus === "pending"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td className="p-2 whitespace-nowrap text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        className="p-2 whitespace-nowrap"
                        style={{ display: "flex", gap: "10px" }}
                      >
                        <button
                          className="text-purple-600 hover:underline"
                          onClick={() => deleteProduct(order)}
                        >
                          <MdDelete />
                        </button>
                        <button
                          className="text-purple-600 hover:underline"
                          onClick={() => editOrder(order)}
                        >
                          <MdEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 px-5">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          {/* {renderPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-3 py-1 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  page === currentPage
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )} */}
          {renderPageNumbers()}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
