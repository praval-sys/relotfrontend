// app/(pages)/products/page.jsx
import { Suspense } from 'react';
import ProductsClient from './productsClient';

export default function ProductsPage() {

  
  return (
    <Suspense fallback={<div className=" text-center py-12">Loading...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
