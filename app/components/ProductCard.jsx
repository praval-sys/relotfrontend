// components/ProductCard.jsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-shadow hover:shadow-md cursor-pointer"
      onClick={handleClick}
    >
      {/* Product image */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.images?.[0] || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
        />
      </div>

      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-xs text-gray-500 mb-2 capitalize">
          {product.category}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${index < Math.floor(product.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="text-lg font-semibold text-gray-800">
          ₹{product.price.toFixed(2)}
        </div>

        {/* Stock */}
        <div className="text-sm text-gray-500 mt-1">
          Stock: {product.stock}
        </div>
      </div>
    </div>
  );
}
