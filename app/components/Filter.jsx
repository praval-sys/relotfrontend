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
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.categories);
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
    <div>
      {/* Categories filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="font-semibold uppercase text-sm">Categories</h3>
          <svg 
            className={`w-4 h-4 transform ${expanded.categories ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expanded.categories && (
          <div className="pl-2 space-y-1">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <button
                  className={`block py-1 text-sm hover:text-blue-600 ${
                    currentFilters.category === category.name ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price range filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('price')}
        >
          <h3 className="font-semibold uppercase text-sm">Price</h3>
          <svg 
            className={`w-4 h-4 transform ${expanded.price ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expanded.price && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  className="w-full pl-6 pr-2 py-1 border rounded text-sm"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              </div>
              <span className="text-gray-400">to</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  className="w-full pl-6 pr-2 py-1 border rounded text-sm"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700"
              onClick={handlePriceChange}
            >
              Apply
            </button>
          </div>
        )}
      </div>
      
      {/* Customer Ratings filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('ratings')}
        >
          <h3 className="font-semibold uppercase text-sm">Customer Ratings</h3>
          <svg 
            className={`w-4 h-4 transform ${expanded.ratings ? 'rotate-180' : ''}`} 
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
                  className="mr-2"
                  checked={currentFilters.rating === rating.toString()}
                  onChange={() => handleRatingChange(
                    currentFilters.rating === rating.toString() ? '' : rating.toString()
                  )}
                />
                <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                  {rating}
                  <svg className="w-4 h-4 text-yellow-400 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  & above
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Availability */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('availability')}
        >
          <h3 className="font-semibold uppercase text-sm">Availability</h3>
          <svg 
            className={`w-4 h-4 transform ${expanded.availability ? 'rotate-180' : ''}`} 
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
                className="mr-2"
                checked={currentFilters.inStock === 'true'}
                onChange={() => onFilterChange({ 
                  inStock: currentFilters.inStock === 'true' ? '' : 'true' 
                })}
              />
              <label htmlFor="in-stock" className="text-sm">In Stock</label>
            </div>
          </div>
        )}
      </div>
      
      {/* Discount */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('discount')}
        >
          <h3 className="font-semibold uppercase text-sm">Discount</h3>
          <svg 
            className={`w-4 h-4 transform ${expanded.discount ? 'rotate-180' : ''}`} 
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
                  className="mr-2"
                  checked={currentFilters.discount === discount.toString()}
                  onChange={() => onFilterChange({ 
                    discount: currentFilters.discount === discount.toString() ? '' : discount.toString() 
                  })}
                />
                <label htmlFor={`discount-${discount}`} className="text-sm">{discount}% or more</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}