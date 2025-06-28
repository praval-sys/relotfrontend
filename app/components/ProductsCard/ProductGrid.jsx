"use client"
import HomeProductCard from "./HomeProductCard"
import ProductPageCard from "./ProductPageCard"

export function HomeProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <HomeProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

// ✅ IMPROVED: Better responsive grid - 4 cols on large screens, 2 on medium, 1 on small
export function ProductsPageGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductPageCard key={product._id} product={product} />
      ))}
    </div>
  )
}
