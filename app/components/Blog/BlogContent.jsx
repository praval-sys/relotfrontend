"use client"
import Link from "next/link"

export default function BlogContent({ blog }) {
  return (
    <article className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-2">
      {/* Title at the top */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-red-700 mb-8 leading-tight text-center">
        {blog.title}
      </h1>

      {/* Featured Image - completely rendered no matter the size */}
      {blog.featuredImage && (
        <div className="w-full mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.featuredImage || "/placeholder.svg"}
            alt={blog.title}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      )}

      {/* Author, Date, Tags */}
      <div className="mb-8 space-y-4">
        {/* Author and Date */}
        <div className="flex flex-wrap items-center text-gray-600 text-lg gap-3">
          <span>
            By <span className="font-semibold text-red-600">{blog.author}</span>
          </span>
          <span className="text-gray-300">•</span>
          <span>
            {new Date(blog.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {blog.published && (
            <>
              <span className="text-gray-300">•</span>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                Published
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag} className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content with bigger text size */}
      <div className="prose prose-xl lg:prose-2xl max-w-none text-gray-800 leading-relaxed mb-12">
        <div className="text-xl sm:text-2xl lg:text-3xl leading-relaxed">{blog.content}</div>
      </div>

      {/* Back to Blogs Link */}
      <Link
        href="/blogs"
        className="inline-block px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors duration-200 text-lg"
      >
        ← Back to Blogs
      </Link>
    </article>
  )
}
