"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { connect } from "react-redux"
import { ShoppingCart, Heart } from "lucide-react"
import toast from "react-hot-toast"
import { addItemToCart } from "../../redux/actions/cartActions"
import { AddWish } from "../../redux/reducer/wishSlice"
import { addToWishlist } from "../../lib/wishlist"
import { addToCart } from "../../lib/cart"


function ProductPageCard({ product, addItem, AddWishh }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Get images from gallery or fallback to images array
  const getProductImages = () => {
    if (product.gallery?.images?.length > 0) {
      return product.gallery.images.map(img => img.url)
    }
    if (product.media?.length > 0) {
      return product.media.map(img => img.url)
    }
    if (product.images?.length > 0) {
      return product.images
    }
    return ['/placeholder-product.jpg']
  }

  const currentImage = getProductImages()[0]

  // ✅ Calculate final price with discount
  const getFinalPrice = () => {
    if (product.finalPrice) return product.finalPrice;
    const basePrice = product.price || 0;
    const discount = product.discount || 0;
    return discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
  }

  const finalPrice = getFinalPrice();

  const handleClick = (e) => {
    if (e.target.closest("button")) return
    router.push(`/products/${product._id}`)
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    setIsLoading(true)
    
    const cartData = {
      products: [{
        product: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        quantity: 1,
        image: currentImage,
        ...(product.hasVariants && product.variants?.length > 0 && {
          variantId: product.variants[0]._id
        })
      }]
    }

    const cartItem = {
      id: `${product._id}${product.hasVariants && product.variants?.length > 0 ? `-${product.variants[0]._id}` : ''}`,
      product: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      finalPrice: finalPrice,
      discount: product.discount || 0,
      quantity: 1,
      image: currentImage,
      category: product.category,
      brand: product.brand,
      inStock: product.isInStock !== false,
      maxQuantity: product.stock || 999,
      addedAt: new Date().toISOString(),
      ...(product.hasVariants && product.variants?.length > 0 && {
        variantId: product.variants[0]._id,
        color: product.variants[0].color,
        size: product.variants[0].size,
        sku: product.variants[0].sku
      })
    }

    try {
      const response = await addToCart(cartData)
      if (response.success) {
        addItem(response.data.items[0])
        toast.success(response.message || "Added to cart!")
      }
    } catch (error) {
      console.error("Cart API error:", error);
      if (error.response?.status === 401) {
        addItem(cartItem)
        toast.success("Added to cart! (Sign in to sync across devices)")
        return
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Failed to add to cart")
        return
      } else {
        addItem(cartItem)
        toast.success("Added to cart! (Saved locally)")
        return
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.stopPropagation()
    setWishlistLoading(true)
    
    try {
      const wishlistData = {
        productId: product._id,
        variantId: undefined,
        name: product.name,
        price: product.price,
        discount: product.discount || 0,
        finalPrice: finalPrice,
        image: currentImage,
        category: product.category,
        brand: product.brand,
        inStock: product.isInStock !== false
      }

      const response = await addToWishlist(wishlistData)
      if (response.success) {
        AddWishh(response.data)
        toast.success(response.message || "Added to wishlist!")
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
      if (error.response?.status === 401) {
        const wishItem = {
          product: product._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          finalPrice: finalPrice,
          discount: product.discount || 0,
          image: currentImage,
          category: product.category,
          brand: product.brand,
          inStock: product.isInStock !== false,
          addedAt: new Date().toISOString()
        }
        AddWishh(wishItem)
        toast.success("Added to wishlist! (Sign in to sync across devices)")
        return
      } else {
        const wishItem = {
          product: product._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          finalPrice: finalPrice,
          discount: product.discount || 0,
          image: currentImage,
          category: product.category,
          brand: product.brand,
          inStock: product.isInStock !== false,
          addedAt: new Date().toISOString()
        }
        AddWishh(wishItem)
        toast.success("Added to wishlist! (Saved locally)")
        return
      }
    } finally {
      setWishlistLoading(false)
    }
  }

  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* ✅ Image takes 80% of card height */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          unoptimized
        />
        
        {/* ✅ Discount Badge - Simple */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}

        {/* ✅ Action Buttons - Minimalist */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110"
            aria-label="Add to wishlist"
          >
            {wishlistLoading ? (
              <div className="w-3 h-3 border border-red-300 border-t-red-500 rounded-full animate-spin" />
            ) : (
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
            )}
          </button>
        </div>

        {/* ✅ Add to Cart Button - Slides up on hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={!product.isInStock || isLoading}
            className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              !product.isInStock
                ? "bg-gray-400 text-white cursor-not-allowed"
                : isLoading
                ? "bg-red-400 text-white cursor-wait"
                : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            <span>
              {!product.isInStock 
                ? "Out of Stock" 
                : isLoading 
                ? "Adding..." 
                : "Add to Cart"
              }
            </span>
          </button>
        </div>
      </div>

      {/* ✅ Product Info - Minimal details only */}
      <div className="p-3">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 mb-2 group-hover:text-red-600 transition-colors duration-200">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">
            ₹{finalPrice.toLocaleString()}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.price?.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItemToCart(item)),
  AddWishh: (item) => dispatch(AddWish(item)),
})

export default connect(null, mapDispatchToProps)(ProductPageCard)
