"use client";
import { useState } from "react";
import api from "../../../lib/api";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CreateProductPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    images: [],
    stock: 0,
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(productParam));
        setFormData({
          ...decoded,
          images: Array.isArray(decoded.images)
            ? decoded.images
            : [decoded.images],
        });
      } catch (error) {
        console.error("Error decoding product:", error);
      }
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle array fields like images
    if (name === "images") {
      setFormData({ ...formData, [name]: value.split(",") });
    } else if (name === "price" || name === "stock") {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger;
    setStatus("Submitting...");
    try {
      const res = await api.put("/v1/products/", formData);
      if (res.status != 201) throw new Error("Failed to create product");

      setStatus(`✅ Product created Successfully`);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product (Admin)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["name", "Product Name"],
          ["description", "Description"],
          ["category", "Category"],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block font-medium">{label}</label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <div>
          <label className="block font-medium">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">
            Images (comma-separated URLs)
          </label>
          <input
            name="images"
            value={formData.images.join(",")}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
