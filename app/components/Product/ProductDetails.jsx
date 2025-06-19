// components/product/ProductDetails.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { addItemToCart } from '../../redux/actions/cartActions';
import { addToCart } from '../../lib/cart';
import { addToWishlist } from '../../lib/wishlist';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';
import { AddWish } from '../../redux/reducer/wishSlice';


function ProductDetails({ product, addItem, AddWishh }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  // Initialize selected variant when product loads
  useEffect(() => {
    if (product.hasVariants && product.variants.length > 0) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
    }
  }, [product]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (product.hasVariants) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(variant);
      // Reset quantity when variant changes
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, product]);

  // Calculate final price with discount
  const finalPrice = selectedVariant
    ? selectedVariant.price * (1 - (product.discount || 0) / 100)
    : product.price * (1 - (product.discount || 0) / 100);

  // Get available stock
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    // Format product data for cart
    const cartData = {
      products: [{
        product: product._id,
        variantId: selectedVariant?._id,
        quantity: quantity,
        price: selectedVariant?.price || product.price,
        discount: product.discount,
        name: product.name,
        image: product.images?.[0] || '/placeholder.png',
        color: selectedVariant?.color,
        size: selectedVariant?.size,
        sku: selectedVariant?.sku
      }]
    };

    const cartItem = {
      product: product._id,
      variantId: selectedVariant?._id,
      quantity: quantity,
      price: selectedVariant?.price || product.price,
      discount: product.discount,
      name: product.name,
      image: product.images?.[0] || '/placeholder.png',
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      sku: selectedVariant?.sku
    };

    try {
      const response = await addToCart(cartData);
      
      if (response.success) {
        addItem(cartItem);
        toast.success(response.message || "Added to cart!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        addItem(cartItem);
        toast.success("Added to cart!");
        return;
      }
      
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Failed to add to cart");
        return;
      }

      toast.error("Failed to add to cart. Please try again.");
      console.error("Cart error:", error);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    
    if (product.hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const wishlistItem = {
      product: product._id,
      variantId: selectedVariant?._id,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image: product.images?.[0] || '/placeholder.png',
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      sku: selectedVariant?.sku
    };

    try {
      const response = await addToWishlist(wishlistItem);
      
      if (response.success) {
        AddWishh(wishlistItem);
        toast.success(response.message || "Added to wishlist!");
        return;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        AddWishh(wishlistItem);
        toast.success("Added to wishlist!");
        return;
      } 
      
      if (error.response?.status === 400 && error.response?.data?.message === "Item already in wishlist") {
        toast.error("Item is already in your wishlist!");
        return;
      }

      toast.error("Failed to add to wishlist. Please try again.");
      console.error("Wishlist error:", error);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square relative rounded-lg overflow-hidden border">
          {product.images && product.images.length > 0 ? (
            <Image 
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
        </div>
        
        {/* Thumbnail Images */}
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`cursor-pointer border-2 rounded w-20 h-20 relative ${
                  selectedImage === index ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i}
                size={18}
                className={i < Math.round(product.ratings || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.ratings || 0} ratings)</span>
        </div>
        
        {/* Variant Selection */}
        {product.hasVariants && (
          <div className="space-y-4">
            {/* Color Selection */}
            <div className="space-y-2">
              <span className="font-medium">Color:</span>
              <div className="flex gap-2">
                {product.availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <span className="font-medium">Size:</span>
              <div className="flex gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* SKU Display */}
            {selectedVariant && (
              <div className="text-sm text-gray-500">
                SKU: {selectedVariant.sku}
              </div>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-blue-600">
            ₹{finalPrice.toFixed(2)}
          </div>
          {product.discount > 0 && (
            <>
              <div className="text-lg text-gray-500 line-through">
                ₹{(selectedVariant?.price || product.price).toFixed(2)}
              </div>
              <div className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                {product.discount}% OFF
              </div>
            </>
          )}
        </div>

        <div className="py-4">
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Category:</span>
          <span className="text-gray-600">{product.category}</span>
        </div>
        
        {/* Stock Display */}
        <div className="flex items-center space-x-2">
          <span className="font-medium">Availability:</span>
          <span className={availableStock > 0 ? "text-green-600" : "text-red-600"}>
            {availableStock > 0 
              ? `In Stock (${availableStock} available)` 
              : "Out of Stock"}
          </span>
        </div>
        
        {/* Quantity Selector */}
        <div className="flex items-center space-x-4 pt-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex border rounded">
            <button 
              className="px-3 py-1 border-r"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={availableStock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(
                availableStock, 
                Math.max(1, parseInt(e.target.value) || 1)
              ))}
              className="w-16 text-center focus:outline-none"
            />
            <button 
              className="px-3 py-1 border-l"
              onClick={() => setQuantity(prev => Math.min(availableStock, prev + 1))}
              disabled={quantity >= availableStock}
            >
              +
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-6">
          <button
            onClick={handleAddToCart}
            disabled={availableStock <= 0 || (product.hasVariants && !selectedVariant)}
            className={`flex items-center justify-center px-6 py-3 rounded-md text-white font-medium space-x-2 w-full md:w-auto
              ${availableStock > 0 && (!product.hasVariants || selectedVariant) 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <ShoppingCart size={20} />
            <span>Add to Cart</span>
          </button>
          
          <button
            onClick={handleAddToWishlist}
            disabled={product.hasVariants && !selectedVariant}
            className="flex items-center justify-center px-6 py-3 rounded-md bg-white border border-gray-300 font-medium space-x-2 hover:bg-gray-50 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart size={20} />
            <span>Add to Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItemToCart(item)),
  AddWishh: (item) => dispatch(AddWish(item)),
});

export default connect(null, mapDispatchToProps)(ProductDetails);