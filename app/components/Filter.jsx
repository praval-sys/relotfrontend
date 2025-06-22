// components/Filters.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Filter as FilterIcon, ChevronDown, ChevronUp } from 'lucide-react';

export default function Filters({ currentFilters, onFilterChange, filterStats }) {
  const [categoryData, setCategoryData] = useState({
    categories: [],
    subCategories: [],
    childCategories: []
  });
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || '',
    max: currentFilters.maxPrice || ''
  });
  const [tempPriceRange, setTempPriceRange] = useState({
    min: parseInt(currentFilters.minPrice) || 0,
    max: parseInt(currentFilters.maxPrice) || 10000
  });
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    categories: true,
    subCategories: true,
    childCategories: true,
    price: true,
    ratings: true,
    availability: true,
    discount: true
  });

  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  // Initialize category data
  useEffect(() => {
    const categories = [
      { id: 1, name: "men", displayName: "Men" },
      { id: 2, name: "women", displayName: "Women" },
      { id: 3, name: "bags", displayName: "Bags & Small Leather Goods" },
      { id: 4, name: "fragrances", displayName: "Fragrances" }
    ];

    const subCategories = [
      { id: 1, name: "handbags", displayName: "Handbags", parentCategories: ["women"] },
      { id: 2, name: "perfume", displayName: "Perfume", parentCategories: ["fragrances"] },
      { id: 3, name: "body-mist", displayName: "Body Mist", parentCategories: ["fragrances"] },
      { id: 4, name: "roll-on", displayName: "Roll-on", parentCategories: ["fragrances"] },
      { id: 5, name: "fragrances-of-india", displayName: "Fragrances of India", parentCategories: ["fragrances"] },
      { id: 6, name: "wallets-and-small-leather-goods", displayName: "Wallets & Small Leather Goods", parentCategories: ["men", "women", "bags"] },
      { id: 7, name: "accessories", displayName: "Accessories", parentCategories: ["men", "women"] },
      { id: 8, name: "travel", displayName: "Travel", parentCategories: ["men", "women"] }
    ];

    const childCategories = [
      { id: 1, name: "jewelry", displayName: "Jewelry", parentSubCategories: ["accessories"] },
      { id: 2, name: "scarves", displayName: "Scarves", parentSubCategories: ["accessories"] },
      { id: 3, name: "belts", displayName: "Belts", parentSubCategories: ["accessories"] },
      { id: 4, name: "luggage", displayName: "Luggage", parentSubCategories: ["travel"] },
      { id: 5, name: "travel-accessories", displayName: "Travel Accessories", parentSubCategories: ["travel"] },
      { id: 6, name: "travel-bags", displayName: "Travel Bags", parentSubCategories: ["travel"] },
      { id: 7, name: "cardholders", displayName: "Card Holders", parentSubCategories: ["wallets-and-small-leather-goods"] },
      { id: 8, name: "keyholders", displayName: "Key Holders", parentSubCategories: ["wallets-and-small-leather-goods"] },
      { id: 9, name: "shaving-kit-bags", displayName: "Shaving Kit Bags", parentSubCategories: ["travel"] }
    ];

    setCategoryData({
      categories,
      subCategories,
      childCategories
    });
  }, []);

  // Update temp price range when filters change
  useEffect(() => {
    setTempPriceRange({
      min: parseInt(currentFilters.minPrice) || 0,
      max: parseInt(currentFilters.maxPrice) || 10000
    });
  }, [currentFilters.minPrice, currentFilters.maxPrice]);

  // Filter subcategories based on selected categories
  const getFilteredSubCategories = () => {
    if (!currentFilters.category) return categoryData.subCategories;
    return categoryData.subCategories.filter(sub => 
      sub.parentCategories.includes(currentFilters.category)
    );
  };

  // Filter child categories based on selected subcategories
  const getFilteredChildCategories = () => {
    if (!currentFilters.subCategory) return [];
    return categoryData.childCategories.filter(child => 
      child.parentSubCategories.includes(currentFilters.subCategory)
    );
  };

  // Handle checkbox changes for categories
  const handleCategoryChange = (category, checked) => {
    if (checked) {
      onFilterChange({ 
        category: category,
        subCategory: '', // Reset subcategory when category changes
        childCategory: '' // Reset child category when category changes
      });
    } else {
      onFilterChange({ 
        category: '',
        subCategory: '',
        childCategory: ''
      });
    }
  };

  const handleSubCategoryChange = (subCategory, checked) => {
    if (checked) {
      onFilterChange({ 
        subCategory: subCategory,
        childCategory: '' // Reset child category when subcategory changes
      });
    } else {
      onFilterChange({ 
        subCategory: '',
        childCategory: ''
      });
    }
  };

  const handleChildCategoryChange = (childCategory, checked) => {
    onFilterChange({ 
      childCategory: checked ? childCategory : ''
    });
  };

  // Handle price range slider
  const handlePriceSliderChange = (type, value) => {
    const newValue = parseInt(value);
    setTempPriceRange(prev => ({
      ...prev,
      [type]: newValue
    }));
  };

  const applyPriceFilter = () => {
    onFilterChange({
      minPrice: tempPriceRange.min > 0 ? tempPriceRange.min.toString() : '',
      maxPrice: tempPriceRange.max < 10000 ? tempPriceRange.max.toString() : ''
    });
  };

  const handleRatingChange = (rating, checked) => {
    onFilterChange({ rating: checked ? rating.toString() : '' });
  };

  const handleDiscountChange = (discount, checked) => {
    onFilterChange({ discount: checked ? discount.toString() : '' });
  };

  const handleAvailabilityChange = (checked) => {
    onFilterChange({ inStock: checked ? 'true' : '' });
  };

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' });
    setTempPriceRange({ min: 0, max: 10000 });
    onFilterChange({});
    setIsOpen(false);
  };

  const closeFilters = () => {
    setIsOpen(false);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    const activeFilters = Object.entries(currentFilters).filter(([key, value]) => 
      value !== '' && 
      value !== null && 
      value !== undefined && 
      !['sort', 'order', 'page', 'limit'].includes(key)
    );
    return activeFilters.length;
  };

  const FilterContent = () => (
    <div className="bg-white">
      {/* Categories */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full py-2 text-left"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Categories</h3>
          {expanded.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expanded.categories && (
          <div className="mt-3 space-y-3">
            {categoryData.categories.map(category => (
              <label key={category.id} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  checked={currentFilters.category === category.name}
                  onChange={(e) => handleCategoryChange(category.name, e.target.checked)}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {category.displayName}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sub Categories */}
      {currentFilters.category && getFilteredSubCategories().length > 0 && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <button
            className="flex justify-between items-center w-full py-2 text-left"
            onClick={() => toggleSection('subCategories')}
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Sub Categories</h3>
            {expanded.subCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {expanded.subCategories && (
            <div className="mt-3 space-y-3 pl-4">
              {getFilteredSubCategories().map(subCategory => (
                <label key={subCategory.id} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="subCategory"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    checked={currentFilters.subCategory === subCategory.name}
                    onChange={(e) => handleSubCategoryChange(subCategory.name, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {subCategory.displayName}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Child Categories */}
      {currentFilters.subCategory && getFilteredChildCategories().length > 0 && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <button
            className="flex justify-between items-center w-full py-2 text-left"
            onClick={() => toggleSection('childCategories')}
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Specific Items</h3>
            {expanded.childCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {expanded.childCategories && (
            <div className="mt-3 space-y-3 pl-6">
              {getFilteredChildCategories().map(childCategory => (
                <label key={childCategory.id} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={currentFilters.childCategory === childCategory.name}
                    onChange={(e) => handleChildCategoryChange(childCategory.name, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {childCategory.displayName}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full py-2 text-left"
          onClick={() => toggleSection('price')}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Price Range</h3>
          {expanded.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expanded.price && (
          <div className="mt-4 space-y-4">
            {/* Price Display */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">₹{tempPriceRange.min}</span>
              <span className="text-sm font-medium text-gray-700">₹{tempPriceRange.max}</span>
            </div>

            {/* Dual Range Slider */}
            <div className="relative">
              <div className="relative h-2 bg-gray-200 rounded-lg">
                <div 
                  className="absolute h-2 bg-blue-500 rounded-lg"
                  style={{
                    left: `${(tempPriceRange.min / 10000) * 100}%`,
                    width: `${((tempPriceRange.max - tempPriceRange.min) / 10000) * 100}%`
                  }}
                />
              </div>
              
              <input
                ref={minPriceRef}
                type="range"
                min="0"
                max="10000"
                step="100"
                value={tempPriceRange.min}
                onChange={(e) => handlePriceSliderChange('min', e.target.value)}
                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                style={{ top: '0' }}
              />
              
              <input
                ref={maxPriceRef}
                type="range"
                min="0"
                max="10000"
                step="100"
                value={tempPriceRange.max}
                onChange={(e) => handlePriceSliderChange('max', e.target.value)}
                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                style={{ top: '0' }}
              />
            </div>

            {/* Manual Input */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="10000"
                  step="100"
                  value={tempPriceRange.min}
                  onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
              </div>
              <span className="text-gray-400 text-sm">to</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="10000"
                  step="100"
                  value={tempPriceRange.max}
                  onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 10000 }))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Max"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
              </div>
            </div>

            <button
              onClick={applyPriceFilter}
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Price Filter
            </button>
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full py-2 text-left"
          onClick={() => toggleSection('ratings')}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Customer Ratings</h3>
          {expanded.ratings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expanded.ratings && (
          <div className="mt-3 space-y-3">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  checked={currentFilters.rating === rating.toString()}
                  onChange={(e) => handleRatingChange(rating, e.target.checked)}
                />
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-700">{rating}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-500">& above</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full py-2 text-left"
          onClick={() => toggleSection('availability')}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Availability</h3>
          {expanded.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expanded.availability && (
          <div className="mt-3">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked={currentFilters.inStock === 'true'}
                onChange={(e) => handleAvailabilityChange(e.target.checked)}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full py-2 text-left"
          onClick={() => toggleSection('discount')}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Discount</h3>
          {expanded.discount ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expanded.discount && (
          <div className="mt-3 space-y-3">
            {[80, 60, 40, 20].map(discount => (
              <label key={discount} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  checked={currentFilters.discount === discount.toString()}
                  onChange={(e) => handleDiscountChange(discount, e.target.checked)}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {discount}% or more
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear All Filters */}
      <div className="pt-4">
        <button
          onClick={clearAllFilters}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Clear All Filters ({getActiveFilterCount()})
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FilterIcon className="h-5 w-5 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4">
            <FilterContent />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeFilters} />
          <div className="fixed inset-y-0 left-0 max-w-sm w-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={closeFilters}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              <div className="p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for Range Slider */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
}