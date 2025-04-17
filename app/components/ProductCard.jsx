// // components/ProductCard.jsx
// 'use client';

// import { useRouter } from 'next/navigation';
// import Image from 'next/image';

// export default function ProductCard({ product }) {
//   const router = useRouter();
  
//   const handleClick = () => {
//     router.push(`/products/${product.id}`);
//   };
  
//   // Calculate discount percentage
//   const discountPercentage = product.originalPrice && product.price < product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : 0;

//   return (
//     <div 
//       className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-shadow hover:shadow-md cursor-pointer relative"
//       onClick={handleClick}
//     >
//       {/* Wishlist button */}
//       <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm z-10">
//         <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//         </svg>
//       </button>
      
//       {/* Product image */}
//       <div className="relative h-48 bg-gray-100">
//         <Image 
//           src={product.imageUrl || '/placeholder-product.jpg'} 
//           alt={product.name}
//           fill
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           className="object-contain"
//         />
//       </div>
      
//       {/* Product details */}
//       <div className="p-4">
//         {/* Rating */}
//         <div className="flex items-center mb-1">
//           <div className="flex">
//             {[...Array(5)].map((_, index) => (
//               <svg 
//                 key={index}
//                 className={`w-4 h-4 ${index < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
//                 fill="currentColor" 
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             ))}
//           </div>
//           <span className="text-xs text-gray-500 ml-1">
//             ({product.reviewCount || 0})
//           </span>
//         </div>
        
//         {/* Title */}
//         <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10">
//           {product.name}
//         </h3>
        
//         {/* Category/Color */}
//         <p className="text-xs text-gray-500 mt-1 capitalize">
//           {product.color}, {product.category}
//         </p>
        
//         {/* Price */}
//         <div className="mt-2 flex items-center">
//           <span className="text-lg font-semibold">₹{product.price}</span>
          
//           {discountPercentage > 0 && (
//             <>
//               <span className="text-sm text-gray-500 line-through ml-2">
//                 ₹{product.originalPrice}
//               </span>
//               <span className="text-xs text-green-600 ml-2">
//                 {discountPercentage}% off
//               </span>
//             </>
//           )}
//         </div>
        
//         {/* Deal badge */}
//         {product.isHotDeal && (
//           <div className="mt-2">
//             <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
//               Hot Deal
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


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

      {/* Rating and Price */}
      <div className="p-4">
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
          ₹{product.price}
        </div>
      </div>
    </div>
  );
}
