"use client";
import { useState } from "react";
import api from "../../../lib/api";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

export default function EditProductPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    images: [],
    stock: 0,
    discount: 0,
    hasVariants: false,
    variants: [],
  });

  // Available options for variants
  const availableColors = ["Red", "Blue", "Black", "White", "Green"];
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const [status, setStatus] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(productParam));
        setFormData({
          ...decoded,
          images: Array.isArray(decoded.images) ? decoded.images : [decoded.images],
          discount: decoded.discount || 0,
          hasVariants: decoded.hasVariants || false,
          variants: decoded.variants || [],
        });
      } catch (error) {
        console.error("Error decoding product:", error);
      }
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "images") {
      setFormData({ ...formData, [name]: value.split(",") });
    } else if (["price", "stock", "discount"].includes(name)) {
      const numValue = parseFloat(value);
      setFormData({ ...formData, [name]: numValue });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: field === "stock" ? parseInt(value) : 
                field === "price" ? parseFloat(value) : value
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { 
        color: "", 
        size: "", 
        stock: 0, 
        price: formData.price,
        _id: `temp_${Date.now()}` // Temporary ID for new variants
      }]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Calculate final price
  const calculateFinalPrice = () => {
    const { price, discount } = formData;
    return price * (1 - discount / 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Submitting...");

    try {
      // Create FormData object
      const productFormData = new FormData();

      // Append basic product data
      Object.keys(formData).forEach((key) => {
        if (key === "variants") {
          if (formData.hasVariants) {
            productFormData.append(key, JSON.stringify(formData[key]));
          }
        } else if (key === "hasVariants") {
          productFormData.append(key, formData[key].toString());
        } else if (key === "images") {
          // Handle existing images
          productFormData.append(key, JSON.stringify(formData[key]));
        } else {
          productFormData.append(key, formData[key]);
        }
      });

      // Append new images if any
      images.forEach((image) => {
        productFormData.append("newImages", image);
      });

      const res = await api.put(`/v1/products/${formData.id}`, productFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setStatus("✅ Product updated successfully");
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (INR) *
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%){" "}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Price Summary */}
            {formData.discount > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Original Price:</span>
                  <span className="text-sm text-gray-900">₹{formData.price}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="text-sm text-red-600">-{formData.discount}%</span>
                </div>
                <div className="flex justify-between items-center mt-1 font-medium">
                  <span className="text-sm text-gray-900">Final Price:</span>
                  <span className="text-sm text-gray-900">
                    ₹{calculateFinalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="bags">Bags</option>
                  <option value="shoes">Shoes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Variants Toggle */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="hasVariants"
              name="hasVariants"
              checked={formData.hasVariants}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasVariants" className="text-sm font-medium text-gray-700">
              This product has multiple variants
            </label>
          </div>

          {/* Stock input for non-variant products */}
          {!formData.hasVariants && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                required
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Variants Section */}
        {formData.hasVariants && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Product Variants</h2>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={variant._id || index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Variant {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <select
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Color</option>
                        {availableColors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <select
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Size</option>
                        {availableSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Override
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                        placeholder="Optional"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>

                  {/* Display SKU if it exists */}
                  {variant.sku && (
                    <div className="mt-2 text-sm text-gray-500">
                      SKU: {variant.sku}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or JPEG (MAX. 800x400px)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>

        {/* Status Message */}
        {status && (
          <div className={`mt-4 p-3 rounded-md ${
            status.startsWith("✅") ? "bg-green-50 text-green-800" :
            status.startsWith("❌") ? "bg-red-50 text-red-800" :
            "bg-blue-50 text-blue-800"
          }`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
