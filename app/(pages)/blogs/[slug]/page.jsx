"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../lib/api";
import BlogContent from "../../../components/Blog/BlogContent";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get(`/v1/blogs/slug/${slug}`)
      .then(res => setBlog(res.data.data))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="text-center text-red-400 py-20 text-xl">Loading...</div>;
  }
  if (!blog) {
    return (
      <div className="text-center text-gray-400 py-20 text-lg">
        Blog not found.
        <button
          className="block mx-auto mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => router.push("/blogs")}
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return <BlogContent blog={blog} />;
}