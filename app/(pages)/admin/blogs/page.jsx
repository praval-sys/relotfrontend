"use client"
import { useState } from "react";
import AdminBlogList from "../../../components/Blog/AdminBlogList";
import AdminBlogForm from "../../../components/Blog/AdminBlogForm";

export default function AdminBlogPage() {
  const [editingBlog, setEditingBlog] = useState(undefined); // undefined means list, null means new, object means edit
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-5xl mx-auto py-8">
      {editingBlog === undefined ? (
        <AdminBlogList
          key={refresh}
          onEdit={blog => setEditingBlog(blog === null ? null : blog)}
        />
      ) : (
        <AdminBlogForm
          blog={editingBlog}
          onSuccess={() => {
            setEditingBlog(undefined);
            setRefresh(r => r + 1);
          }}
          onCancel={() => setEditingBlog(undefined)}
        />
      )}
    </div>
  );
}