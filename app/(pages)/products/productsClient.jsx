'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Filters from '../../components/Filter';
import Pagination from '../../components/Pagination';
import {ProductsPageGrid} from '../../components/ProductsCard/ProductGrid';
import api from '../../lib/api';

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filterStats, setFilterStats] = useState(null);

  const getQueryParam = (param, defaultValue) => {
    return searchParams.get(param) || defaultValue;
  };

  // Enhanced currentFilters to include all new filter options
  const currentFilters = {
    // Category hierarchy
    category: getQueryParam('category', ''),
    subCategory: getQueryParam('subCategory', ''),
    childCategory: getQueryParam('childCategory', ''),
    
    // Basic filters
    brand: getQueryParam('brand', ''),
    status: getQueryParam('status', ''),
    featured: getQueryParam('featured', ''),
    isDigital: getQueryParam('isDigital', ''),
    
    // Price filters
    minPrice: getQueryParam('minPrice', ''),
    maxPrice: getQueryParam('maxPrice', ''),
    
    // Discount filters
    minDiscount: getQueryParam('minDiscount', ''),
    maxDiscount: getQueryParam('maxDiscount', ''),
    discount: getQueryParam('discount', ''), // For "X% or more" filters
    
    // Quality filters
    rating: getQueryParam('rating', ''),
    inStock: getQueryParam('inStock', ''),
    
    // Content filters
    tags: getQueryParam('tags', ''),
    search: getQueryParam('search', ''),
    
    // Sorting and pagination
    sort: getQueryParam('sort', 'createdAt'),
    order: getQueryParam('order', 'desc'),
    page: parseInt(getQueryParam('page', '1')),
    limit: parseInt(getQueryParam('limit', '12'))
  };

  const fetchProducts = async (filters) => {
    try {
      setLoading(true);
      
      // Build query string with all filter parameters
      const queryString = Object.entries(filters)
        .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      console.log('Fetching products with filters:', queryString);

      const response = await api.get(`/v1/products?${queryString}`);
      const result = response.data;

      if (result.success) {
        setProducts(result.data);
        setPagination(result.pagination);
        setFilterStats(result.filters);
      } else {
        console.error('Error in API response:', result.message);
        setProducts([]);
        setPagination({});
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    // Merge new filters with current filters and reset page to 1
    const updatedFilters = { 
      ...currentFilters, 
      ...newFilters, 
      page: 1 
    };

    // Remove empty values to clean up URL
    const cleanFilters = Object.fromEntries(
      Object.entries(updatedFilters).filter(([_, value]) => 
        value !== '' && value !== null && value !== undefined
      )
    );

    // Build query string
    const queryString = Object.entries(cleanFilters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Navigate with new filters
    router.push(`/products?${queryString}`);
  };

  const handlePageChange = (newPage) => {
    const updatedFilters = { ...currentFilters, page: newPage };
    
    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(updatedFilters).filter(([_, value]) => 
        value !== '' && value !== null && value !== undefined
      )
    );

    const queryString = Object.entries(cleanFilters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    router.push(`/products?${queryString}`);
  };

  const handleSortChange = (sortValue) => {
    const [sort, order] = sortValue.split('-');
    handleFilterChange({ sort, order });
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  // Get active filter count for display
  const getActiveFilterCount = () => {
    const activeFilters = Object.entries(currentFilters).filter(([key, value]) => 
      value !== '' && 
      value !== null && 
      value !== undefined && 
      !['sort', 'order', 'page', 'limit'].includes(key)
    );
    return activeFilters.length;
  };

  // Generate page title based on active filters
  const getPageTitle = () => {
    const parts = [];
    
    if (currentFilters.category) {
      const categoryDisplayNames = {
        'men': 'Men',
        'women': 'Women',
        'bags': 'Bags & Small Leather Goods',
        'fragrances': 'Fragrances'
      };
      parts.push(categoryDisplayNames[currentFilters.category] || currentFilters.category);
    }
    
    if (currentFilters.subCategory) {
      parts.push(currentFilters.subCategory.replace(/-/g, ' '));
    }
    
    if (currentFilters.childCategory) {
      parts.push(currentFilters.childCategory.replace(/-/g, ' '));
    }
    
    if (currentFilters.search) {
      parts.push(`Search: "${currentFilters.search}"`);
    }
    
    return parts.length > 0 ? parts.join(' > ') : 'All Products';
  };

  useEffect(() => {
    fetchProducts(currentFilters);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-4 lg:py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {getPageTitle()}
        </h1>
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <ol className="flex items-center space-x-2 flex-wrap">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/products" className="hover:text-blue-600">Products</a></li>
            {currentFilters.category && (
              <>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 capitalize">{currentFilters.category}</li>
              </>
            )}
            {currentFilters.subCategory && (
              <>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900">{currentFilters.subCategory.replace(/-/g, ' ')}</li>
              </>
            )}
          </ol>
        </nav>

        {/* Active Filters Summary */}
        {getActiveFilterCount() > 0 && (
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
            <span className="text-sm text-blue-800">
              {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied
            </span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-4">
            <Filters 
              currentFilters={currentFilters} 
              onFilterChange={handleFilterChange}
              filterStats={filterStats}
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-grow min-w-0">
          {/* Products Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm lg:text-base">
                {loading ? (
                  'Loading products...'
                ) : (
                  <>
                    Showing {products.length} of {pagination.totalItems || 0} products
                    {pagination.totalPages > 1 && (
                      <span className="ml-2 text-sm">
                        (Page {pagination.currentPage} of {pagination.totalPages})
                      </span>
                    )}
                  </>
                )}
              </p>
              
              {/* Category Stats */}
              {filterStats?.categoryStats && filterStats.categoryStats.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  Price range: ₹{Math.min(...filterStats.categoryStats.map(s => s.minPrice))} - 
                  ₹{Math.max(...filterStats.categoryStats.map(s => s.maxPrice))}
                </div>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 hidden sm:block">
                Sort by:
              </label>
              <select
                id="sort"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
                value={`${currentFilters.sort}-${currentFilters.order}`}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="popularity-desc">Popularity</option>
                <option value="featured-desc">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="discount-desc">Highest Discount</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(currentFilters.limit)].map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-64 lg:h-80">
                  <div className="h-32 lg:h-56 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-2 lg:p-4 space-y-2">
                    <div className="h-3 lg:h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 lg:h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <ProductsPageGrid products={products} />
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 lg:mt-12 flex justify-center">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    showInfo={true}
                    totalItems={pagination.totalItems}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 lg:py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg className="mx-auto h-12 lg:h-16 w-12 lg:w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.181C5.146 14.408 5.146 17.592 6.793 19.181A7.962 7.962 0 0112 21c2.34 0 4.5-.816 6.207-2.181C19.854 17.592 19.854 14.408 18.207 12.819z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={clearAllFilters}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
