"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { connect } from "react-redux"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import toast from "react-hot-toast"
import { addItemToCart } from "../../redux/reducer/cartReducer"
import { AddWish } from "../../redux/reducer/wishSlice"

function HomeProductCard({ product, addItem, AddWishh }) {
  const router = useRouter()

  const handleClick = (e) => {
    if (e.target.closest("button")) return
    router.push(`/products/${product._id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(product)
    toast.success("Added to cart!")
  }

  const handleAddToWishlist = (e) => {
    e.stopPropagation()
    AddWishh(product)
    toast.success("Added to wishlist!")
  }

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200 cursor-pointer relative group"
      onClick={handleClick}
    >
      {/* Product image with overlay actions */}
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        <Image
          src={product.images?.[0] || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300">
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/products/${product._id}`)
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="View product"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Stock badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Out of stock
          </div>
        )}
      </div>

      <div className="p-3">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1 capitalize">{product.category}</p>

        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-2">{product.name}</h3>

        {/* Price */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-base font-semibold text-gray-900">₹{product.price.toFixed(2)}</div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-sm transition-colors ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.stock === 0 ? "Out of stock" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (item) => dispatch(addItemToCart(item)),
    AddWishh: (item) => dispatch(AddWish(item)),
  }
}

export default connect(null, mapDispatchToProps)(HomeProductCard)
