// components/Filters.jsx
'use client';

import { useState, useEffect } from 'react';

export default function Filters({ currentFilters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || '',
    max: currentFilters.maxPrice || ''
  });
  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    ratings: true,
    availability: false,
    discount: false,
    suitableFor: false
  });

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Convert string array to objects with proper structure
        const categoriesData = [
          "men", "women", "travel", "handbags", "smallleathergoods", 
          "accessories", "bags", "fragrances"
        ];

        // Map to objects with id and name properties
        const categoriesWithIds = categoriesData.map((category, index) => ({
          id: index + 1,
          name: category,
          displayName: category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')
        }));

        setCategories(categoriesWithIds);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    onFilterChange({ category: category === currentFilters.category ? '' : category });
  };

  const handlePriceChange = () => {
    onFilterChange({
      minPrice: priceRange.min || '',
      maxPrice: priceRange.max || ''
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ rating });
  };

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Categories filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="font-semibold uppercase text-sm text-gray-800">Categories</h3>
          <svg 
            className={`w-4 h-4 transform transition-transform ${expanded.categories ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expanded.categories && (
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <button
                  className={`block py-2 px-3 text-sm rounded-md transition-colors w-full text-left hover:bg-gray-100 ${
                    currentFilters.category === category.name 
                      ? 'bg-blue-50 text-blue-600 font-medium border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.displayName}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price range filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('price')}
        >
          <h3 className="font-semibold uppercase text-sm text-gray-800">Price Range</h3>
          <svg 
            className={`w-4 h-4 transform transition-transform ${expanded.price ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expanded.price && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
              </div>
              <span className="text-gray-400 text-sm">to</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={handlePriceChange}
            >
              Apply Price Filter
            </button>
          </div>
        )}
      </div>
      
      {/* Customer Ratings filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('ratings')}
        >
          <h3 className="font-semibold uppercase text-sm text-gray-800">Customer Ratings</h3>
          <svg 
            className={`w-4 h-4 transform transition-transform ${expanded.ratings ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expanded.ratings && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <input
                  type="checkbox"
                  id={`rating-${rating}`}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={currentFilters.rating === rating.toString()}
                  onChange={() => handleRatingChange(
                    currentFilters.rating === rating.toString() ? '' : rating.toString()
                  )}
                />
                <label htmlFor={`rating-${rating}`} className="text-sm flex items-center cursor-pointer">
                  <span className="mr-1">{rating}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1">& above</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Availability */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('availability')}
        >
          <h3 className="font-semibold uppercase text-sm text-gray-800">Availability</h3>
          <svg 
            className={`w-4 h-4 transform transition-transform ${expanded.availability ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expanded.availability && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="in-stock"
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentFilters.inStock === 'true'}
                onChange={() => onFilterChange({ 
                  inStock: currentFilters.inStock === 'true' ? '' : 'true' 
                })}
              />
              <label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock Only</label>
            </div>
          </div>
        )}
      </div>
      
      {/* Discount */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('discount')}
        >
          <h3 className="font-semibold uppercase text-sm text-gray-800">Discount</h3>
          <svg 
            className={`w-4 h-4 transform transition-transform ${expanded.discount ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expanded.discount && (
          <div className="space-y-2">
            {[80, 60, 40, 20].map(discount => (
              <div key={discount} className="flex items-center">
                <input
                  type="checkbox"
                  id={`discount-${discount}`}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={currentFilters.discount === discount.toString()}
                  onChange={() => onFilterChange({ 
                    discount: currentFilters.discount === discount.toString() ? '' : discount.toString() 
                  })}
                />
                <label htmlFor={`discount-${discount}`} className="text-sm cursor-pointer">
                  {discount}% or more
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear All Filters */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => onFilterChange({})}
          className="w-full bg-gray-100 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}