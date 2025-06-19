import ProductDetails from '../../../components/Product/ProductDetails';
import ProductReviews from '../../../components/Product/ProductReview';
import AddReview from '../../../components/Product/AddReview';
import { getProductById } from '../../../lib/products';

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const productData = await getProductById(resolvedParams.slug);
  const product = productData?.data;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you are looking for does not exist or is unavailable.</p>
          <a href="/shop" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
            Go to Shop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Section 1: Product Details (Two-column layout with sticky media) */}
      <ProductDetails product={product} />

      {/* Section 2: Reviews & Recommendations (Scrollable section) */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Reviews Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
              <ProductReviews productId={product.id} />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Write a Review</h2>
              <AddReview productId={product.id} />
            </div>
          </div>

          {/* Recommended Products Placeholder */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">Recommended products will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
