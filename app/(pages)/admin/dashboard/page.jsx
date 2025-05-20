// pages/products.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../page";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRef } from "react";
import { FaShoppingCart, FaStar, FaComment, FaGem } from "react-icons/fa";
import { useRouter } from "next/navigation";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const pageSize = 5;

const stats = [
  {
    icon: <FaShoppingCart className="text-white" />,
    bg: "bg-blue-600",
    title: "Top Sales",
    user: "Johnathan Doe",
    growth: "+68%",
  },
  {
    icon: <FaStar className="text-black" />,
    bg: "bg-yellow-400",
    title: "Best Seller",
    user: "MaterialPro Admin",
    growth: "+68%",
  },
  {
    icon: <FaComment className="text-white" />,
    bg: "bg-green-500",
    title: "Most Commented",
    user: "Ample Admin",
    growth: "+68%",
  },
  {
    icon: <FaGem className="text-white" />,
    bg: "bg-blue-400",
    title: "Top Budgets",
    user: "Sunil Joshi",
    growth: "+15%",
  },
];

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsData, setProductsData] = useState([]);
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);
  const router = useRouter();

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Monthly Sales",
        data: [3, 2, 2, 6, 4],
        fill: true,
        backgroundColor: gradient,
        borderColor: "#3A7BD5",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: "easeOutQuart",
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        cornerRadius: 6,
      },
      legend: {
        labels: {
          color: "#333",
          font: {
            size: 14,
            family: "Arial",
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#555" },
        grid: { color: "rgba(200,200,200,0.2)" },
      },
      x: {
        ticks: { color: "#555" },
        grid: { display: false },
      },
    },
  };

  const totalPages = Math.ceil(productsData.length / pageSize);
  const currentProducts = productsData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const getAllProducts = async () => {
      const response = await axios.get("http://localhost:3000/v1/products");
      console.log(response.data.data);
      setProductsData(response.data.data);
    };
    debugger;
    getAllProducts();
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const ctx = chart.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, "rgba(58,123,213,1)");
    gradientFill.addColorStop(1, "rgba(0,210,255,0.3)");
    setGradient(gradientFill);
  }, []);

  function editProduct(product) {
    router.push(
      `/admin/editProduct?product=${encodeURIComponent(
        JSON.stringify(product)
      )}`
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
      <div>
        {/* chart */}
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
          <Line ref={chartRef} data={data} options={options} />
        </div>
        {/* card */}
        <div className="bg-white shadow rounded-lg p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Weekly Stats</h2>
              <p className="text-sm text-gray-500">Average sales</p>
            </div>
            <div className="text-gray-400 text-xl">⋯</div>
          </div>

          <div className="space-y-4">
            {stats.map((item, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${item.bg}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.user}</div>
                  </div>
                </div>
                <span className="bg-gray-100 text-sm font-semibold px-2 py-1 rounded">
                  {item.growth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full justify-center h-full">
        <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Products List</h2>
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap text-left">Product</th>
                    <th className="p-2 whitespace-nowrap text-left">
                      Category
                    </th>
                    <th className="p-2 whitespace-nowrap text-left">Price</th>
                    <th className="p-2 whitespace-nowrap text-left">Stock</th>
                    <th className="p-2 whitespace-nowrap text-left">Status</th>
                    <th className="p-2 whitespace-nowrap text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                            <img
                              className="rounded"
                              src={product.image}
                              width="40"
                              height="40"
                              alt={product.name}
                            />
                          </div>
                          <div className="font-medium text-gray-800">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="p-2 whitespace-nowrap text-green-500 font-medium">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="p-2 whitespace-nowrap">{product.stock}</td>
                      <td className="p-2 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold inline-block px-2 py-1 rounded-full ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : product.status === "Draft"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <button
                          className="text-purple-600 hover:underline"
                          onClick={() => editProduct(product)}
                        >
                          Edit
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
