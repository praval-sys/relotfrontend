"use client"

import { Search } from "lucide-react"

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <form onSubmit={handleSearch} className="w-full flex items-center relative"> 
      <input
        type="text"
        // Changed placeholder text
        placeholder="Search products..."
        // Updated styling for background, rounded corners, border, and padding
        className="w-full px-4 py-2 pr-10  bg-gray-100 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 text-gray-800 placeholder-gray-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Moved the search icon inside the input container */}
      <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
        <Search className="h-6 w-6" />
      </button>
    </form>
  )
}

export default SearchBar
