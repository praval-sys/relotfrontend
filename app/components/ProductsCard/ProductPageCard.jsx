"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { connect } from "react-redux"
import { ShoppingCart, Heart, Star, Eye, ArrowRight, Tag, Zap } from "lucide-react"
import toast from "react-hot-toast"
import { addItemToCart } from "../../redux/actions/cartActions"
import { AddWish } from "../../redux/reducer/wishSlice"
import { addToWishlist } from "../../lib/wishlist"
import { addToCart } from "../../lib/cart"


function ProductPageCard({ product, addItem, AddWishh }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

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

  const productImages = getProductImages()
  const currentImage = productImages[imageIndex] || productImages[0]

  const handleClick = (e) => {
    if (e.target.closest("button")) return
    router.push(`/products/${product._id}`)
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    setIsLoading(true)
    
    // Format product data for cart using new schema
    const cartData = {
      products: [{
        product: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        quantity: 1,
        image: currentImage,
        // Only include variantId if product has variants
        ...(product.hasVariants && product.variants?.length > 0 && {
          variantId: product.variants[0]._id
        })
      }]
    }

    // Format item for Redux store using new schema
    const cartItem = {
      product: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      finalPrice: product.finalPrice,
      quantity: 1,
      image: currentImage,
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
        toast.success(response.message || "Added to cart!", {
          icon: '🛒',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
      }
    } catch (error) {
      if (error.response?.status === 401) {
        addItem(cartItem)
        toast.success("Added to cart!", {
          icon: '🛒',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
        return
      }
      
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Failed to add to cart")
        return
      }

      toast.error("Failed to add to cart. Please try again.")
      console.error("Cart error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.stopPropagation()
    
    try {
      const wishlistData = {
        productId: product._id,
        variantId: undefined,
        name: product.name,
        price: product.price,
        discount: product.discount,
        finalPrice: product.finalPrice,
        image: currentImage,
        color: undefined,
        size: undefined,
        sku: undefined
      }

      const response = await addToWishlist(wishlistData)
      
      if (response.success) {
        AddWishh(response.data)
        toast.success(response.message || "Added to wishlist!", {
          icon: '❤️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to add items to wishlist")
        return
      } 
      
      if (error.response?.status === 400) {
        if (error.response.data?.message.includes("already in wishlist")) {
          toast.error("Item is already in your wishlist!")
        } else {
          toast.error(error.response.data?.message || "Failed to add to wishlist")
        }
        return
      }

      toast.error("Failed to add to wishlist. Please try again.")
      console.error("Wishlist error:", error)
    }
  }

  const handleImageNavigation = (direction, e) => {
    e.stopPropagation()
    if (direction === 'next') {
      setImageIndex((prev) => (prev + 1) % productImages.length)
    } else {
      setImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
    }
  }

  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Enhanced Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          unoptimized
        />
        
        {/* Image Navigation - Show on hover if multiple images */}
        {productImages.length > 1 && isHovered && (
          <>
            <button
              onClick={(e) => handleImageNavigation('prev', e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={(e) => handleImageNavigation('next', e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {/* Image Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {productImages.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setImageIndex(idx)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === imageIndex ? 'bg-white scale-125' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Enhanced Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" />
              -{product.discount}%
            </div>
          )}
          {product.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Featured
            </div>
          )}
          {!product.isInStock && (
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </div>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleAddToWishlist}
            className={`w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
              isHovered ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors duration-300" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/products/${product._id}`)
            }}
            className={`w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
              isHovered ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
            aria-label="Quick view"
          >
            <Eye className="w-5 h-5 text-gray-700 hover:text-blue-500 transition-colors duration-300" />
          </button>
        </div>

        {/* Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Enhanced Product Info */}
      <div className="p-6">
        {/* Category & Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {product.category} • {product.subCategory}
          </span>
          {product.isInStock && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              In Stock ({product.stock})
            </span>
          )}
        </div>
        
        {/* Product Name */}
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.shortDescription}
          </p>
        )}
        
        {/* Rating & Reviews */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {product.averageRating || product.ratings || 0}
            </span>
          </div>
          {product.reviewCount > 0 && (
            <span className="text-sm text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          )}
        </div>

        {/* Enhanced Price Section */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <div className="text-2xl font-bold text-gray-900">
              ₹{product.finalPrice?.toLocaleString() || (product.price * (1 - (product.discount || 0) / 100)).toLocaleString()}
            </div>
            {product.discount > 0 && (
              <div className="text-lg text-gray-500 line-through">
                ₹{product.price?.toLocaleString()}
              </div>
            )}
          </div>
          {product.discount > 0 && (
            <div className="text-sm font-medium text-green-600">
              You save ₹{((product.price * product.discount) / 100).toLocaleString()}
            </div>
          )}
        </div>

        {/* Enhanced Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.isInStock || isLoading}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform flex items-center justify-center gap-3 ${
            !product.isInStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isLoading
              ? "bg-blue-400 text-white cursor-wait"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-lg active:scale-95"
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
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

        {/* Additional Info */}
        {product.shipping?.freeShipping && (
          <div className="mt-3 text-center">
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              🚚 Free Shipping
            </span>
          </div>
        )}
      </div>

      {/* Hover Effect Glow */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} style={{ zIndex: -1 }} />
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItemToCart(item)),
  AddWishh: (item) => dispatch(AddWish(item)),
})

export default connect(null, mapDispatchToProps)(ProductPageCard)
