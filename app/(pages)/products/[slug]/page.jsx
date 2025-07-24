

import ProductDetails from '../../../components/Product/ProductDetails';
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

  return <ProductDetails product={product} />;
}
