import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminBlogList({ onEdit }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/blogs?showAll=true");
      setBlogs(res.data.data || []);
    } catch (e) {
      alert("Failed to fetch blogs");
    }
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/v1/blogs/${id}`);
      setBlogs(blogs.filter(b => b._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Blogs</h2>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => onEdit(null)}
        >
          + New Blog
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500 py-8 text-center">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-gray-400 py-12 text-center text-lg">
          No blogs found. Click{" "}
          <span
            className="underline text-blue-600 cursor-pointer"
            onClick={() => onEdit(null)}
          >
            + New Blog
          </span>{" "}
          to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-lg px-4 py-3 flex flex-col md:flex-row md:items-center justify-between hover:shadow transition"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg">{blog.title}</div>
                <div className="text-gray-500 text-sm">By {blog.author}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {blog.published ? (
                    <span className="text-green-600 font-medium">Published</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Draft</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <button
                  className="bg-blue-100 text-blue-700 px-4 py-1 rounded hover:bg-blue-200 transition"
                  onClick={() => onEdit(blog)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-100 text-red-700 px-4 py-1 rounded hover:bg-red-200 transition"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}