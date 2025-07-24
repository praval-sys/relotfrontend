"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, FilterIcon, ChevronDown, ChevronUp } from "lucide-react"

export default function Filters({ currentFilters, onFilterChange, filterStats }) {
  const [categoryData, setCategoryData] = useState({
    categories: [],
    subCategories: [],
    childCategories: [],
  })

  const [tempPriceRange, setTempPriceRange] = useState({
    min: Number.parseInt(currentFilters.minPrice) || 0,
    max: Number.parseInt(currentFilters.maxPrice) || 10000,
  })

  const [isOpen, setIsOpen] = useState(false)
  const [expanded, setExpanded] = useState({
    categories: true,
    subCategories: true,
    childCategories: true,
    price: true,
    ratings: true,
    availability: true,
    discount: true,
  })

  // Improved drag state management
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragType: null, // 'min' or 'max'
    startX: 0,
    startValue: 0,
  })

  const sliderRef = useRef(null)
  const minThumbRef = useRef(null)
  const maxThumbRef = useRef(null)

  // Initialize category data
  useEffect(() => {
    const categories = [
      { id: 1, name: "men", displayName: "Men" },
      { id: 2, name: "women", displayName: "Women" },
      { id: 3, name: "bags", displayName: "Bags & Small Leather Goods" },
      { id: 4, name: "fragrances", displayName: "Fragrances" },
    ]

    const subCategories = [
      { id: 1, name: "handbags", displayName: "Handbags", parentCategories: ["women"] },
      { id: 2, name: "perfume", displayName: "Perfume", parentCategories: ["fragrances"] },
      { id: 3, name: "body-mist", displayName: "Body Mist", parentCategories: ["fragrances"] },
      { id: 4, name: "roll-on", displayName: "Roll-on", parentCategories: ["fragrances"] },
      { id: 5, name: "fragrances-of-india", displayName: "Fragrances of India", parentCategories: ["fragrances"] },
      {
        id: 6,
        name: "wallets-and-small-leather-goods",
        displayName: "Wallets & Small Leather Goods",
        parentCategories: ["men", "women", "bags"],
      },
      { id: 7, name: "accessories", displayName: "Accessories", parentCategories: ["men", "women"] },
      { id: 8, name: "travel", displayName: "Travel", parentCategories: ["men", "women"] },
    ]

    const childCategories = [
      { id: 1, name: "jewelry", displayName: "Jewelry", parentSubCategories: ["accessories"] },
      { id: 2, name: "scarves", displayName: "Scarves", parentSubCategories: ["accessories"] },
      { id: 3, name: "belts", displayName: "Belts", parentSubCategories: ["accessories"] },
      { id: 4, name: "luggage", displayName: "Luggage", parentSubCategories: ["travel"] },
      { id: 5, name: "travel-accessories", displayName: "Travel Accessories", parentSubCategories: ["travel"] },
      { id: 6, name: "travel-bags", displayName: "Travel Bags", parentSubCategories: ["travel"] },
      {
        id: 7,
        name: "cardholders",
        displayName: "Card Holders",
        parentSubCategories: ["wallets-and-small-leather-goods"],
      },
      {
        id: 8,
        name: "keyholders",
        displayName: "Key Holders",
        parentSubCategories: ["wallets-and-small-leather-goods"],
      },
      { id: 9, name: "shaving-kit-bags", displayName: "Shaving Kit Bags", parentSubCategories: ["travel"] },
    ]

    setCategoryData({
      categories,
      subCategories,
      childCategories,
    })
  }, [])

  // Update temp price range when filters change
  useEffect(() => {
    setTempPriceRange({
      min: Number.parseInt(currentFilters?.minPrice) || 0,
      max: Number.parseInt(currentFilters?.maxPrice) || 10000,
    })
  }, [currentFilters?.minPrice, currentFilters?.maxPrice])

  // Improved slider value calculation
  const getSliderValue = useCallback((clientX) => {
    if (!sliderRef.current) return 0

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(percentage * 10000)
  }, [])

  // Improved mouse event handlers
  const handleMouseDown = useCallback(
    (e, type) => {
      e.preventDefault()
      e.stopPropagation()
      
      const value = type === "min" ? tempPriceRange.min : tempPriceRange.max

      setDragState({
        isDragging: true,
        dragType: type,
        startX: e.clientX,
        startValue: value,
      })

      // Prevent text selection during drag
      document.body.style.userSelect = 'none'
    },
    [tempPriceRange],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragState.isDragging || !sliderRef.current) return

      const newValue = getSliderValue(e.clientX)

      setTempPriceRange((prev) => {
        if (dragState.dragType === "min") {
          const maxAllowed = prev.max - 100
          return {
            ...prev,
            min: Math.max(0, Math.min(newValue, maxAllowed)),
          }
        } else {
          const minAllowed = prev.min + 100
          return {
            ...prev,
            max: Math.min(10000, Math.max(newValue, minAllowed)),
          }
        }
      })
    },
    [dragState, getSliderValue],
  )

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      // Apply the filter when dragging ends
      onFilterChange?.({
        minPrice: tempPriceRange.min > 0 ? tempPriceRange.min.toString() : "",
        maxPrice: tempPriceRange.max < 10000 ? tempPriceRange.max.toString() : "",
      })
    }

    setDragState({
      isDragging: false,
      dragType: null,
      startX: 0,
      startValue: 0,
    })

    // Restore text selection
    document.body.style.userSelect = ''
  }, [dragState, tempPriceRange, onFilterChange])

  // Improved touch event handlers
  const handleTouchStart = useCallback(
    (e, type) => {
      e.preventDefault()
      e.stopPropagation()
      
      const touch = e.touches[0]
      const value = type === "min" ? tempPriceRange.min : tempPriceRange.max

      setDragState({
        isDragging: true,
        dragType: type,
        startX: touch.clientX,
        startValue: value,
      })
    },
    [tempPriceRange],
  )

  const handleTouchMove = useCallback(
    (e) => {
      if (!dragState.isDragging || !sliderRef.current) return
      e.preventDefault()

      const touch = e.touches[0]
      const newValue = getSliderValue(touch.clientX)

      setTempPriceRange((prev) => {
        if (dragState.dragType === "min") {
          const maxAllowed = prev.max - 100
          return {
            ...prev,
            min: Math.max(0, Math.min(newValue, maxAllowed)),
          }
        } else {
          const minAllowed = prev.min + 100
          return {
            ...prev,
            max: Math.min(10000, Math.max(newValue, minAllowed)),
          }
        }
      })
    },
    [dragState, getSliderValue],
  )

  const handleTouchEnd = useCallback(() => {
    if (dragState.isDragging) {
      onFilterChange?.({
        minPrice: tempPriceRange.min > 0 ? tempPriceRange.min.toString() : "",
        maxPrice: tempPriceRange.max < 10000 ? tempPriceRange.max.toString() : "",
      })
    }

    setDragState({
      isDragging: false,
      dragType: null,
      startX: 0,
      startValue: 0,
    })
  }, [dragState, tempPriceRange, onFilterChange])

  // Track click on slider track
  const handleSliderClick = useCallback((e) => {
    if (dragState.isDragging) return
    
    const newValue = getSliderValue(e.clientX)
    const { min, max } = tempPriceRange
    const midPoint = (min + max) / 2

    // Determine which thumb to move based on click position
    if (newValue < midPoint) {
      // Move min thumb
      const newMin = Math.max(0, Math.min(newValue, max - 100))
      setTempPriceRange(prev => ({ ...prev, min: newMin }))
      onFilterChange?.({
        minPrice: newMin > 0 ? newMin.toString() : "",
        maxPrice: max < 10000 ? max.toString() : "",
      })
    } else {
      // Move max thumb
      const newMax = Math.min(10000, Math.max(newValue, min + 100))
      setTempPriceRange(prev => ({ ...prev, max: newMax }))
      onFilterChange?.({
        minPrice: min > 0 ? min.toString() : "",
        maxPrice: newMax < 10000 ? newMax.toString() : "",
      })
    }
  }, [dragState.isDragging, getSliderValue, tempPriceRange, onFilterChange])

  // Global event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Filter subcategories based on selected categories
  const getFilteredSubCategories = () => {
    if (!currentFilters?.category) return categoryData.subCategories
    return categoryData.subCategories.filter((sub) => sub.parentCategories.includes(currentFilters.category))
  }

  // Filter child categories based on selected subcategories
  const getFilteredChildCategories = () => {
    if (!currentFilters?.subCategory) return []
    return categoryData.childCategories.filter((child) =>
      child.parentSubCategories.includes(currentFilters.subCategory),
    )
  }

  // Handle checkbox changes for categories
  const handleCategoryChange = (category, checked) => {
    if (checked) {
      onFilterChange?.({
        category: category,
        subCategory: "",
        childCategory: "",
      })
    } else {
      onFilterChange?.({
        category: "",
        subCategory: "",
        childCategory: "",
      })
    }
  }

  const handleSubCategoryChange = (subCategory, checked) => {
    if (checked) {
      onFilterChange?.({
        subCategory: subCategory,
        childCategory: "",
      })
    } else {
      onFilterChange?.({
        subCategory: "",
        childCategory: "",
      })
    }
  }

  const handleChildCategoryChange = (childCategory, checked) => {
    onFilterChange?.({ childCategory: checked ? childCategory : "" })
  }

  const handleManualPriceChange = (type, value) => {
    const numValue = Number.parseInt(value) || 0
    setTempPriceRange((prev) => {
      if (type === "min") {
        return { ...prev, min: Math.max(0, Math.min(numValue, prev.max - 100)) }
      } else {
        return { ...prev, max: Math.min(10000, Math.max(numValue, prev.min + 100)) }
      }
    })
  }

  const handleManualPriceCommit = () => {
    onFilterChange?.({
      minPrice: tempPriceRange.min > 0 ? tempPriceRange.min.toString() : "",
      maxPrice: tempPriceRange.max < 10000 ? tempPriceRange.max.toString() : "",
    })
  }

  const handleRatingChange = (rating, checked) => {
    onFilterChange?.({ rating: checked ? rating.toString() : "" })
  }

  const handleDiscountChange = (discount, checked) => {
    onFilterChange?.({ discount: checked ? discount.toString() : "" })
  }

  const handleAvailabilityChange = (checked) => {
    onFilterChange?.({ inStock: checked ? "true" : "" })
  }

  const toggleSection = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const clearAllFilters = () => {
    setTempPriceRange({ min: 0, max: 10000 })

    onFilterChange?.({
      category: "",
      subCategory: "",
      childCategory: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      discount: "",
      inStock: "",
      sort: currentFilters?.sort || "",
      order: currentFilters?.order || "",
      page: "1",
      limit: currentFilters?.limit || "",
    })

    setIsOpen(false)
  }

  const closeFilters = () => {
    setIsOpen(false)
  }

  const getActiveFilterCount = () => {
    const activeFilters = Object.entries(currentFilters || {}).filter(
      ([key, value]) =>
        value !== "" && value !== null && value !== undefined && !["sort", "order", "page", "limit"].includes(key),
    )
    return activeFilters.length
  }

  const FilterContent = () => (
    <div className="bg-white">
      {/* Categories */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full py-2 text-left"
          onClick={() => toggleSection("categories")}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Categories</h3>
          {expanded.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expanded.categories && (
          <div className="mt-3 space-y-3">
            {categoryData.categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  checked={currentFilters?.category === category.name}
                  onChange={(e) => handleCategoryChange(category.name, e.target.checked)}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{category.displayName}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sub Categories */}
      {currentFilters?.category && getFilteredSubCategories().length > 0 && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <button
            className="flex justify-between items-center w-full py-2 text-left"
            onClick={() => toggleSection("subCategories")}
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Sub Categories</h3>
            {expanded.subCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expanded.subCategories && (
            <div className="mt-3 space-y-3 pl-4">
              {getFilteredSubCategories().map((subCategory) => (
                <label key={subCategory.id} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="subCategory"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    checked={currentFilters?.subCategory === subCategory.name}
                    onChange={(e) => handleSubCategoryChange(subCategory.name, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{subCategory.displayName}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Child Categories */}
      {currentFilters?.subCategory && getFilteredChildCategories().length > 0 && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <button
            className="flex justify-between items-center w-full py-2 text-left"
            onClick={() => toggleSection("childCategories")}
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Specific Items</h3>
            {expanded.childCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expanded.childCategories && (
            <div className="mt-3 space-y-3 pl-6">
              {getFilteredChildCategories().map((childCategory) => (
                <label key={childCategory.id} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={currentFilters?.childCategory === childCategory.name}
                    onChange={(e) => handleChildCategoryChange(childCategory.name, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{childCategory.displayName}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Improved Draggable Price Range */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full py-2 text-left"
          onClick={() => toggleSection("price")}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Price Range</h3>
          {expanded.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expanded.price && (
          <div className="mt-4 space-y-4">
            {/* Price Display */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">₹{tempPriceRange.min.toLocaleString()}</span>
              <span className="text-sm font-medium text-gray-700">₹{tempPriceRange.max.toLocaleString()}</span>
            </div>

            {/* Improved Custom Draggable Dual Range Slider */}
            <div className="relative px-3 py-6 select-none">
              <div 
                ref={sliderRef} 
                className="relative h-2 bg-gray-200 rounded-lg cursor-pointer"
                onClick={handleSliderClick}
              >
                {/* Active range */}
                <div
                  className="absolute h-2 bg-blue-500 rounded-lg transition-all duration-100 ease-out"
                  style={{
                    left: `${(tempPriceRange.min / 10000) * 100}%`,
                    width: `${((tempPriceRange.max - tempPriceRange.min) / 10000) * 100}%`,
                  }}
                />

                {/* Min thumb */}
                <div
                  ref={minThumbRef}
                  className={`absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-grab transform -translate-y-2 transition-all duration-150 ease-out z-10 ${
                    dragState.isDragging && dragState.dragType === "min"
                      ? "scale-125 cursor-grabbing shadow-xl border-blue-600"
                      : "hover:scale-110 hover:border-blue-600"
                  }`}
                  style={{ left: `calc(${(tempPriceRange.min / 10000) * 100}% - 12px)` }}
                  onMouseDown={(e) => handleMouseDown(e, "min")}
                  onTouchStart={(e) => handleTouchStart(e, "min")}
                />

                {/* Max thumb */}
                <div
                  ref={maxThumbRef}
                  className={`absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-grab transform -translate-y-2 transition-all duration-150 ease-out z-10 ${
                    dragState.isDragging && dragState.dragType === "max"
                      ? "scale-125 cursor-grabbing shadow-xl border-blue-600"
                      : "hover:scale-110 hover:border-blue-600"
                  }`}
                  style={{ left: `calc(${(tempPriceRange.max / 10000) * 100}% - 12px)` }}
                  onMouseDown={(e) => handleMouseDown(e, "max")}
                  onTouchStart={(e) => handleTouchStart(e, "max")}
                />
              </div>

              {/* Value tooltips during drag */}
              {dragState.isDragging && (
                <>
                  {dragState.dragType === "min" && (
                    <div
                      className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded-md transform -translate-x-1/2 z-20"
                      style={{ left: `${(tempPriceRange.min / 10000) * 100}%` }}
                    >
                      ₹{tempPriceRange.min.toLocaleString()}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                  {dragState.dragType === "max" && (
                    <div
                      className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded-md transform -translate-x-1/2 z-20"
                      style={{ left: `${(tempPriceRange.max / 10000) * 100}%` }}
                    >
                      ₹{tempPriceRange.max.toLocaleString()}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </>
              )}
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
                  onChange={(e) => handleManualPriceChange("min", e.target.value)}
                  onBlur={handleManualPriceCommit}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualPriceCommit()}
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
                  onChange={(e) => handleManualPriceChange("max", e.target.value)}
                  onBlur={handleManualPriceCommit}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualPriceCommit()}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Max"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full py-2 text-left"
          onClick={() => toggleSection("ratings")}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Customer Ratings</h3>
          {expanded.ratings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expanded.ratings && (
          <div className="mt-3 space-y-3">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  checked={currentFilters?.rating === rating.toString()}
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
          onClick={() => toggleSection("availability")}
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
                checked={currentFilters?.inStock === "true"}
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
          onClick={() => toggleSection("discount")}
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Discount</h3>
          {expanded.discount ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expanded.discount && (
          <div className="mt-3 space-y-3">
            {[80, 60, 40, 20].map((discount) => (
              <label key={discount} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  checked={currentFilters?.discount === discount.toString()}
                  onChange={(e) => handleDiscountChange(discount, e.target.checked)}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{discount}% or more</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear All Filters */}
      <div className="pt-4">
        <button
          onClick={clearAllFilters}
          className="w-full bg-red-50 text-red-700 py-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors border border-red-200"
          disabled={getActiveFilterCount() === 0}
        >
          Clear All Filters ({getActiveFilterCount()})
        </button>
      </div>
    </div>
  )

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
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">{getActiveFilterCount()}</span>
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
              <button onClick={closeFilters} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
    </>
  )
}