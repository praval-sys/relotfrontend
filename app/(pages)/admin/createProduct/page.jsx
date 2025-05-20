"use client";
import { useState } from "react";
import api from "../../../lib/api";

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: "Relot Colourmania Tote Bag",
    description:
      "A vibrant and durable tote bag from the Relot Colourmania collection, perfect for everyday use.",
    price: 24.99,
    category: "bags",
    images: [
      "https://example.com/images/relot-colourmania-tote1.jpg",
      "https://example.com/images/relot-colourmania-tote2.jpg",
    ],
    stock: 75,
  });

  const [status, setStatus] = useState(null);

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
      const res = await api.post("/v1/products", formData);
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
          Create Product
        </button>
      </form>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
