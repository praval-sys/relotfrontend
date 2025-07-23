import { useState, useRef } from "react";
import api from "../../lib/api";

export default function AdminBlogForm({ blog, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: blog?.title || "",
    content: blog?.content || "",
    author: blog?.author || "",
    tags: blog?.tags?.join(", ") || "",
    published: blog?.published || false,
    featuredImage: blog?.featuredImage || "",
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // For image previews
  const [previews, setPreviews] = useState([]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    setForm(f => ({ ...f, images: files }));
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const removeImage = idx => {
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("content", form.content);
      data.append("author", form.author);
      data.append("tags", JSON.stringify(form.tags.split(",").map(t => t.trim())));
      data.append("published", form.published);
      if (form.images.length > 0) {
        form.images.forEach(img => data.append("images", img));
      }
      if (form.featuredImage) {
        data.append("featuredImage", form.featuredImage);
      }

      if (blog?._id) {
        await api.put(`/v1/blogs/${blog._id}`, Object.fromEntries(data));
      } else {
        await api.post("/v1/blogs", data);
      }
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Error saving blog");
    }
    setUploading(false);
  };

  return (
    <form
      className="bg-white rounded-xl shadow p-8 mb-8 max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6">{blog ? "Edit Blog" : "New Blog"}</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block font-medium mb-2">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 min-h-[240px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Write your blog content here..."
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Author</label>
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Tags (comma separated)</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-2">Published</label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="published"
              value={true}
              checked={form.published === true}
              onChange={() => setForm(f => ({ ...f, published: true }))}
              className="accent-blue-600"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="published"
              value={false}
              checked={form.published === false}
              onChange={() => setForm(f => ({ ...f, published: false }))}
              className="accent-blue-600"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-2">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="block mb-2"
        />
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2">
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full px-1 text-xs text-red-600 hover:bg-red-100"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={uploading}
        >
          {uploading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          onClick={onCancel}
          disabled={uploading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}