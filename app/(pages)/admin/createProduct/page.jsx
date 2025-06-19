"use client";
import { useState, useCallback } from "react";
import api from "../../../lib/api";
import { 
  Upload, X, Plus, Trash2, Image as ImageIcon, Video, Box, 
  ChevronDown, ChevronUp, Info, Tag, Truck, Star, BarChart3,
  Package, DollarSign, Calendar, FileText, Globe, Search
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

// Move SectionHeader outside the main component to prevent re-renders
const SectionHeader = ({ title, icon, section, children, expandedSections, toggleSection }) => (
  <div className="bg-white rounded-lg shadow-sm border">
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {expandedSections[section] ? 
        <ChevronUp className="w-5 h-5 text-gray-500" /> : 
        <ChevronDown className="w-5 h-5 text-gray-500" />
      }
    </button>
    {expandedSections[section] && (
      <div className="p-4 pt-0 border-t border-gray-200">
        {children}
      </div>
    )}
  </div>
);

// Custom label component with required indicator
const FormLabel = ({ children, required = false, className = "" }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>
    {children}
    {required && <span className="text-red-500 ml-1 text-base">*</span>}
    {required && <span className="text-xs text-red-500 ml-1">(Required)</span>}
  </label>
);

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    category: "",
    brand: "",
    productModel: "",
    sku: "",
    barcode: "",
    
    // Status & Visibility
    status: "draft",
    featured: false,
    isDigital: false,
    
    // Pricing & Discounts
    discount: 0,
    comparePrice: 0,
    costPrice: 0,
    taxable: true,
    taxClass: "",
    
    // Inventory
    hasVariants: false,
    variants: [],
    stock: 0,
    trackQuantity: true,
    allowBackorders: false,
    lowStockThreshold: 5,
    
    // Features & Specifications
    features: [],
    specifications: [],
    detailedDescription: [],
    
    // SEO
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      slug: ""
    },
    
    // Shipping
    shipping: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      freeShipping: false,
      shippingClass: ""
    },
    
    // Additional
    tags: [],
    vendor: "",
    supplier: "",
    manufacturingDate: "",
    expiryDate: ""
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    media: true,
    inventory: false,
    pricing: false,
    features: false,
    seo: false,
    shipping: false,
    additional: false
  });

  // Available options
  const categories = ["men","women","travel","handbags","smallleathergoods", "accessories", "bags", "fragrances",];
  const brands = ["Nike", "Adidas", "Apple", "Samsung", "Sony", "Custom"];
  const availableColors = ["Red", "Blue", "Black", "White", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown"];
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];
  const shippingClasses = ["standard", "express", "overnight", "free"];
  const statusOptions = ["draft", "active", "inactive", "discontinued"];

  // Use useCallback to prevent function recreation
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = type === "checkbox" ? checked : 
                                        ["price", "stock", "discount", "weight", "length", "width", "height", "comparePrice", "costPrice", "lowStockThreshold"].includes(keys[keys.length - 1]) ? 
                                        (parseFloat(value) || 0) : value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : 
                ["price", "stock", "discount", "comparePrice", "costPrice", "lowStockThreshold"].includes(name) ? 
                (parseFloat(value) || 0) : value,
      }));
    }
  }, []);

  // Handle array fields
  const handleArrayChange = useCallback((field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  }, []);

  const addArrayItem = useCallback((field, defaultValue = "") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  }, []);

  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  // Handle features
  const addFeature = useCallback(() => addArrayItem("features", ""), [addArrayItem]);
  const removeFeature = useCallback((index) => removeArrayItem("features", index), [removeArrayItem]);

  // Handle tags
  const addTag = useCallback(() => addArrayItem("tags", ""), [addArrayItem]);
  const removeTag = useCallback((index) => removeArrayItem("tags", index), [removeArrayItem]);

  // Handle SEO keywords
  const addKeyword = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, keywords: [...prev.seo.keywords, ""] }
    }));
  }, []);

  const removeKeyword = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      seo: { 
        ...prev.seo, 
        keywords: prev.seo.keywords.filter((_, i) => i !== index) 
      }
    }));
  }, []);

  const handleKeywordChange = useCallback((index, value) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.map((keyword, i) => i === index ? value : keyword)
      }
    }));
  }, []);

  // Handle specifications
  const addSpecification = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "", group: "" }]
    }));
  }, []);

  const removeSpecification = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSpecificationChange = useCallback((index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  }, []);

  // Handle detailed description sections
  const addDescriptionSection = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      detailedDescription: [...prev.detailedDescription, { 
        title: "", 
        content: "", 
        type: "text", 
        order: prev.detailedDescription.length 
      }]
    }));
  }, []);

  const removeDescriptionSection = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      detailedDescription: prev.detailedDescription.filter((_, i) => i !== index)
    }));
  }, []);

  const handleDescriptionSectionChange = useCallback((index, field, value) => {
    setFormData(prev => ({
      ...prev,
      detailedDescription: prev.detailedDescription.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  }, []);

  // Handle variants
  const handleVariantChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: field === "stock" ? (parseInt(value) || 0) : 
                field === "price" ? (parseFloat(value) || 0) : value
      };
      return { ...prev, variants: updatedVariants };
    });
  }, []);

  const addVariant = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { 
        color: "", 
        size: "", 
        stock: 0, 
        price: 0,
        isActive: true
      }]
    }));
  }, []);

  const removeVariant = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  }, []);

  // Enhanced media handling
  const getFileType = useCallback((file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('model/') || 
        file.name.toLowerCase().endsWith('.glb') ||
        file.name.toLowerCase().endsWith('.gltf') ||
        file.name.toLowerCase().endsWith('.usdz') ||
        file.name.toLowerCase().endsWith('.obj') ||
        file.name.toLowerCase().endsWith('.fbx')) return '3d_model';
    return 'image';
  }, []);

  const handleMediaChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    setMediaFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => ({
      file,
      type: getFileType(file),
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    
    setMediaPreviews(prev => [...prev, ...newPreviews]);
  }, [getFileType]);

  const removeMedia = useCallback((index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => {
      const removed = prev[index];
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const getMediaIcon = useCallback((type) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case '3d_model': return <Box className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Auto-generate slug from name
  const generateSlug = useCallback((name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  // Handle name change and auto-generate slug
  const handleNameChange = useCallback((e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      seo: {
        ...prev.seo,
        slug: prev.seo.slug || generateSlug(name),
        metaTitle: prev.seo.metaTitle || name
      }
    }));
  }, [generateSlug]);

  const resetForm = useCallback(() => {
    // Clean up object URLs before resetting
    mediaPreviews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });

    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      price: 0,
      category: "",
      brand: "",
      productModel: "",
      sku: "",
      barcode: "",
      status: "draft",
      featured: false,
      isDigital: false,
      discount: 0,
      comparePrice: 0,
      costPrice: 0,
      taxable: true,
      taxClass: "",
      hasVariants: false,
      variants: [],
      stock: 0,
      trackQuantity: true,
      allowBackorders: false,
      lowStockThreshold: 5,
      features: [],
      specifications: [],
      detailedDescription: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        slug: ""
      },
      shipping: {
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0
        },
        freeShipping: false,
        shippingClass: ""
      },
      tags: [],
      vendor: "",
      supplier: "",
      manufacturingDate: "",
      expiryDate: ""
    });
    setMediaFiles([]);
    setMediaPreviews([]);
  }, [mediaPreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productFormData = new FormData();

      // Append basic product data
      Object.keys(formData).forEach((key) => {
        if (key === "variants" && formData.hasVariants) {
          productFormData.append(key, JSON.stringify(formData[key]));
        } else if (key === "seo" || key === "shipping") {
          productFormData.append(key, JSON.stringify(formData[key]));
        } else if (Array.isArray(formData[key])) {
          productFormData.append(key, JSON.stringify(formData[key]));
        } else if (typeof formData[key] === 'boolean') {
          productFormData.append(key, formData[key].toString());
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
          productFormData.append(key, formData[key]);
        }
      });

      // Append media files
      mediaFiles.forEach((file) => {
        productFormData.append("media", file);
      });

      console.log('Sending product data:', Object.fromEntries(productFormData.entries()));

      const res = await api.post("/v1/products", productFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Product created successfully! 🎉");
        resetForm();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to create product: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-2">Add a new product to your inventory with detailed information</p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="text-red-500 font-semibold">*</span> Fields marked with red asterisk are required
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <SectionHeader 
          title="Basic Information" 
          icon={<FileText className="w-5 h-5" />}
          section="basic"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel required>Product Name</FormLabel>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <FormLabel required>Category</FormLabel>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormLabel>Brand</FormLabel>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Brand name"
                />
              </div>

              <div>
                <FormLabel>Product Model</FormLabel>
                <input
                  name="productModel"
                  value={formData.productModel}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Model number"
                />
              </div>

              <div>
                <FormLabel>Status</FormLabel>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <FormLabel>Short Description</FormLabel>
              <input
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Brief product description (1-2 sentences)"
              />
            </div>

            <div>
              <FormLabel required>Full Description</FormLabel>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Detailed product description"
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDigital"
                  checked={formData.isDigital}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Digital Product</span>
              </label>
            </div>
          </div>
        </SectionHeader>

        {/* Media Upload */}
        <SectionHeader 
          title="Media Files (Images, Videos, 3D Models)" 
          icon={<ImageIcon className="w-5 h-5" />}
          section="media"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Images (PNG, JPG, JPEG, WebP, GIF), Videos (MP4, WebM, OGG), 3D Models (GLB, GLTF, USDZ, OBJ, FBX)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max file size: 100MB per file
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*,.glb,.gltf,.usdz,.obj,.fbx"
                  onChange={handleMediaChange}
                />
              </label>
            </div>

            {/* Media Previews */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative group border rounded-lg p-3 bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {preview.type === 'image' ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={preview.url}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getMediaIcon(preview.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {preview.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {preview.type.replace('_', ' ').toUpperCase()} • {formatFileSize(preview.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionHeader>

        {/* Pricing */}
        <SectionHeader 
          title="Pricing & Discounts" 
          icon={<DollarSign className="w-5 h-5" />}
          section="pricing"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <FormLabel required>Base Price (INR)</FormLabel>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <FormLabel>Compare Price (INR)</FormLabel>
              <input
                type="number"
                step="0.01"
                min="0"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Original price"
              />
            </div>

            <div>
              <FormLabel>Cost Price (INR)</FormLabel>
              <input
                type="number"
                step="0.01"
                min="0"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Cost price"
              />
            </div>

            <div>
              <FormLabel>Discount (%)</FormLabel>
              <input
                type="number"
                min="0"
                max="100"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="taxable"
                checked={formData.taxable}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Taxable Product</span>
            </label>

            <div>
              <input
                name="taxClass"
                value={formData.taxClass}
                onChange={handleChange}
                placeholder="Tax class (optional)"
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </SectionHeader>

        {/* Inventory Management */}
        <SectionHeader 
          title="Inventory Management" 
          icon={<Package className="w-5 h-5" />}
          section="inventory"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasVariants"
                name="hasVariants"
                checked={formData.hasVariants}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="hasVariants" className="text-sm font-medium text-gray-700 cursor-pointer">
                This product has multiple variants (colors, sizes, etc.)
              </label>
            </div>

            {!formData.hasVariants && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FormLabel required>Stock Quantity</FormLabel>
                  <input
                    required
                    type="number"
                    min="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <input
                    type="number"
                    min="0"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-6 pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="trackQuantity"
                      checked={formData.trackQuantity}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Track Quantity</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowBackorders"
                      checked={formData.allowBackorders}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Allow Backorders</span>
                  </label>
                </div>
              </div>
            )}

            {/* Variants Section */}
            {formData.hasVariants && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Product Variants</h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Variant
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Variant {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <FormLabel>Color</FormLabel>
                          <select
                            value={variant.color}
                            onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="">Select Color</option>
                            {availableColors.map(color => (
                              <option key={color} value={color}>{color}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <FormLabel>Size</FormLabel>
                          <select
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="">Select Size</option>
                            {availableSizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <FormLabel required>Stock</FormLabel>
                          <input
                            required
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        
                        <div>
                          <FormLabel>Price Override</FormLabel>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                            placeholder="Optional"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div className="flex items-center pt-6">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={variant.isActive}
                              onChange={(e) => handleVariantChange(index, "isActive", e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionHeader>

        {/* Features & Specifications */}
        <SectionHeader 
          title="Features & Specifications" 
          icon={<BarChart3 className="w-5 h-5" />}
          section="features"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-6">
            {/* Features */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Key Features</h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={feature}
                      onChange={(e) => handleArrayChange("features", index, e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Specifications</h3>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Specification
                </button>
              </div>
              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      value={spec.name}
                      onChange={(e) => handleSpecificationChange(index, "name", e.target.value)}
                      placeholder="Specification name"
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                      placeholder="Value"
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <input
                      value={spec.group}
                      onChange={(e) => handleSpecificationChange(index, "group", e.target.value)}
                      placeholder="Group (optional)"
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-red-500 hover:text-red-700 border border-red-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Description Sections */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Detailed Description Sections</h3>
                <button
                  type="button"
                  onClick={addDescriptionSection}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Section
                </button>
              </div>
              <div className="space-y-4">
                {formData.detailedDescription.map((section, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Section {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeDescriptionSection(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <input
                        value={section.title}
                        onChange={(e) => handleDescriptionSectionChange(index, "title", e.target.value)}
                        placeholder="Section title"
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <select
                        value={section.type}
                        onChange={(e) => handleDescriptionSectionChange(index, "type", e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="text">Plain Text</option>
                        <option value="html">HTML</option>
                        <option value="markdown">Markdown</option>
                      </select>
                      <input
                        type="number"
                        value={section.order}
                        onChange={(e) => handleDescriptionSectionChange(index, "order", parseInt(e.target.value))}
                        placeholder="Order"
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => handleDescriptionSectionChange(index, "content", e.target.value)}
                      placeholder="Section content"
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionHeader>

        {/* SEO */}
        <SectionHeader 
          title="SEO & Marketing" 
          icon={<Globe className="w-5 h-5" />}
          section="seo"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>SEO Title</FormLabel>
                <input
                  name="seo.metaTitle"
                  value={formData.seo.metaTitle}
                  onChange={handleChange}
                  maxLength={60}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="SEO meta title"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.seo.metaTitle.length}/60 characters</p>
              </div>

              <div>
                <FormLabel>URL Slug</FormLabel>
                <input
                  name="seo.slug"
                  value={formData.seo.slug}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="url-slug"
                />
              </div>
            </div>

            <div>
              <FormLabel>Meta Description</FormLabel>
              <textarea
                name="seo.metaDescription"
                value={formData.seo.metaDescription}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="SEO meta description"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.seo.metaDescription.length}/160 characters</p>
            </div>

            {/* SEO Keywords */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <FormLabel>SEO Keywords</FormLabel>
                <button
                  type="button"
                  onClick={addKeyword}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Keyword
                </button>
              </div>
              <div className="space-y-2">
                {formData.seo.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder="Enter keyword"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <FormLabel>Product Tags</FormLabel>
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Tag className="w-4 h-4 mr-1" />
                  Add Tag
                </button>
              </div>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={tag}
                      onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                      placeholder="Enter tag"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionHeader>

        {/* Shipping */}
        <SectionHeader 
          title="Shipping Information" 
          icon={<Truck className="w-5 h-5" />}
          section="shipping"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Weight (kg)</FormLabel>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="shipping.weight"
                  value={formData.shipping.weight}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <FormLabel>Shipping Class</FormLabel>
                <select
                  name="shipping.shippingClass"
                  value={formData.shipping.shippingClass}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select shipping class</option>
                  {shippingClasses.map(cls => (
                    <option key={cls} value={cls}>{cls.charAt(0).toUpperCase() + cls.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <FormLabel>Dimensions (cm)</FormLabel>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="shipping.dimensions.length"
                  value={formData.shipping.dimensions.length}
                  onChange={handleChange}
                  placeholder="Length"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="shipping.dimensions.width"
                  value={formData.shipping.dimensions.width}
                  onChange={handleChange}
                  placeholder="Width"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="shipping.dimensions.height"
                  value={formData.shipping.dimensions.height}
                  onChange={handleChange}
                  placeholder="Height"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="shipping.freeShipping"
                checked={formData.shipping.freeShipping}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700 cursor-pointer">
                Free Shipping
              </label>
            </div>
          </div>
        </SectionHeader>

        {/* Additional Information */}
        <SectionHeader 
          title="Additional Information" 
          icon={<Info className="w-5 h-5" />}
          section="additional"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>SKU</FormLabel>
                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Stock Keeping Unit (auto-generated if empty)"
                />
              </div>

              <div>
                <FormLabel>Barcode</FormLabel>
                <input
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Product barcode"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Vendor</FormLabel>
                <input
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Product vendor"
                />
              </div>

              <div>
                <FormLabel>Supplier</FormLabel>
                <input
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Product supplier"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Manufacturing Date</FormLabel>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <FormLabel>Expiry Date</FormLabel>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </SectionHeader>

        {/* Submit Button */}
        <div className="bg-white p-6 rounded-lg shadow-sm border sticky bottom-0 z-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating Product..." : "Create Product"}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Reset Form
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
