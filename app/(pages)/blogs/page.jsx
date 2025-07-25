"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import BlogCard from "../../components/Blog/BlogCard";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/v1/blogs")
      .then(res => setBlogs(res.data.data || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="lining-nums max-w-5xl mx-auto px-4 py-10 mt-2">
      <h1 className="text-4xl font-extrabold text-red-700 mb-8 text-center tracking-tight">
        Relot Blogs
      </h1>
      {loading ? (
        <div className="text-center text-red-400 py-20 text-xl">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-400 py-20 text-lg">
          No blogs found.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}