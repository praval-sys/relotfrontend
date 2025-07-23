"use client"
import Link from "next/link"

export default function BlogCard({ blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="block group">
      <article className="w-full transition-transform duration-300 hover:scale-[1.02]">
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="w-full aspect-[16/10] mb-4 rounded-lg overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.featuredImage || "/placeholder.svg"}
              alt={blog.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Tag overlay */}
            <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-3 py-1 rounded-full shadow-lg font-medium">
              {blog.tags?.[0] || "Blog"}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          {/* Title */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-700 group-hover:text-red-800 transition-colors duration-200 leading-tight">
            {blog.title}
          </h2>

          {/* Author and Date */}
          <div className="text-gray-600 text-sm sm:text-base flex flex-wrap items-center gap-2">
            <span>
              By <span className="font-semibold text-red-600">{blog.author}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span>
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Content Preview */}
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed line-clamp-3">
            {blog.content.slice(0, 150)}...
          </p>

          {/* Tags (if more than one) */}
          {blog.tags?.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {blog.tags.slice(1, 4).map((tag) => (
                <span key={tag} className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More */}
          <div className="pt-2">
            <span className="inline-flex items-center text-red-600 font-semibold text-base group-hover:text-red-700 transition-colors duration-200">
              Read More
              <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
