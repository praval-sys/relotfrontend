"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"

const LanguageSelector = ({ currentLanguage, languages, handleLanguageChange, isDropdownOpen, setIsDropdownOpen }) => {
  return (
    <div className="relative language-menu">
      <button
        className="flex items-center space-x-2 py-2 group"
        onClick={(e) => {
          e.stopPropagation()
          setIsDropdownOpen(!isDropdownOpen)
        }}
      >
        <span className="flex items-center">
          <Image
            src={currentLanguage.flag || "/placeholder.svg"}
            alt={`${currentLanguage.name} Flag`}
            width={24}
            height={16}
            className="mr-2"
          />
          <span className="group-hover:text-red-600 transition-colors">{currentLanguage.code.toUpperCase()}</span>
        </span>
        <ChevronDown className="h-4 w-4 group-hover:text-red-600 transition-colors" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10 border border-gray-100">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="flex items-center w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors"
              onClick={() => handleLanguageChange(lang)}
            >
              <Image
                src={lang.flag || "/placeholder.svg"}
                alt={`${lang.name} Flag`}
                width={24}
                height={16}
                className="mr-2"
              />
              <span className={currentLanguage.code === lang.code ? "font-medium text-red-600" : ""}>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
