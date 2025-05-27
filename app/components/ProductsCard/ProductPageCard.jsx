"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { connect } from "react-redux"
import { ShoppingCart, Heart, Star } from "lucide-react"
import toast from "react-hot-toast"
import { addItemToCart } from "../../redux/actions/cartActions"
import { AddWish } from "../../redux/reducer/wishSlice"
import { addToWishlist } from "../../lib/wishlist"
import { addToCart } from "../../lib/cart"


function ProductPageCard({ product, addItem, AddWishh }) {
  const router = useRouter()
  const rating = product.ratings

  const handleClick = (e) => {
    if (e.target.closest("button")) return
    router.push(`/products/${product._id}`)
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    
    // Format product data for cart
    const cartData = {
    products: [{
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || product.image || '/placeholder.png'
    }]
  }
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || product.image || '/placeholder.png'
  }
    try {
      const response = await addToCart(cartData)
      
      if (response.success) {
        // Backend success - item added
        addItem(cartItem)
        toast.success(response.message || "Added to cart!")
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // User is not logged in - just update Redux
        addItem(cartItem)
        toast.success("Added to cart!")
        return
      }
      
      if (error.response?.status === 400) {
        // Item exists or other validation error
        toast.error(error.response.data.message || "Failed to add to cart")
        return
      }

      // Other errors
      toast.error("Failed to add to cart. Please try again.")
      console.error("Cart error:", error)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.stopPropagation()
    
    // Format product data for wishlist
    const wishlistItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || '/placeholder.png'
    }

    try {
      // Try to add to backend first
      const response = await addToWishlist(wishlistItem)
      
      if (response.success) {
        // Backend success - item added
        AddWishh(wishlistItem)
        toast.success(response.message || "Added to wishlist!")
        return
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // User is not logged in - just update Redux
        AddWishh(wishlistItem)
        toast.success("Added to wishlist!")
        return
      } 
      
      if (error.response?.status === 400 && error.response?.data?.message === "Item already in wishlist") {
        // Item already exists
        toast.error("Item is already in your wishlist!")
        return
      }

      // Other errors
      toast.error("Failed to add to wishlist. Please try again.")
      console.error("Wishlist error:", error)
    }
  }


  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-square">
        <Image
          src={product.images?.[0] || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onClick={handleClick}
          unoptimized
        />
        <button
          onClick={handleAddToWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5 text-gray-700" />
        </button>
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Out of stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1 capitalize">{product.category}</div>
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{rating}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-gray-900">₹{product.price.toFixed(2)}</div>
          {product.stock > 0 && (
            <span className="text-sm text-green-600">In Stock</span>
          )}
        </div>

        {/* Actions */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{product.stock === 0 ? "Out of stock" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItemToCart(item)),
  AddWishh: (item) => dispatch(AddWish(item)),
})

export default connect(null, mapDispatchToProps)(ProductPageCard)
