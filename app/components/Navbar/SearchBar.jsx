"use client"

import { Search } from "lucide-react"

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <form onSubmit={handleSearch} className="w-full flex">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Store"
          className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-red-600 text-white px-4 rounded-r-full hover:bg-red-700 transition-colors">
        <Search className="h-5 w-5" />
      </button>
    </form>
  )
}

export default SearchBar
